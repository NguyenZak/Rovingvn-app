
import Link from 'next/link'
import { Clock, MapPin } from 'lucide-react'
import type { Database } from '@/types/database.types'

type Tour = Database['public']['Tables']['tours']['Row'] & {
    destinations?: Database['public']['Tables']['destinations']['Row'] | null
}

interface TourCardProps {
    tour: Tour
}

export function TourCard({ tour }: TourCardProps) {
    const formatPrice = (price: number | null) => {
        if (!price) return 'Liên hệ'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(price)
    }

    // Fallback image
    const coverImage = tour.cover_image || tour.images?.[0] || 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000&auto=format&fit=crop'

    return (
        <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
            <Link href={`/tours/${tour.slug}`} className="relative h-64 overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors" />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                    {tour.duration}
                </div>
            </Link>

            <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-emerald-600 text-sm font-medium mb-3">
                    <MapPin size={16} />
                    <span>{tour.destinations?.name || 'Vietnam'}</span>
                </div>

                <Link href={`/tours/${tour.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {tour.title}
                    </h3>
                </Link>

                <p className="text-gray-500 text-sm line-clamp-3 mb-6 flex-grow">
                    {tour.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-auto">
                    <div className="flex flex-col">
                        {tour.price && <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">From</span>}
                        <span className="text-xl font-bold text-emerald-600">{formatPrice(tour.price)}</span>
                    </div>

                    <Link
                        href={`/tours/${tour.slug}`}
                        className="text-sm font-semibold text-gray-900 border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    )
}
