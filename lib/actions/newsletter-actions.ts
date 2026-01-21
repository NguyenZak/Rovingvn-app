'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import nodemailer from 'nodemailer'

// --- Types & Schemas ---

const subscribeSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
})

const emailSchema = z.object({
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required"),
    recipients: z.array(z.string().email())
})

export type SubscribeResult = {
    success: boolean
    message: string
}

// --- Public Actions ---

export async function subscribeToNewsletter(formData: FormData): Promise<SubscribeResult> {
    const email = formData.get('email')

    try {
        const validated = subscribeSchema.parse({ email })

        const supabase = await createClient()

        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert({ email: validated.email })

        if (error) {
            // Postgres unique violation code 23505
            if (error.code === '23505') {
                return {
                    success: true, // Treat as success to user
                    message: "You're already subscribed to our newsletter!"
                }
            }
            throw error
        }

        return {
            success: true,
            message: 'Thank you for subscribing! Stay tuned for travel inspiration.'
        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            const zodError = error as any;
            return {
                success: false,
                message: zodError.errors?.[0]?.message || 'Invalid input'
            }
        }

        console.error('Newsletter subscription error:', error)
        return {
            success: false,
            message: 'Something went wrong. Please try again later.'
        }
    }
}

// --- Admin Actions ---

export async function getSubscribers() {
    const supabase = await createClient()

    // Check permission - implementing basic role check for now
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // For better security, we should check user_roles here, but RLS will also enforce it.

    const { data, error } = await supabase
        .from('newsletter_subscribers')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching subscribers:', error)
        return []
    }

    return data || []
}

export async function deleteSubscriber(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('newsletter_subscribers')
        .delete()
        .eq('id', id)

    if (error) {
        return { success: false, message: 'Failed to delete subscriber' }
    }

    return { success: true, message: 'Subscriber removed' }
}

export async function sendNewsletter(data: { subject: string, content: string, recipients: string[] }) {
    try {
        const validated = emailSchema.parse(data)

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        })

        let successCount = 0;
        let failCount = 0;

        // Helper to extract name from email (e.g. john.doe@gmail.com -> John Doe)
        const extractName = (email: string) => {
            const localPart = email.split('@')[0];
            return localPart
                .split(/[._-]/)
                .map(part => part.charAt(0).toUpperCase() + part.slice(1))
                .join(' ');
        }

        // Send emails individually to support personalization
        await Promise.all(validated.recipients.map(async (recipient) => {
            try {
                const name = extractName(recipient);

                // Replace {{name}} with case-insensitive regex
                const personalizedSubject = validated.subject.replace(/\{\{\s*name\s*\}\}/gi, name);
                const personalizedContent = validated.content.replace(/\{\{\s*name\s*\}\}/gi, name);

                await transporter.sendMail({
                    from: `"Roving Vietnam Travel" <${process.env.GMAIL_USER}>`,
                    to: recipient, // Individual To
                    subject: personalizedSubject,
                    html: personalizedContent,
                });
                successCount++;
            } catch (err) {
                console.error(`Failed to send to ${recipient}:`, err);
                failCount++;
            }
        }));

        if (successCount === 0 && failCount > 0) {
            return { success: false, message: 'Failed to send emails. Check server logs.' }
        }

        return {
            success: true,
            message: `Sent to ${successCount} subscribers.${failCount > 0 ? ` Failed: ${failCount}` : ''}`
        }

    } catch (error) {
        console.error('Failed to send newsletter:', error)
        return { success: false, message: 'Failed to send email. Check server logs.' }
    }
}
