'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import CustomTripConfirmationEmail from '@/components/emails/CustomTripConfirmationEmail'
import { sendTelegramMessage } from '@/lib/telegram'

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

        // Build insert data, only include optional fields if they have values
        const insertData: Record<string, unknown> = {
            customer_name: data.customer_name,
            customer_email: data.customer_email,
            customer_phone: data.customer_phone,
            destinations: data.destinations,
            duration_days: data.duration_days,
            travel_styles: data.travel_styles || [],
            number_of_travelers: data.number_of_travelers || 1,
            status: 'pending'
        }

        // Only add optional fields if they have values
        if (data.travel_date) {
            insertData.travel_date = data.travel_date
        }
        if (data.additional_notes) {
            insertData.additional_notes = data.additional_notes
        }

        // Insert into database
        const { data: result, error } = await supabase
            .from('custom_trips')
            .insert(insertData)
            .select()
            .single()

        if (error) {
            console.error('❌ Database error submitting custom trip:', {
                // ... (keep logging logic)
            })
            return {
                success: false,
                error: `Failed to submit your request: ${error.message || 'Please try again.'}`
            }
        }

        console.log('✅ Custom trip submitted successfully:', result)

        // Send emails
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD,
                },
            })

            const adminEmail = 'rovingvietnamtravel@gmail.com'
            // Using render to convert React component to HTML string
            const emailHtml = await render(CustomTripConfirmationEmail({
                customerName: data.customer_name,
                destinations: data.destinations,
                durationDays: data.duration_days,
                travelDate: data.travel_date,
                travelStyles: data.travel_styles,
                numberOfTravelers: data.number_of_travelers,
                additionalNotes: data.additional_notes
            }))

            // 1. Send Confirmation to Customer
            await transporter.sendMail({
                from: `"Roving Vietnam Travel" <${process.env.GMAIL_USER}>`,
                to: data.customer_email,
                replyTo: adminEmail,
                subject: 'Trip Request Received - Roving Vietnam Travel',
                html: emailHtml,
            })

            // 2. Send Notification to Admin
            await transporter.sendMail({
                from: `"New Trip Request" <${process.env.GMAIL_USER}>`,
                to: adminEmail,
                replyTo: data.customer_email,
                subject: `New Trip Request from ${data.customer_name} (${data.duration_days} Days)`,
                html: `
                    <h1>New Custom Trip Request</h1>
                    <p><strong>Name:</strong> ${data.customer_name}</p>
                    <p><strong>Email:</strong> ${data.customer_email}</p>
                    <p><strong>Phone:</strong> ${data.customer_phone}</p>
                    <hr>
                    <p><strong>Destinations:</strong> ${data.destinations.map(d => d.name).join(', ')}</p>
                    <p><strong>Duration:</strong> ${data.duration_days} Days</p>
                    <p><strong>Travel Date:</strong> ${data.travel_date || 'Not specified'}</p>
                    <p><strong>Travelers:</strong> ${data.number_of_travelers}</p>
                    <p><strong>Styles:</strong> ${data.travel_styles.map(s => s.name).join(', ') || 'N/A'}</p>
                    <p><strong>Notes:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
                        ${(data.additional_notes || '').replace(/\n/g, '<br>')}
                    </blockquote>
                `
            })

            console.log('✅ Trip emails sent successfully via Gmail SMTP')
        } catch (emailError) {
            console.error('⚠️ Failed to send trip emails:', emailError)
        }

        // Send Telegram Notification
        try {
            const telegramMessage = `
<b>✈️ New Custom Trip Request</b>
<b>Name:</b> ${data.customer_name}
<b>Email:</b> ${data.customer_email}
<b>Phone:</b> ${data.customer_phone}
<b>Duration:</b> ${data.duration_days} days
<b>Travelers:</b> ${data.number_of_travelers}
<b>Travel Date:</b> ${data.travel_date || 'Not specified'}

<b>Destinations:</b> ${data.destinations.map(d => d.name).join(', ')}
<b>Styles:</b> ${data.travel_styles.map(s => s.name).join(', ') || 'N/A'}

<b>Notes:</b>
<blockquote>${data.additional_notes || 'No notes'}</blockquote>
`
            await sendTelegramMessage(telegramMessage)
        } catch (telegramError) {
            console.error('⚠️ Failed to send Telegram notification:', telegramError)
        }

        revalidatePath('/admin/custom-trips')

        return {
            success: true,
            data: result
        }
    } catch (error) {
        console.error('❌ Unexpected error in submitCustomTrip:', {
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

/**
 * Delete a custom trip request (Admin only)
 */
export async function deleteCustomTrip(id: string) {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('custom_trips')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting custom trip:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/custom-trips')
        return { success: true }
    } catch (error) {
        console.error('Unexpected error:', error)
        return { success: false, error: 'Failed to delete custom trip' }
    }
}
