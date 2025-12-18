/**
 * Blog Actions
 * Server actions for Blog CRUD operations
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    content: string;
    featured_image?: string;
    category_id?: string;
    tags?: string[];
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
    published_at?: string;
    author_id?: string;
    created_at: string;
    updated_at: string;
    views_count: number;
    category?: {
        id: string;
        name: string;
        slug: string;
    };
    author?: {
        email: string;
    };
}

export interface BlogCategory {
    id: string;
    name: string;
    slug: string;
    description?: string;
    count?: number;
}

/**
 * Get all blog posts with pagination and filters
 */
export async function getAllPosts(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    category?: string;
} = {}) {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status,
            category
        } = params;

        const supabase = await createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('blog_posts')
            .select(`
        *,
        category:blog_categories(id, name, slug)
      `, { count: 'exact' });

        if (search) {
            query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%`);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (category) {
            query = query.eq('category_id', category);
        }

        query = query.order('created_at', { ascending: false })
            .range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching posts:', error);
            return { success: false, error: error.message };
        }

        // Process author info using view if needed, or just return IDs for now
        // We can join with auth.users if we have a view, or fetch separately.
        // user_roles_with_emails view exists but it's for roles.
        // For now we'll just return the posts. Backend usually joins usually but auth.users is special.
        // We can rely on updated_by/created_by logic if added.

        return {
            success: true,
            data: data as BlogPost[] || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    } catch (error) {
        console.error('Error getAllPosts:', error);
        return { success: false, error: 'Failed to fetch posts' };
    }
}

/**
 * Get single post by ID
 */
export async function getPostById(id: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
            .eq('id', id)
            .single();

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as BlogPost };
    } catch {
        return { success: false, error: 'Failed to fetch post' };
    }
}

/**
 * Get single post by slug (for public blog detail page)
 */
export async function getPostBySlug(slug: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
        *,
        category:blog_categories(id, name, slug)
      `)
            .eq('slug', slug)
            .eq('status', 'published')
            .single();

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as BlogPost };
    } catch {
        return { success: false, error: 'Failed to fetch post' };
    }
}

/**
 * Increment view count for a blog post
 */
export async function incrementViewCount(id: string) {
    try {
        const supabase = await createClient();

        // First get current count
        const { data: post } = await supabase
            .from('blog_posts')
            .select('views_count')
            .eq('id', id)
            .single();

        if (!post) return { success: false, error: 'Post not found' };

        // Increment the count
        const { error } = await supabase
            .from('blog_posts')
            .update({ views_count: (post.views_count || 0) + 1 })
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        return { success: true };
    } catch {
        return { success: false, error: 'Failed to increment view count' };
    }
}

/**
 * Get related posts by category
 */
export async function getRelatedPosts(categoryId: string, currentPostId: string, limit: number = 3) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
        id,
        title,
        slug,
        excerpt,
        featured_image,
        created_at,
        category:blog_categories(id, name, slug)
      `)
            .eq('category_id', categoryId)
            .eq('status', 'published')
            .neq('id', currentPostId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as unknown as Partial<BlogPost>[] };
    } catch {
        return { success: false, error: 'Failed to fetch related posts' };
    }
}

/**
 * Create blog post
 */
export async function createPost(postData: Partial<BlogPost>) {
    try {
        // const canCreate = await hasPermission('manage_blog');
        // Or check role directly if specific permission doesn't exist
        // In migration 20241217_rbac_simple.sql we have 'create_content' ? 
        // Let's assume generic editor role check if not specific.
        // Permission list in migration: manage_users, manage_roles, view_dashboard...
        // Actually migration file shows seed data. I'll use hasPermission with 'manage_content' or just check roles.
        // Let's use 'manage_content' permission if available, or just fallback to role check in policies.
        // For now, let's try to stick to what we know exists or use generic roles check wrapper if needed.
        // I will check hasRole('editor') or hasRole('admin') via policies mainly, 
        // but explicit check is better.

        // Simplest: Check if user is authenticated here, specific logic is in RLS.
        // But good UX requires feedback.

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: 'Not authenticated' };

        const { data, error } = await supabase
            .from('blog_posts')
            .insert({
                ...postData,
                author_id: user.id
            })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/blog');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to create post' };
    }
}

/**
 * Update blog post
 */
export async function updatePost(id: string, postData: Partial<BlogPost>) {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from('blog_posts')
            .update(postData)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/blog');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to update post' };
    }
}

/**
 * Delete blog post
 */
export async function deletePost(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('blog_posts')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/blog');
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to delete post' };
    }
}

/**
 * Get all categories
 */
export async function getCategories() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('blog_categories')
            .select('*')
            .order('name');

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as BlogCategory[] };
    } catch {
        return { success: false, error: 'Failed to fetch categories' };
    }
}

/**
 * Create category
 */
export async function createCategory(name: string, description?: string) {
    try {
        const supabase = await createClient();

        // Auto generate slug
        const slug = name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '');

        const { data, error } = await supabase
            .from('blog_categories')
            .insert({ name, slug, description })
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/blog');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to create category' };
    }
}
