/**
 * Destination Actions
 * Server actions for Destination CRUD operations
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac/permissions";

export interface Destination {
    id: string;
    name: string;
    slug: string;
    description?: string;
    short_description?: string;
    country?: string;
    region?: string;
    image_url?: string;
    gallery_images?: string[];
    best_time_to_visit?: string;
    climate_info?: string;
    attractions?: string;
    currency?: string;
    language?: string;
    highlights?: string[];
    meta_title?: string;
    meta_description?: string;
    status: 'draft' | 'published' | 'archived';
    featured: boolean;
}

/**
 * Get all destinations with pagination and filters
 */
export async function getAllDestinations(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    region?: string;
} = {}) {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status,
            region
        } = params;

        const supabase = await createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('destinations')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`name.ilike.%${search}%,short_description.ilike.%${search}%`);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (region) {
            query = query.eq('region', region);
        }

        query = query.order('name', { ascending: true })
            .range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching destinations:', error);
            return { success: false, error: 'Failed to fetch destinations' };
        }

        return {
            success: true,
            data: data as Destination[] || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    } catch {
        return { success: false, error: 'Failed to fetch destinations' };
    }
}

/**
 * Get single destination by ID
 */
export async function getDestinationById(id: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as Destination };
    } catch {
        return { success: false, error: 'Failed to fetch destination' };
    }
}

/**
 * Get distinct regions for filtering
 */
export async function getDestinationRegions() {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('destinations')
            .select('region')
            .not('region', 'is', null)
            .order('region');

        if (error) return [];

        // Return unique regions
        const regions = Array.from(new Set(data.map(d => d.region).filter(Boolean)));
        return regions;
    } catch {
        return [];
    }
}

/**
 * Get single destination by Slug
 */
export async function getDestinationBySlug(slug: string) {
    try {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from('destinations')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as Destination };
    } catch {
        return { success: false, error: 'Failed to fetch destination' };
    }
}

/**
 * Create destination
 */
export async function createDestination(data: Partial<Destination>) {
    try {
        const canCreate = await hasPermission('manage_tours'); // Reuse tours permission for now
        if (!canCreate) {
            // Fallback to role check if needed, but let's assume permission is enough
            // Or check: const isAdmin = await hasRole('admin') || await hasRole('editor');
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return { success: false, error: 'Not authenticated' };

        const { data: result, error } = await supabase
            .from('destinations')
            .insert(data)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/destinations');
        return { success: true, data: result };
    } catch {
        return { success: false, error: 'Failed to create destination' };
    }
}

/**
 * Update destination
 */
export async function updateDestination(id: string, data: Partial<Destination>) {
    try {
        const supabase = await createClient();
        // const { data: { user } } = await supabase.auth.getUser();

        const { data: result, error } = await supabase
            .from('destinations')
            .update(data)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/destinations');
        return { success: true, data: result };
    } catch {
        return { success: false, error: 'Failed to update destination' };
    }
}

/**
 * Delete destination
 */
export async function deleteDestination(id: string) {
    try {
        const supabase = await createClient();
        const { error } = await supabase
            .from('destinations')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/destinations');
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to delete destination' };
    }
}
