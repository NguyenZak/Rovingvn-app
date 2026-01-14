/**
 * Tour Actions
 * Server actions for Tours CRUD operations
 */

"use server";

import { createClient, createPublicClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac/permissions";

export interface Tour {
    id: string;
    title: string;
    slug: string;
    description?: string;
    short_description?: string;
    duration_days?: number;
    duration_nights?: number;
    max_participants?: number;
    min_participants?: number;
    difficulty_level?: string;
    price_adult?: number;
    price_child?: number;
    currency?: string;
    featured_image?: string;
    gallery_images?: string[];
    start_location?: string;
    end_location?: string;
    itinerary?: unknown[];
    includes?: string[];
    excludes?: string[];
    meta_title?: string;
    meta_description?: string;
    meta_keywords?: string[];
    status?: string;
    featured?: boolean;
    created_at?: string;
    updated_at?: string;
    created_by?: string;
    updated_by?: string;
    // Many-to-many relationship with destinations
    destination_ids?: string[];
    destinations?: Array<{
        id: string;
        name: string;
        slug: string;
    }>;
}

export interface ToursListParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    featured?: boolean;
    sortBy?: string;
    orderBy?: 'asc' | 'desc';
}

/**
 * Get all tours with pagination and filters
 */
export async function getAllTours(params: ToursListParams = {}) {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status,
            featured,
            sortBy = 'created_at',
            orderBy = 'desc'
        } = params;

        const supabase = await createPublicClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        let query = supabase
            .from('tours')
            .select('*', { count: 'exact' });

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (status) {
            query = query.eq('status', status);
        }

        if (featured !== undefined) {
            query = query.eq('featured', featured);
        }

        query = query
            .order(sortBy, { ascending: orderBy === 'asc' })
            .range(from, to);

        const { data, error, count } = await query;

        if (error) {
            console.error('Error fetching tours:', error);
            return { success: false, error: 'Failed to fetch tours' };
        }

        // Fetch destinations for each tour
        const tours = data as Tour[] || [];
        if (tours.length > 0) {
            const tourIds = tours.map(t => t.id);
            const { data: tourDestinations } = await supabase
                .from('tour_destinations')
                .select('tour_id, destination_id, destinations(id, name, slug)')
                .in('tour_id', tourIds);

            // Map destinations to tours
            tours.forEach(tour => {
                const dests = tourDestinations?.filter(td => td.tour_id === tour.id) || [];
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                tour.destinations = dests.map(td => td.destinations as any).filter(Boolean);
                tour.destination_ids = dests.map(td => td.destination_id);
            });
        }

        return {
            success: true,
            data: tours,
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    } catch {
        return { success: false, error: 'Failed to fetch tours' };
    }
}

/**
 * Get single tour by ID
 */
export async function getTourById(id: string) {
    try {
        const supabase = await createPublicClient();
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('id', id)
            .single();

        if (error) return { success: false, error: error.message };

        return { success: true, data: data as Tour };
    } catch {
        return { success: false, error: 'Failed to fetch tour' };
    }
}

/**
 * Get tour by slug
 */
export async function getTourBySlug(slug: string) {
    try {
        const supabase = await createPublicClient();
        const { data, error } = await supabase
            .from('tours')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) return { success: false, error: error.message };

        const tour = data as Tour;

        // Fetch destinations for this tour
        const { data: tourDestinations } = await supabase
            .from('tour_destinations')
            .select('destination_id, destinations(id, name, slug)')
            .eq('tour_id', tour.id);

        if (tourDestinations) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tour.destinations = tourDestinations.map(td => td.destinations as any).filter(Boolean);
            tour.destination_ids = tourDestinations.map(td => td.destination_id);
        }

        return { success: true, data: tour };
    } catch {
        return { success: false, error: 'Failed to fetch tour' };
    }
}

/**
 * Get tours by Destination ID
 */
