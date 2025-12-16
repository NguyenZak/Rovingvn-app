import { createClient } from '@/lib/supabase/server'
import DestinationsClient from './DestinationsClient'

export const revalidate = 0

export default async function AdminDestinationsPage() {
    const supabase = await createClient()

    // Get destinations with tours count
    const { data: destinations, error } = await supabase
        .from('destinations')
        .select('*')
        .order('name')

    if (error) {
        console.error('Error fetching destinations:', error)
    }
    console.log('Fetched destinations count:', destinations?.length)

    // Transform the data to include tours_count
    const destinationsWithCount = destinations?.map(dest => ({
        ...dest,
        tours_count: 0 // Debugging: disabled count fetching
    })) || []

    return <DestinationsClient destinations={destinationsWithCount} />
}
