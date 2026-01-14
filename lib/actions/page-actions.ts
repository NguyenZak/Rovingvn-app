'use server'

import { createClient, createPublicClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface PageContent {
    id: string
    slug: string
    title: string
    content: Record<string, any>
    meta_title?: string
    meta_description?: string
    updated_by?: string
    created_at: string
    updated_at: string
}

/**
 * Get page content by slug
 */
export async function getPageContent(slug: string) {
    try {
        const supabase = await createPublicClient()

        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .eq('slug', slug)
            .single()

        if (error) {
            console.error('Error fetching page content:', error)
            return { success: false, error: error.message, data: null }
        }

        return { success: true, data: data as PageContent }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to fetch page content', data: null }
    }
}

/**
 * Get all pages (Admin only)
 */
export async function getAllPages() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('page_content')
            .select('*')
            .order('slug')

        if (error) {
            console.error('Error fetching pages:', error)
            return { success: false, error: error.message, data: [] }
        }

        return { success: true, data: data as PageContent[] }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to fetch pages', data: [] }
    }
}

/**
 * Update page content (Admin only)
 */
export async function updatePageContent(slug: string, updates: {
    title?: string
    content?: Record<string, any>
    meta_title?: string
    meta_description?: string
}) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        const { data, error } = await supabase
            .from('page_content')
            .update({
                ...updates,
                updated_by: user.id
            })
            .eq('slug', slug)
            .select()
            .single()

        if (error) {
            console.error('Error updating page content:', error)
            return { success: false, error: error.message }
        }

        // Revalidate the public page
        revalidatePath(`/${slug}`)
        revalidatePath('/admin/pages')

        return { success: true, data: data as PageContent }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to update page content' }
    }
}

/**
 * Create a new page (Admin only)
 */
export async function createPage(data: {
    slug: string
    title: string
    content?: Record<string, any>
    meta_title?: string
    meta_description?: string
}) {
    try {
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: 'Not authenticated' }
        }

        // Validate slug format (lowercase, alphanumeric, hyphens only)
        const slugRegex = /^[a-z0-9-]+$/
        if (!slugRegex.test(data.slug)) {
            return {
                success: false,
                error: 'Slug must contain only lowercase letters, numbers, and hyphens'
            }
        }

        const { data: result, error } = await supabase
            .from('page_content')
            .insert({
                slug: data.slug,
                title: data.title,
                content: data.content || {},
                meta_title: data.meta_title,
                meta_description: data.meta_description,
                updated_by: user.id
            })
            .select()
            .single()

        if (error) {
            console.error('Error creating page:', error)
            if (error.code === '23505') {
                return { success: false, error: 'A page with this slug already exists' }
            }
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/pages')

        return { success: true, data: result }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to create page' }
    }
}
