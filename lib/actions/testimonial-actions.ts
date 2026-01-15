/**
 * Testimonial Actions
 * Server actions for Testimonials CRUD operations
 */

"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface Testimonial {
    id: string;
    name: string;
    role: string | null;
    content: string;
    rating: number;
    avatar_url: string | null;
    status: 'published' | 'draft' | 'archived';
    display_order: number;
    created_at: string;
}

export type TestimonalInput = Omit<Testimonial, 'id' | 'created_at'>;

/**
 * Get all testimonials (Admin)
 */
export async function getAllTestimonials(params?: { status?: string }) {
    try {
        const supabase = await createPublicClient();
        let query = supabase
            .from('testimonials')
            .select('*')
            .order('display_order', { ascending: true })
            .order('created_at', { ascending: false });

        if (params?.status) {
            query = query.eq('status', params.status);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching testimonials:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data as Testimonial[] };
    } catch (error) {
        return { success: false, error: 'Failed to fetch testimonials' };
    }
}

/**
 * Get published testimonials (Public)
 */
export async function getPublishedTestimonials() {
    return getAllTestimonials({ status: 'published' });
}

/**
 * Create testimonial
 */
export async function createTestimonial(data: Partial<TestimonalInput>) {
    try {
        const supabase = await createClient();

        // Auth check (simple admin check matching other actions)
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { data: newTestimonial, error } = await supabase
            .from('testimonials')
            .insert(data)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, data: newTestimonial as Testimonial };
    } catch (error) {
        return { success: false, error: 'Failed to create testimonial' };
    }
}

/**
 * Update testimonial
 */
export async function updateTestimonial(id: string, data: Partial<TestimonalInput>) {
    try {
        const supabase = await createClient();

        // Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { data: updated, error } = await supabase
            .from('testimonials')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true, data: updated as Testimonial };
    } catch (error) {
        return { success: false, error: 'Failed to update testimonial' };
    }
}

/**
 * Delete testimonial
 */
export async function deleteTestimonial(id: string) {
    try {
        const supabase = await createClient();

        // Auth check
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return { success: false, error: 'Not authenticated' };

        const { error } = await supabase
            .from('testimonials')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/testimonials');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to delete testimonial' };
    }
}
