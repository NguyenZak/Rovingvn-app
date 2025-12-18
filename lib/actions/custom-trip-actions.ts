'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface CustomTripSubmission {
    customer_name: string
    customer_email: string
    customer_phone: string
    destinations: Array<{
        id: string
        name: string
        region?: string
    }>
    duration_days: number
    travel_date?: string
    travel_styles: Array<{
        id: string
        name: string
    }>
    number_of_travelers: number
    additional_notes?: string
}

export interface CustomTrip extends CustomTripSubmission {
    id: string
    status: 'pending' | 'reviewed' | 'contacted' | 'converted' | 'archived'
    admin_notes?: string
    created_at: string
    updated_at: string
}

/**
 * Submit a custom trip request from the public form
 */
export async function submitCustomTrip(data: CustomTripSubmission) {
    try {
        const supabase = await createClient()

        // Validate required fields
        if (!data.customer_name || !data.customer_email || !data.customer_phone) {
            return {
                success: false,
                error: 'Please provide your name, email, and phone number.'
            }
        }

        if (!data.destinations || data.destinations.length === 0) {
            return {
                success: false,
                error: 'Please select at least one destination.'
            }
        }

        if (!data.duration_days || data.duration_days < 1) {
            return {
                success: false,
                error: 'Please specify trip duration.'
            }
        }

        // Insert into database
        const { data: result, error } = await supabase
            .from('custom_trips')
            .insert({
                customer_name: data.customer_name,
                customer_email: data.customer_email,
                customer_phone: data.customer_phone,
                destinations: data.destinations,
                duration_days: data.duration_days,
                travel_date: data.travel_date || null,
                travel_styles: data.travel_styles || [],
                number_of_travelers: data.number_of_travelers || 1,
                additional_notes: data.additional_notes || null,
                status: 'pending'
            })
            .select()
            .single()

        if (error) {
            console.error('Error submitting custom trip:', error)
            return {
                success: false,
                error: 'Failed to submit your request. Please try again.'
            }
        }

        revalidatePath('/admin/custom-trips')

        return {
            success: true,
            data: result
        }
    } catch (error) {
        console.error('Unexpected error:', error)
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

/**
 * Get all custom trip requests (Admin only)
 */
export async function getAllCustomTrips() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('custom_trips')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching custom trips:', error)
            return { success: false, error: error.message, data: [] }
        }

        return { success: true, data: data || [] }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to fetch custom trips', data: [] }
    }
}

/**
 * Get a single custom trip by ID (Admin only)
 */
export async function getCustomTripById(id: string) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('custom_trips')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            console.error('Error fetching custom trip:', error)
            return { success: false, error: error.message, data: null }
        }

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to fetch custom trip', data: null }
    }
}

/**
 * Update custom trip status and admin notes (Admin only)
 */
export async function updateCustomTrip(
    id: string,
    updates: {
        status?: 'pending' | 'reviewed' | 'contacted' | 'converted' | 'archived'
        admin_notes?: string
    }
) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('custom_trips')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating custom trip:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/custom-trips')
        revalidatePath(`/admin/custom-trips/${id}`)

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to update custom trip' }
    }
}
