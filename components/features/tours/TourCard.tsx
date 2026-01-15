
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import type { Tour } from '@/lib/actions/tour-actions'

interface TourCardProps {
    tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
    const formatPrice = (price?: number) => {
        if (!price) return 'Liên hệ'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price)
    }

    // Fallback image
    const coverImage = tour.featured_image || tour.gallery_images?.[0] || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000&auto=format&fit=crop'

    // Handle destinations
    const destinationNames = tour.destinations?.map(d => d.name).join(', ') || 'Vietnam';

    // Format duration
    const duration = tour.duration_days
        ? `${tour.duration_days}D${tour.duration_nights ? `${tour.duration_nights}N` : ''}`
        : '';

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <Link href={`/tours/${tour.slug}`} className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm max-w-[70%] truncate">
                    {destinationNames}
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-3">
                    <MapPin size={16} />
                    <span className="truncate">{destinationNames || 'Vietnam'}</span>
                </div>

                <Link href={`/tours/${tour.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {tour.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {tour.short_description || tour.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col">
                        {tour.price_adult ? <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">From</span> : null}
                        <span className="text-xl font-bold text-emerald-600">{formatPrice(tour.price_adult)}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {duration && (
                            <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {duration}
                            </span>
                        )}
                        <Link
                            href={`/tours/${tour.slug}`}
                            className="text-sm font-semibold text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            View Details
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
