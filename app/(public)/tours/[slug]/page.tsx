
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/features/bookings/BookingForm'
import { Clock, MapPin, Calendar, Check } from 'lucide-react'
import { notFound } from 'next/navigation'
import Image from 'next/image'

// Force dynamic rendering to avoid build-time cookie access issues
export const dynamic = 'force-dynamic'

// Commented out for now to avoid build issues
// export async function generateStaticParams() {
//     const supabase = await createClient()
//     const { data: tours } = await supabase.from('tours').select('slug')
//     return tours?.map(({ slug }) => ({ slug })) || []
// }

export default async function TourPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()

    const { data: tour } = await supabase
        .from('tours')
        .select('*, destinations(*)')
        .eq('slug', params.slug)
        .single()

    if (!tour) {
        notFound()
    }

    // Use array images or fallback
    const images = tour.images && tour.images.length > 0
        ? tour.images
        : ['https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000']

    return (
        <div className="bg-white min-h-screen">
            {/* Hero Header */}
            <div className="relative h-[60vh]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${images[0]})` }}
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 text-white bg-gradient-to-t from-black/80 to-transparent">
                    <div className="container mx-auto">
                        <span className="inline-block bg-emerald-600 px-3 py-1 rounded-full text-sm font-bold mb-4">
                            {tour.destinations?.name || 'Vietnam'}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{tour.title}</h1>
                        <div className="flex flex-wrap gap-6 text-sm md:text-base opacity-90">
                            <span className="flex items-center gap-2"><Clock size={18} /> {tour.duration}</span>
                            <span className="flex items-center gap-2 font-semibold text-emerald-300 text-lg">
                                ${tour.price} <span className="text-white font-normal text-sm">/ person</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">

                        {/* Description */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Overview</h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="whitespace-pre-line">{tour.description}</p>
                            </div>
                        </section>

                        {/* Itinerary (Handling JSONB) */}
                        {tour.schedule && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                                <div className="space-y-6 border-l-2 border-emerald-100 ml-3 pl-8 relative">
                                    {/* Simplified rendering of schedule - normally requires strict type checking for JSON */}
                                    {Array.isArray(tour.schedule) ? (
                                        tour.schedule.map((item: any, idx: number) => (
                                            <div key={idx} className="relative">
                                                <span className="absolute -left-[41px] top-0 flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 text-xs font-bold ring-4 ring-white">
                                                    {idx + 1}
                                                </span>
                                                <h3 className="font-bold text-gray-900 text-lg mb-2">{item.day || `Day ${idx + 1}`}</h3>
                                                <p className="text-gray-600">{item.description || "Detailed schedule available on request."}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 italic">Itinerary details available upon request.</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Gallery (Grid) */}
                        {images.length > 1 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {images.slice(1).map((img: string, i: number) => (
                                        <div key={i} className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                            <img src={img} alt={`Gallery ${i}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <BookingForm tourId={tour.id} />
                    </div>

                </div>
            </div>
        </div>
    )
}
