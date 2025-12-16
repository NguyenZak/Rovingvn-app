
import { createClient } from '@/lib/supabase/server'
import { TourCard } from '@/components/features/tours/TourCard'
import { Search, SlidersHorizontal } from 'lucide-react'

export const revalidate = 0 // Dynamic data for development

export default async function ToursPage(props: {
    searchParams: Promise<{ destination?: string; q?: string; region?: string }>
}) {
    const searchParams = await props.searchParams
    const destinationSlug = searchParams.destination
    const searchQuery = searchParams.q
    const region = searchParams.region

    const supabase = await createClient()

    let query = supabase
        .from('tours')
        .select('*, destinations(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (destinationSlug) {
        query = query.eq('destinations.slug', destinationSlug)
    }

    if (region) {
        query = query.eq('destinations.region', region)
    }

    if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`)
    }

    const { data: tours, error } = await query

    console.log('Public Tours Page Debug:')
    console.log('Error:', error)
    console.log('Tours Count:', tours?.length)
    if (tours && tours.length > 0) {
        console.log('Sample Tour Status:', tours[0].status)
    }

    return (
        <div className="bg-gray-50 min-h-screen py-12 md:py-24">
            <div className="container mx-auto px-4">

                {/* Page Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Explore Our Tours</h1>
                    <p className="text-lg text-gray-600">
                        Browse our handpicked selection of tours designed to immerse you in the culture, history, and natural beauty of Vietnam.
                    </p>
                </div>

                {/* Filters Bar (Placeholder) */}
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-12 flex flex-col md:flex-row items-center gap-4 justify-between">
                    <div className="relative w-full md:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tours..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        />
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium text-sm">
                        <SlidersHorizontal size={18} />
                        Filters
                    </button>
                </div>

                {/* Tours Grid */}
                {tours && tours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No tours found</h3>
                        <p className="text-gray-500">Check back soon as we add new exciting itineraries!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
