
import { createClient } from '@/lib/supabase/server'
import { BookingForm } from '@/components/features/bookings/BookingForm'
import { ClientImageGrid } from '@/components/ui/ClientImageGrid'
import { Clock, Check, X } from 'lucide-react'
import { notFound } from 'next/navigation'

// Force dynamic rendering to avoid build-time cookie access issues
export const dynamic = 'force-dynamic'

// Commented out for now to avoid build issues
// export async function generateStaticParams() {
//     const supabase = await createClient()
//     const { data: tours } = await supabase.from('tours').select('slug')
//     return tours?.map(({ slug }) => ({ slug })) || []
// }

export default async function TourPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    const { data: tour } = await supabase
        .from('tours')
        .select('*')
        .eq('slug', params.slug)
        .eq('status', 'published')
        .single()

    if (!tour) {
        notFound()
    }

    // Use featured_image and gallery_images from schema
    const images = [
        tour.featured_image || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000',
        ...(tour.gallery_images || [])
    ]

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
                            Vietnam Tour
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold mb-4">{tour.title}</h1>
                        <div className="flex flex-wrap gap-6 text-sm md:text-base opacity-90">
                            <span className="flex items-center gap-2">
                                <Clock size={18} />
                                {tour.duration_days > 0 && `${tour.duration_days} ${tour.duration_days === 1 ? 'day' : 'days'}`}
                                {tour.duration_nights > 0 && ` ${tour.duration_nights} ${tour.duration_nights === 1 ? 'night' : 'nights'}`}
                            </span>
                            <span className="flex items-center gap-2 font-semibold text-emerald-300 text-lg">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(tour.price_adult || 0)}
                                <span className="text-white font-normal text-sm">/ người lớn</span>
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
                        {tour.itinerary && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Itinerary</h2>
                                <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                    {/* Simplified rendering of itinerary */}
                                    {Array.isArray(tour.itinerary) ? (
                                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                        tour.itinerary.map((item: any, idx: number) => {
                                            const isNumberTitle = !isNaN(Number(item.day));
                                            const displayTitle = isNumberTitle ? `Day ${item.day}` : item.day;

                                            return (
                                                <div key={idx} className="relative flex items-start group">
                                                    <div className="absolute left-0 ml-5 -translate-x-1/2 flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-emerald-500 text-emerald-600 font-bold shadow-sm z-10 group-hover:scale-110 transition-transform duration-300">
                                                        {idx + 1}
                                                    </div>
                                                    <div className="ml-12">
                                                        <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                                                            {displayTitle || `Day ${idx + 1}`}
                                                            <span className="text-xs font-normal text-gray-400 px-2 py-0.5 rounded-full bg-gray-100 border border-gray-200">
                                                                Step {idx + 1}
                                                            </span>
                                                        </h3>
                                                        <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-emerald-100 hover:shadow-md transition-all duration-300">
                                                            <p className="text-gray-600 leading-relaxed whitespace-pre-line mb-4">
                                                                {item.description || "Detailed schedule available on request."}
                                                            </p>
                                                            {/* Day Images */}
                                                            {item.images && Array.isArray(item.images) && item.images.length > 0 && (
                                                                <ClientImageGrid
                                                                    images={item.images}
                                                                    title={`Day ${item.day}`}
                                                                    aspectRatio="video"
                                                                    gridClassName="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4"
                                                                    imageClassName="rounded-lg overflow-hidden bg-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <p className="text-gray-500 italic">Itinerary details available upon request.</p>
                                    )}
                                </div>
                            </section>
                        )}

                        {/* Included / Excluded */}
                        {(tour.includes?.length > 0 || tour.excludes?.length > 0) && (
                            <section className="grid md:grid-cols-2 gap-8">
                                {tour.includes?.length > 0 && (
                                    <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                            What&apos;s Included
                                        </h3>
                                        <ul className="space-y-3">
                                            {tour.includes.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-700">
                                                    <Check size={18} className="text-emerald-600 mt-0.5 shrink-0" />
                                                    <span className="text-sm md:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {tour.excludes?.length > 0 && (
                                    <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                                        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-gray-400"></span>
                                            Not Included
                                        </h3>
                                        <ul className="space-y-3">
                                            {tour.excludes.map((item: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 text-gray-600">
                                                    <X size={18} className="text-gray-400 mt-0.5 shrink-0" />
                                                    <span className="text-sm md:text-base">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </section>
                        )}

                        {/* Gallery (Grid) */}
                        {images.length > 1 && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 mb-6">Gallery</h2>
                                <ClientImageGrid
                                    images={images.slice(1)}
                                    title={tour.title}
                                    aspectRatio="4/3"
                                    gridClassName="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
                                    imageClassName="rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
                                />
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
