'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import ContactConfirmationEmail from '@/components/emails/ContactConfirmationEmail'
import { sendTelegramMessage } from '@/lib/telegram'

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
            const emailHtml = await render(ContactConfirmationEmail({ customerName: validatedData.name }))

            // 1. Send Confirmation to Customer
            await transporter.sendMail({
                from: `"Roving Vietnam Travel" <${process.env.GMAIL_USER}>`,
                to: validatedData.email,
                replyTo: adminEmail,
                subject: 'We received your message - Roving Vietnam Travel',
                html: emailHtml,
            })

            // 2. Send Notification to Admin
            await transporter.sendMail({
                from: `"We received your message - Roving Vietnam Travel" <${process.env.GMAIL_USER}>`,
                to: adminEmail,
                replyTo: validatedData.email,
                subject: `New Inquiry from ${validatedData.name}: ${validatedData.subject}`,
                html: `
                    <h1>New Contact Form Submission</h1>
                    <p><strong>Name:</strong> ${validatedData.name}</p>
                    <p><strong>Email:</strong> ${validatedData.email}</p>
                    <p><strong>Phone:</strong> ${validatedData.phone || 'N/A'}</p>
                    <p><strong>Subject:</strong> ${validatedData.subject}</p>
                    <p><strong>Message:</strong></p>
                    <blockquote style="background: #f9f9f9; padding: 10px; border-left: 4px solid #ccc;">
                        ${validatedData.message.replace(/\n/g, '<br>')}
                    </blockquote>
                `
            })

            console.log('✅ Emails sent successfully via Gmail SMTP')
        } catch (emailError) {
            console.error('⚠️ Failed to send emails:', emailError)
        }

        // Send Telegram Notification
        try {
            const telegramMessage = `
<b>📩 New Contact Inquiry</b>
<b>Name:</b> ${validatedData.name}
<b>Email:</b> ${validatedData.email}
<b>Phone:</b> ${validatedData.phone || 'N/A'}
<b>Subject:</b> ${validatedData.subject}

<b>Message:</b>
<blockquote>${validatedData.message}</blockquote>
`
            await sendTelegramMessage(telegramMessage)
        } catch (telegramError) {
            console.error('⚠️ Failed to send Telegram notification:', telegramError)
        }

        return {
            success: true,
            message: 'Thank you for contacting us! We will get back to you as soon as possible.',
        }
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errorMessage = error.issues.map(issue => issue.message).join(', ')
            return {
                success: false,
                message: errorMessage, // Return specific error (e.g., "Message must be at least 10 characters")
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
