
import { createClient } from '@/lib/supabase/server'
import ToursClient from './ToursClient'

export default async function AdminToursPage() {
    const supabase = await createClient()
    // Simplified fetch to debug
    const { data: tours, error } = await supabase.from('tours').select('*').order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching tours:', error)
    }
    console.log('Fetched tours count (simple):', tours?.length)

    // Manual mock of destinations for UI to prevent crash if it expects array
    const toursWithDests = tours?.map(t => ({ ...t, destinations: [] })) || []

    return <ToursClient tours={toursWithDests} />
}
