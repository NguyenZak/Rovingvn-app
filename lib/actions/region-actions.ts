'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface Region {
    id: string
    name: string
    slug: string
    description: string | null
    details: string | null
    image_url: string | null
    color: string | null
    link: string | null
    display_order: number
    created_at: string
    updated_at: string
}

export type RegionInput = Omit<Region, 'id' | 'created_at' | 'updated_at'>

/**
 * Get all regions ordered by display_order
 */
export async function getRegions() {
    const supabase = await createClient()

    // Check if table exists first/handle error gracefully if migration hasn't run yet in some envs
    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .order('display_order', { ascending: true })

    if (error) {
        console.error('Error fetching regions:', error)
        return {
            success: false,
            error: error.message || JSON.stringify(error) || 'Unknown error',
            data: []
        }
    }

    return { success: true, data: data as Region[] }
}

/**
 * Get single region by ID
 */
export async function getRegion(id: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching region:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: data as Region }
}

/**
 * Get single region by slug
 */
export async function getRegionBySlug(slug: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('regions')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error) {
        console.error('Error fetching region by slug:', error)
        return { success: false, error: error.message }
    }

    return { success: true, data: data as Region }
}

/**
 * Create a new region
 */
export async function createRegion(data: Partial<RegionInput>) {
    const supabase = await createClient()

    const { data: newRegion, error } = await supabase
        .from('regions')
        .insert(data)
        .select()
        .single()

    if (error) {
        console.error('Error creating region:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/regions')
    revalidatePath('/') // Revalidate homepage where regions are shown
    return { success: true, data: newRegion as Region }
}

/**
 * Update a region
 */
export async function updateRegion(id: string, data: Partial<RegionInput>) {
    const supabase = await createClient()

    const { data: updatedRegion, error } = await supabase
        .from('regions')
        .update(data)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error('Error updating region:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/regions')
    revalidatePath(`/admin/regions/${id}`)
    revalidatePath('/')
    return { success: true, data: updatedRegion as Region }
}

/**
 * Delete a region
 */
export async function deleteRegion(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('regions')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting region:', error)
        return { success: false, error: error.message }
    }

    revalidatePath('/admin/regions')
    revalidatePath('/')
    return { success: true }
}
