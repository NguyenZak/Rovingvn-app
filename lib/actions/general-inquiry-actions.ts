'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export interface GeneralInquirySubmission {
    name: string
    email: string
    phone: string
    number_of_people: number
    subject?: string
    message?: string
}

export interface GeneralInquiry extends GeneralInquirySubmission {
    id: string
    status: 'new' | 'contacted' | 'converted' | 'archived'
    admin_notes?: string
    created_at: string
    updated_at: string
}

/**
 * Submit a general inquiry from the homepage contact form
 */
export async function submitGeneralInquiry(data: GeneralInquirySubmission) {
    try {
        const supabase = await createClient()

        // Validate required fields
        if (!data.name || !data.email || !data.phone) {
            return {
                success: false,
                error: 'Please provide your name, email, and phone number.'
            }
        }

        // Build insert data
        const insertData: Record<string, unknown> = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            number_of_people: data.number_of_people || 1,
            status: 'new'
        }

        // Only add optional fields if they have values
        if (data.subject) {
            insertData.subject = data.subject
        }
        if (data.message) {
            insertData.message = data.message
        }

        console.log('🚀 Submitting general inquiry:', insertData)

        // Insert into database
        const { data: result, error } = await supabase
            .from('general_inquiries')
            .insert(insertData)
            .select()
            .single()

        if (error) {
            console.error('❌ Database error submitting general inquiry:', {
                error,
                errorMessage: error.message,
                errorCode: error.code,
                errorDetails: error.details,
                errorHint: error.hint,
                submittedData: insertData
            })
            return {
                success: false,
                error: `Failed to submit your inquiry: ${error.message || 'Please try again.'}`
            }
        }

        console.log('✅ General inquiry submitted successfully:', result)

        revalidatePath('/admin/general-inquiries')

        return {
            success: true,
            data: result
        }
    } catch (error) {
        console.error('❌ Unexpected error in submitGeneralInquiry:', {
            error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
            errorType: typeof error,
            submittedData: data
        })
        return {
            success: false,
            error: 'An unexpected error occurred. Please try again.'
        }
    }
}

/**
 * Get all general inquiries (Admin only)
 */
export async function getAllGeneralInquiries() {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('general_inquiries')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching general inquiries:', error)
            return { success: false, error: error.message, data: [] }
        }

        return { success: true, data: data || [] }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to fetch general inquiries', data: [] }
    }
}

/**
 * Update general inquiry status and admin notes (Admin only)
 */
export async function updateGeneralInquiry(
    id: string,
    updates: {
        status?: 'new' | 'contacted' | 'converted' | 'archived'
        admin_notes?: string
    }
) {
    try {
        const supabase = await createClient()

        const { data, error } = await supabase
            .from('general_inquiries')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Error updating general inquiry:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/general-inquiries')
        revalidatePath(`/admin/general-inquiries/${id}`)

        return { success: true, data }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to update general inquiry' }
    }
}