export async function getToursByDestinationId(destinationId: string) {
    try {
        const supabase = await createPublicClient();

        // 1. Get tour IDs first (Two-step fetch to avoid schema cache issues with joins)
        const { data: tourDestinations, error: idError } = await supabase
            .from('tour_destinations')
            .select('tour_id')
            .eq('destination_id', destinationId);

        if (idError) {
            console.error('Error fetching tour IDs:', idError);
            return { success: false, error: idError.message };
        }

        const tourIds = tourDestinations?.map(td => td.tour_id) || [];

        if (tourIds.length === 0) {
            return { success: true, data: [] };
        }

        // 2. Fetch tours with those IDs
        const { data: tours, error: toursError } = await supabase
            .from('tours')
            .select('*')
            .in('id', tourIds)
            .eq('status', 'published')
            .order('title');

        if (toursError) {
            console.error('Error fetching tours:', toursError);
            return { success: false, error: toursError.message };
        }

        return { success: true, data: tours as Tour[] };
    } catch (e) {
        console.error('Exception fetching tours by destination:', e);
        return { success: false, error: 'Failed to fetch tours' };
    }
}

/**
 * Helper function to sync tour-destination relationships
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncTourDestinations(supabase: any, tourId: string, destinationIds: string[]) {
    // Delete existing relationships
    await supabase
        .from('tour_destinations')
        .delete()
        .eq('tour_id', tourId);

    // Insert new relationships
    if (destinationIds && destinationIds.length > 0) {
        const records = destinationIds.map(destId => ({
            tour_id: tourId,
            destination_id: destId
        }));

        const { error } = await supabase
            .from('tour_destinations')
            .insert(records);

        if (error) {
            console.error('Error syncing tour destinations:', error);
            throw error;
        }
    }
}

/**
 * Create tour
 */
export async function createTour(tourData: Partial<Tour>) {
    try {
        const canCreate = await hasPermission('create_tours');
        if (!canCreate) {
            return { success: false, error: 'Permission denied' };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Extract destination_ids before inserting
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { destination_ids, ...tourDataWithoutDests } = tourData as any;

        const { data, error } = await supabase
            .from('tours')
            .insert({
                ...tourDataWithoutDests,
                created_by: user.id,
                updated_by: user.id
            })
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        // Sync destinations if provided
        if (destination_ids && destination_ids.length > 0) {
            await syncTourDestinations(supabase, data.id, destination_ids);
        }

        revalidatePath('/admin/tours');
        revalidatePath('/tours');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to create tour' };
    }
}

/**
 * Update tour
 */
export async function updateTour(id: string, tourData: Partial<Tour>) {
    try {
        const canEdit = await hasPermission('edit_tours');
        if (!canEdit) {
            return { success: false, error: 'Permission denied' };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // Extract destination_ids before updating
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { destination_ids, ...tourDataWithoutDests } = tourData as any;

        const { data, error } = await supabase
            .from('tours')
            .update({
                ...tourDataWithoutDests,
                updated_by: user.id
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        // Sync destinations if provided
        if (destination_ids !== undefined) {
            await syncTourDestinations(supabase, id, destination_ids);
        }

        revalidatePath('/admin/tours');
        revalidatePath('/tours');
        revalidatePath(`/tours/${data.slug}`);
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to update tour' };
    }
}

/**
 * Delete tour
 */
export async function deleteTour(id: string) {
    try {
        const canDelete = await hasPermission('delete_tours');
        if (!canDelete) {
            return { success: false, error: 'Permission denied' };
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from('tours')
            .delete()
            .eq('id', id);

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/tours');
        revalidatePath('/tours');
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to delete tour' };
    }
}

/**
 * Update tour status
 */
export async function updateTourStatus(id: string, status: string) {
    try {
        const canEdit = await hasPermission('edit_tours');
        if (!canEdit) {
            return { success: false, error: 'Permission denied' };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        const { data, error } = await supabase
            .from('tours')
            .update({
                status,
                updated_by: user.id
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/tours');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to update status' };
    }
}

/**
 * Toggle tour featured status
 */
export async function toggleTourFeatured(id: string, featured?: boolean) {
    try {
        const canEdit = await hasPermission('edit_tours');
        if (!canEdit) {
            return { success: false, error: 'Permission denied' };
        }

        const supabase = await createClient();

        let newFeatured = featured;

        if (newFeatured === undefined) {
            // Get current featured status if not provided
            const { data: tour } = await supabase
                .from('tours')
                .select('featured')
                .eq('id', id)
                .single();

            if (!tour) {
                return { success: false, error: 'Tour not found' };
            }
            newFeatured = !tour.featured;
        }

        // Update it
        const { data, error } = await supabase
            .from('tours')
            .update({ featured: newFeatured })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return { success: false, error: error.message };
        }

        revalidatePath('/admin/tours');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to toggle featured' };
    }
}
