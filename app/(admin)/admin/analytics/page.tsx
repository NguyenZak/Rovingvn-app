import { createClient } from '@/lib/supabase/server'
import AnalyticsClient from './AnalyticsClient'

export const revalidate = 0

export default async function AnalyticsPage() {
    const supabase = await createClient()

    // Get all bookings for analytics
    const { data: bookings } = await supabase
        .from('bookings')
        .select(`
            *,
            tours(id, title)
        `)
        .order('created_at', { ascending: true })

    // Get tours data
    const { data: tours } = await supabase
        .from('tours')
        .select('id, title')

    // Get customers data  
    const { data: customers } = await supabase
        .from('customers')
        .select('id, nationality, created_at')

    return (
        <AnalyticsClient
            bookings={bookings || []}
            tours={tours || []}
            customers={customers || []}
        />
    )
}
