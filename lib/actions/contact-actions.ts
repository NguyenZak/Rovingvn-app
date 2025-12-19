'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'

const contactSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Invalid phone number').optional(),
    subject: z.string().min(5, 'Subject must be at least 5 characters'),
    message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type ContactFormData = z.infer<typeof contactSchema>

export async function submitContactForm(data: ContactFormData) {
    try {
        // Validate the form data
        const validatedData = contactSchema.parse(data)

        const supabase = await createClient()

        // Build insert data for general_inquiries table
        const insertData: Record<string, unknown> = {
            name: validatedData.name,
            email: validatedData.email,
            phone: validatedData.phone || '',
            number_of_people: 1, // Default for contact form
            subject: validatedData.subject,
            message: validatedData.message,
            status: 'new'
        }

        console.log('🚀 Submitting contact form:', insertData)

        // Insert into database
        const { data: result, error } = await supabase
            .from('general_inquiries')
            .insert(insertData)
            .select()
            .single()

        if (error) {
            console.error('❌ Database error submitting contact form:', {
                error,
                errorMessage: error.message,
                errorCode: error.code,
                errorDetails: error.details,
                errorHint: error.hint,
                submittedData: insertData
            })
            return {
                success: false,
                message: `Failed to submit: ${error.message || 'Please try again.'}`,
            }
        }

        console.log('✅ Contact form submitted successfully:', result)

        return {
            success: true,
            message: 'Thank you for contacting us! We will get back to you as soon as possible.',
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                message: 'Please check your information',
                errors: (error as z.ZodError).issues,
            }
        }

        console.error('❌ Unexpected error in submitContactForm:', {
            error,
            errorMessage: error instanceof Error ? error.message : String(error),
            errorStack: error instanceof Error ? error.stack : undefined,
        })

        return {
            success: false,
            message: 'An error occurred. Please try again later.',
        }
    }
}
