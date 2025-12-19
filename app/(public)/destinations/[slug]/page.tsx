
import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Calendar, CloudRain, MapPin, Camera, Info, ArrowRight, Clock, Users, DollarSign } from 'lucide-react'
import { getDestinationBySlug } from '@/lib/actions/destination-actions'
import { getToursByDestinationId } from '@/lib/actions/tour-actions'
import DestinationGallery from '../_components/DestinationGallery'

interface Props {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    const { data: destination } = await getDestinationBySlug(slug)

    if (!destination) {
        return {
            title: 'Destination Not Found',
        }
    }

    return {
        title: `${destination.name} - Roving Vietnam`,
        description: destination.description || `Explore ${destination.name} with Roving Vietnam`,
    }
}

export default async function DestinationDetailPage({ params }: Props) {
    const { slug } = await params
    const { data: destination } = await getDestinationBySlug(slug)

    if (!destination) {
        notFound()
    }

    const { data: relatedTours } = await getToursByDestinationId(destination.id)

    // Parse attractions if string or use array
    const attractions = typeof destination.attractions === 'string'
        ? destination.attractions?.split('\n').filter(Boolean)
        : []

    // Parse gallery images
    let galleryImages: string[] = []
    if (typeof destination.gallery_images === 'string') {
        try {
            galleryImages = JSON.parse(destination.gallery_images)
        } catch {
            galleryImages = []
        }
    } else if (Array.isArray(destination.gallery_images)) {
        galleryImages = destination.gallery_images
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <div className="relative h-[70vh] w-full">
                <Image
                    src={destination.image_url || '/images/placeholder-destination.jpg'}
                    alt={destination.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                <div className="absolute inset-0 flex items-center justify-center text-center">
                    <div className="max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-sm border border-emerald-400/30 text-emerald-50 font-medium mb-4">
                            {destination.region} Vietnam
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                            {destination.name}
                        </h1>
                        <p className="text-xl text-gray-200 max-w-2xl mx-auto line-clamp-2">
                            {destination.short_description || `Discover the beauty of ${destination.name}`}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Info Bar */}
            <div className="bg-emerald-50 border-y border-emerald-100/50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-emerald-200">
                        <div className="py-6 px-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                <Calendar size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Best Time to Visit</h3>
                                <p className="text-emerald-800 font-medium">{destination.best_time_to_visit || 'Year Round'}</p>
                            </div>
                        </div>
                        <div className="py-6 px-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <CloudRain size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Climate</h3>
                                <p className="text-blue-800 font-medium">{destination.climate_info || 'Tropical'}</p>
                            </div>
                        </div>
                        <div className="py-6 px-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                <MapPin size={24} />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Location</h3>
                                <p className="text-purple-800 font-medium">{destination.region}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <section>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                                <Info className="text-emerald-600" />
                                About {destination.name}
                            </h2>
                            <div className="prose prose-lg text-gray-600 max-w-none">
                                <p className="whitespace-pre-line">{destination.description}</p>
                            </div>
                        </section>

                        {/* Gallery */}
                        <DestinationGallery
                            images={galleryImages}
                            destinationName={destination.name}
                        />

                        {/* Related Tours */}
                        <section>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-gray-900">Available Tours</h2>
                                <Link
                                    href={`/tours?search=${destination.name}`}
                                    className="text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-2"
                                >
                                    View All <ArrowRight size={16} />
                                </Link>
                            </div>

                            {relatedTours && relatedTours.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {relatedTours.map(tour => (
                                        <Link key={tour.id} href={`/tours/${tour.slug}`} className="group bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                            <div className="relative h-56">
                                                <Image
                                                    src={tour.featured_image || '/images/placeholder-tour.jpg'}
                                                    alt={tour.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-emerald-700 shadow-sm">
                                                    {tour.duration_days} Days
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                                    {tour.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                                                    <div className="flex items-center gap-1">
                                                        <Clock size={16} />
                                                        <span>{tour.duration_days} days</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Users size={16} />
                                                        <span>Max {tour.max_participants}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                    <div className="flex flex-col">
                                                        <span className="text-xs text-gray-500 uppercase font-semibold">From</span>
                                                        <span className="text-lg font-bold text-emerald-600">
                                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(tour.price_adult || 0)}
                                                        </span>
                                                    </div>
                                                    <span className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                                        <ArrowRight size={20} />
                                                    </span>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-gray-50 rounded-2xl p-8 text-center border-2 border-dashed border-gray-200">
                                    <p className="text-gray-500 font-medium mb-4">No scheduled tours for this destination yet.</p>
                                    <Link href="/design-your-trip" className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">
                                        Create Custom Trip
                                    </Link>
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            {/* Highlights Card */}
                            {attractions && attractions.length > 0 && (
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <MapPin className="text-emerald-500" size={20} />
                                        Highlights
                                    </h3>
                                    <ul className="space-y-3">
                                        {attractions.map((attr, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-gray-600">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
                                                <span>{attr}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* CTA Card */}
                            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <div className="relative z-10">
                                    <h3 className="text-xl font-bold mb-2">Want to visit {destination.name}?</h3>
                                    <p className="text-emerald-100 mb-6 text-sm">
                                        Let us customize a trip just for you based on this destination.
                                    </p>
                                    <Link
                                        href="/design-your-trip"
                                        className="block w-full text-center bg-white text-emerald-700 font-bold py-3 rounded-xl hover:bg-emerald-50 transition-colors"
                                    >
                                        Plan Your Trip Now
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
