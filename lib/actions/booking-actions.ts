/**
 * Booking Actions
 * Server actions for Booking CRUD operations
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { hasPermission } from "@/lib/rbac/permissions";

export interface Booking {
    id: string;
    tour_id: string;
    user_id?: string;
    customer_info: {
        name: string;
        email: string;
        phone: string;
        address?: string;
        nationality?: string;
        [key: string]: unknown;
    };
    travel_date: string;
    adults: number;
    children: number;
    infants: number;
    total_price: number;
    currency: string;
    payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
    payment_method?: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    special_requests?: string;
    admin_notes?: string;
    booking_code: string;
    created_at: string;
    updated_at: string;
    tour?: {
        id: string;
        title: string;
        slug: string;
        featured_image?: string;
    };
}

/**
 * Get all bookings with filtering and pagination
 */
export async function getAllBookings(params: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    payment_status?: string;
    dateFrom?: string;
    dateTo?: string;
} = {}) {
    try {
        const {
            page = 1,
            limit = 20,
            search = '',
            status,
            payment_status,
            dateFrom,
            dateTo
        } = params;

        const supabase = await createClient();
        const from = (page - 1) * limit;
        const to = from + limit - 1;

        // const { data: { user } } = await supabase.auth.getUser();

        // 1. Fetch bookings without joining tours to avoid FK error
        let query = supabase
            .from('bookings')
            .select(`*`, { count: 'exact' });

        if (search) {
            query = query.or(`booking_code.ilike.%${search}%,customer_info->>email.ilike.%${search}%,customer_info->>name.ilike.%${search}%`);
        }

        if (status) query = query.eq('status', status);
        if (payment_status) query = query.eq('payment_status', payment_status);

        if (dateFrom) query = query.gte('travel_date', dateFrom);
        if (dateTo) query = query.lte('travel_date', dateTo);

        query = query.order('created_at', { ascending: false })
            .range(from, to);

        const { data: bookingsData, error, count } = await query;

        if (error) {
            console.error('Error fetching bookings:', error);
            return { success: false, error: error.message };
        }

        // 2. Manually fetch usage tour details
        const bookings = bookingsData as Booking[] || [];
        if (bookings.length > 0) {
            const tourIds = bookings.map(b => b.tour_id).filter(Boolean);
            // Deduplicate ids
            const uniqueTourIds = Array.from(new Set(tourIds));

            if (uniqueTourIds.length > 0) {
                const { data: tours } = await supabase
                    .from('tours')
                    .select('id, title, slug, featured_image')
                    .in('id', uniqueTourIds);

                // Map tours back to bookings
                if (tours) {
                    bookings.forEach(booking => {
                        booking.tour = tours.find(t => t.id === booking.tour_id);
                    });
                }
            }
        }

        const data = bookings; // Alias for return below

        return {
            success: true,
            data: data as Booking[] || [],
            pagination: {
                page,
                limit,
                total: count || 0,
                totalPages: Math.ceil((count || 0) / limit)
            }
        };
    } catch {
        return { success: false, error: 'Failed to fetch bookings' };
    }
}

/**
 * Get single booking by ID
 */
export async function getBookingById(id: string) {
    try {
        const supabase = await createClient();

        // 1. Fetch booking
        const { data: bookingData, error } = await supabase
            .from('bookings')
            .select(`*`)
            .eq('id', id)
            .single();

        if (error) return { success: false, error: error.message };

        const booking = bookingData as Booking;

        // 2. Fetch tour details manually
        if (booking.tour_id) {
            const { data: tour } = await supabase
                .from('tours')
                .select('id, title, slug, duration_days, featured_image')
                .eq('id', booking.tour_id)
                .single();

            if (tour) {
                booking.tour = tour;
            }
        }

        return { success: true, data: booking };
    } catch {
        return { success: false, error: 'Failed to fetch booking' };
    }
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
    id: string,
    status: Booking['status'],
    payment_status?: Booking['payment_status']
) {
    try {
        const canManage = await hasPermission('manage_tours'); // Reuse managing tours permission for now
        if (!canManage) return { success: false, error: 'Unauthorized' };

        const supabase = await createClient();

        const updateData: Partial<Booking> = { status };
        if (payment_status) updateData.payment_status = payment_status;

        const { data, error } = await supabase
            .from('bookings')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/bookings');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to update booking' };
    }
}

/**
 * Create a new booking (Public or Admin)
 */
export async function createBooking(bookingData: Partial<Booking>) {
    try {
        // For admin creation, check auth.
        // For public creation, we might skip permission check here if logic allows
        // But this action is mostly for Admin usage or authenticated flow.
        const supabase = await createClient();

        // If it's an admin creating it, we might want to check permissions
        // const { data: { user } } = await supabase.auth.getUser();
        // if (user) {
        //     const canManage = await hasPermission('manage_tours');
        //     // ...
        // }

        const { data, error } = await supabase
            .from('bookings')
            .insert(bookingData)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/bookings');
        return { success: true, data };
    } catch {
        return { success: false, error: 'Failed to create booking' };
    }
}

/**
 * Update booking details
 */
export async function updateBooking(id: string, bookingData: Partial<Booking>) {
    try {
        const canManage = await hasPermission('manage_tours');
        if (!canManage) return { success: false, error: 'Unauthorized' };

        const supabase = await createClient();

        // Remove ID if present in data to avoid error
        // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
        const { id: _id, created_at: _created, updated_at: _updated, tour: _tour, ...updateData } = bookingData as any;

        const { data, error } = await supabase
            .from('bookings')
            .update({
                ...updateData,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/bookings');
        revalidatePath(`/admin/bookings/${id}`);
        return { success: true, data };
    } catch (error) {
        console.error('Update booking error:', error);
        return { success: false, error: 'Failed to update booking' };
    }
}

/**
 * Delete booking
 */
export async function deleteBooking(id: string) {
    try {
        const canManage = await hasPermission('manage_tours');
        if (!canManage) return { success: false, error: 'Unauthorized' };

        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .delete()
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath('/admin/bookings');
        return { success: true };
    } catch (error) {
        console.error('Delete booking error:', error);
        return { success: false, error: 'Failed to delete booking' };
    }
}

/**
 * Add admin notes to a booking
 */
export async function addBookingNote(id: string, note: string) {
    try {
        const canManage = await hasPermission('manage_tours');
        if (!canManage) return { success: false, error: 'Unauthorized' };

        const supabase = await createClient();
        const { error } = await supabase
            .from('bookings')
            .update({ admin_notes: note })
            .eq('id', id);

        if (error) return { success: false, error: error.message };

        revalidatePath(`/admin/bookings/${id}`);
        return { success: true };
    } catch {
        return { success: false, error: 'Failed to add note' };
    }
}
