// ============================================
// CMS Posts Server Actions
// Full CRUD operations for posts management
// ============================================

'use server'

import { createClient } from '@/lib/supabase/server'
import { requireEditor, getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
// import { redirect } from 'next/navigation'
import {
    PostFormData,
    PostInsert,
    PostUpdate,
    APIResponse
} from '@/lib/types/cms'
import { generateSlug } from '@/lib/utils/slug'

/**
 * Create a new post
 */
export async function createPost(formData: PostFormData): Promise<APIResponse<{ id: string }>> {
    try {
        await requireEditor()
        const supabase = await createClient()
        const user = await getUser()

        if (!user) {
            return { success: false, error: 'Chưa đăng nhập' }
        }

        // Generate slug if not provided
        const slug = formData.slug || generateSlug(formData.title)

        // Create post
        const postData: PostInsert = {
            title: formData.title,
            slug,
            content: formData.content,
            excerpt: formData.excerpt,
            featured_image_id: formData.featured_image_id,
            status: formData.status,
            author_id: user.id
        }

        const { data: post, error: postError } = await supabase
            .from('posts')
            .insert(postData)
            .select('id')
            .single()

        if (postError || !post) {
            return { success: false, error: postError?.message || 'Không thể tạo bài viết' }
        }

        // Add categories
        if (formData.category_ids && formData.category_ids.length > 0) {
            const categoryData = formData.category_ids.map(cat_id => ({
                post_id: post.id,
                category_id: cat_id
            }))

            await supabase.from('post_categories').insert(categoryData)
        }

        // Add tags
        if (formData.tag_ids && formData.tag_ids.length > 0) {
            const tagData = formData.tag_ids.map(tag_id => ({
                post_id: post.id,
                tag_id: tag_id
            }))

            await supabase.from('post_tags').insert(tagData)
        }

        // Add SEO metadata if provided
        if (formData.seo) {
            await supabase.from('seo_metadata').insert({
                object_type: 'post',
                object_id: post.id,
                ...formData.seo
            })
        }

        revalidatePath('/admin/posts')
        return {
            success: true,
            data: { id: post.id },
            message: 'Đã tạo bài viết thành công'
        }
    } catch (error) {
        console.error('Create post error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Update existing post
 */
export async function updatePost(
    postId: string,
    formData: PostFormData
): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        // Update post
        const postData: PostUpdate = {
            title: formData.title,
            slug: formData.slug,
            content: formData.content,
            excerpt: formData.excerpt,
            featured_image_id: formData.featured_image_id,
            status: formData.status
        }

        const { error: postError } = await supabase
            .from('posts')
            .update(postData)
            .eq('id', postId)

        if (postError) {
            return { success: false, error: postError.message }
        }

        // Update categories - delete old, insert new
        await supabase.from('post_categories').delete().eq('post_id', postId)

        if (formData.category_ids && formData.category_ids.length > 0) {
            const categoryData = formData.category_ids.map(cat_id => ({
                post_id: postId,
                category_id: cat_id
            }))
            await supabase.from('post_categories').insert(categoryData)
        }

        // Update tags - delete old, insert new
        await supabase.from('post_tags').delete().eq('post_id', postId)

        if (formData.tag_ids && formData.tag_ids.length > 0) {
            const tagData = formData.tag_ids.map(tag_id => ({
                post_id: postId,
                tag_id: tag_id
            }))
            await supabase.from('post_tags').insert(tagData)
        }

        // Update or create SEO metadata
        if (formData.seo) {
            const { data: existingSEO } = await supabase
                .from('seo_metadata')
                .select('id')
                .eq('object_type', 'post')
                .eq('object_id', postId)
                .single()

            if (existingSEO) {
                await supabase
                    .from('seo_metadata')
                    .update(formData.seo)
                    .eq('id', existingSEO.id)
            } else {
                await supabase.from('seo_metadata').insert({
                    object_type: 'post',
                    object_id: postId,
                    ...formData.seo
                })
            }
        }

        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${postId}/edit`)

        return {
            success: true,
            message: 'Đã cập nhật bài viết thành công'
        }
    } catch (error) {
        console.error('Update post error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Delete post
 */
export async function deletePost(postId: string): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/posts')
        return {
            success: true,
            message: 'Đã xoá bài viết thành công'
        }
    } catch (error) {
        console.error('Delete post error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Publish post
 */
export async function publishPost(postId: string): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const { error } = await supabase
            .from('posts')
            .update({
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', postId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${postId}/edit`)

        return {
            success: true,
            message: 'Đã xuất bản bài viết thành công'
        }
    } catch (error) {
        console.error('Publish post error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Unpublish post (back to draft)
 */
export async function unpublishPost(postId: string): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const { error } = await supabase
            .from('posts')
            .update({
                status: 'draft',
                published_at: null
            })
            .eq('id', postId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/posts')
        revalidatePath(`/admin/posts/${postId}/edit`)

        return {
            success: true,
            message: 'Đã chuyển về nháp thành công'
        }
    } catch (error) {
        console.error('Unpublish post error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Get all categories for form select
 */
export async function getCategories() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name')

    if (error) {
        return []
    }

    return data || []
}

/**
 * Get all tags for form select
 */
export async function getTags() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('tags')
        .select('id, name, slug')
        .order('name')

    if (error) {
        return []
    }

    return data || []
}
