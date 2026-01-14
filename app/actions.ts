
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import nodemailer from 'nodemailer'
import { render } from '@react-email/components'
import BookingConfirmationEmail from '@/components/emails/BookingConfirmationEmail'
import { sendTelegramMessage } from '@/lib/telegram'

export async function submitBooking(formData: FormData) {
    const supabase = await createClient()

    const tourId = formData.get('tour_id') as string

    // Fetch Tour Details for Email
    const { data: tour } = await supabase
        .from('tours')
        .select('title')
        .eq('id', tourId)
        .single()

    const tourName = tour?.title || 'Vietnam Tour'

    const data = {
        tour_id: tourId,
        // Map to correct schema fields
        customer_info: {
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
        },
        travel_date: formData.get('date') as string,
        adults: Number(formData.get('people')), // Assuming input 'people' maps to adults
        special_requests: formData.get('message') as string,
        status: 'pending',
        // Default values for required fields
        total_price: 0,
        currency: 'VND'
    }

    const { error } = await supabase.from('bookings').insert(data)

    if (error) {
        console.error('Database Error:', error)
        return { error: 'Failed to submit booking' }
    }

    console.log('✅ Booking submitted successfully')

    // --- Send Emails ---
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        })

        const adminEmail = 'rovingvietnamtravel@gmail.com'

        // Render Email
        const emailHtml = await render(BookingConfirmationEmail({
            customerName: data.customer_info.name,
            tourName: tourName,
            date: data.travel_date,
            peopleCount: data.adults,
            phone: data.customer_info.phone
        }))

        // 1. Send Confirmation to Customer
        await transporter.sendMail({
            from: `"Roving Vietnam Travel" <${process.env.GMAIL_USER}>`,
            to: data.customer_info.email,
            replyTo: adminEmail,
            subject: `Booking Request Received: ${tourName}`,
            html: emailHtml,
        })

        // 2. Send Notification to Admin
        await transporter.sendMail({
            from: `"New Booking" <${process.env.GMAIL_USER}>`,
            to: adminEmail,
            replyTo: data.customer_info.email,
            subject: `New Booking: ${tourName} - ${data.customer_info.name}`,
            html: `
                <h1>New Tour Booking</h1>
                <p><strong>Tour:</strong> ${tourName}</p>
                <p><strong>Name:</strong> ${data.customer_info.name}</p>
                <p><strong>Email:</strong> ${data.customer_info.email}</p>
                <p><strong>Phone:</strong> ${data.customer_info.phone}</p>
                <p><strong>Date:</strong> ${data.travel_date}</p>
                <p><strong>People:</strong> ${data.adults}</p>
                <p><strong>Message:</strong></p>
                <blockquote style="background: #eee; padding: 10px;">${data.special_requests || 'No message'}</blockquote>
            `
        })

        console.log('✅ Booking emails sent')
    } catch (err) {
        console.error('⚠️ Email Error:', err)
    }

    // --- Send Telegram ---
    try {
        const telegramMsg = `
<b>🎫 New Booking Received</b>
<b>Tour:</b> ${tourName}
<b>Name:</b> ${data.customer_info.name}
<b>Email:</b> ${data.customer_info.email}
<b>Phone:</b> ${data.customer_info.phone}
<b>Date:</b> ${data.travel_date}
<b>People:</b> ${data.adults}
<b>Message:</b> ${data.special_requests || 'No message'}
`
        await sendTelegramMessage(telegramMsg)
        console.log('✅ Telegram sent')
    } catch (err) {
        console.error('⚠️ Telegram Error:', err)
    }

    revalidatePath('/tours')
    return { success: true }
}
