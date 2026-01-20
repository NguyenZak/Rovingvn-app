import { createClient } from '@/lib/supabase/server'
import { ToursClient } from './ToursClient'
import { getAllDestinations } from '@/lib/actions/destination-actions'
import { getRegions } from '@/lib/actions/region-actions'

export const revalidate = 0 // Dynamic data for development

export default async function ToursPage(props: {
    searchParams: Promise<{
        q?: string
        destination?: string
        region?: string
        duration?: string
        minPrice?: string
        maxPrice?: string
    }>
}) {
    const searchParams = await props.searchParams
    const searchQuery = searchParams.q
    const destinationSlug = searchParams.destination
    const regionSlug = searchParams.region
    const duration = searchParams.duration
    const minPrice = searchParams.minPrice ? parseFloat(searchParams.minPrice) : undefined
    const maxPrice = searchParams.maxPrice ? parseFloat(searchParams.maxPrice) : undefined

    const supabase = await createClient()

    // Build query
    let query = supabase
        .from('tours')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    // Search filter
    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
    }

    // Price range filter
    if (minPrice !== undefined) {
        query = query.gte('price_adult', minPrice)
    }
    if (maxPrice !== undefined) {
        query = query.lte('price_adult', maxPrice)
    }

    // Duration filter
    if (duration) {
        if (duration === '1') {
            query = query.eq('duration_days', 1)
        } else if (duration === '2-3') {
            query = query.gte('duration_days', 2).lte('duration_days', 3)
        } else if (duration === '4-7') {
            query = query.gte('duration_days', 4).lte('duration_days', 7)
        } else if (duration === '8+') {
            query = query.gte('duration_days', 8)
        }
    }

    const { data: tours, error } = await query

    console.log('Public Tours Page Debug:')
    console.log('Error:', error)
    console.log('Tours Count:', tours?.length)

    let filteredTours = tours || []

    // Filter by destination or region (requires join with tour_destinations)
    if (destinationSlug || regionSlug) {
        const tourIds = filteredTours.map(t => t.id)

        if (tourIds.length > 0) {
            let destQuery = supabase
                .from('tour_destinations')
                .select('tour_id, destinations(id, name, slug, region)')
                .in('tour_id', tourIds)

            const { data: tourDestinations } = await destQuery

            if (tourDestinations) {
                const validTourIds = new Set<string>()

                tourDestinations.forEach(td => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    const dest = td.destinations as any
                    if (!dest) return

                    let matches = true
                    if (destinationSlug && dest.slug !== destinationSlug) matches = false
                    if (regionSlug && dest.region !== regionSlug) matches = false

                    if (matches) {
                        validTourIds.add(td.tour_id)
                    }
                })

                filteredTours = filteredTours.filter(t => validTourIds.has(t.id))
            }
        }
    }

    // Fetch destinations and regions for filters
    const [destinationsResult, regionsResult] = await Promise.all([
        getAllDestinations({ status: 'published', limit: 100 }),
        getRegions()
    ])

    const destinations = destinationsResult.data || []
    const regions = regionsResult.data || []

    return (
        <ToursClient
            initialTours={filteredTours}
            destinations={destinations}
            regions={regions}
        />
    )
}
