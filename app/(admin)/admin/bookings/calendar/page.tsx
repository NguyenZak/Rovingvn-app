import { createClient } from '@/lib/supabase/server'
import BookingCalendarClient from './BookingCalendarClient'

export const revalidate = 0

export default async function BookingCalendarPage() {
    const supabase = await createClient()

    // Get all bookings for calendar view
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            tours(id, title, image_url),
            customers(id, fullname, email)
        `)
        .order('tour_date', { ascending: true })

    return <BookingCalendarClient bookings={bookings || []} />
}
