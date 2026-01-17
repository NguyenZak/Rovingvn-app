'use client'

import Link from 'next/link'
import { MapPin, ChevronRight, Home } from 'lucide-react'
import type { Region } from '@/lib/actions/region-actions'

interface Destination {
    id: string
    name: string
    slug: string
    short_description?: string
    image_url?: string
    region?: string
}

interface RegionProvincesClientProps {
    region: Region
    destinations: Destination[]
}

export function RegionProvincesClient({ region, destinations }: RegionProvincesClientProps) {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Region Image */}
            <div className="relative h-[400px] md:h-[500px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${region.image_url || ''})` }}
                />
                <div className={`absolute inset-0 bg-gradient-to-t ${region.color || 'from-emerald-900'} via-transparent to-transparent opacity-80`} />

                {/* Content */}
                <div className="relative h-full container mx-auto px-4 flex flex-col justify-end pb-16">
                    {/* Breadcrumb */}
                    <nav className="mb-6 flex items-center gap-2 text-white/90 text-sm">
                        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
                            <Home size={16} />
                            Home
                        </Link>
                        <ChevronRight size={16} />
                        <span className="text-white font-medium">{region.name}</span>
                    </nav>

                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        {region.name}
                    </h1>
                    <p className="text-xl text-white/90 max-w-3xl">
                        {region.description}
                    </p>
                    {region.details && (
                        <p className="text-white/80 max-w-3xl mt-3">
                            {region.details}
                        </p>
                    )}
                </div>
            </div>

            {/* Provinces Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Explore Provinces in {region.name}
                    </h2>
                    <p className="text-gray-600">
                        {destinations.length} {destinations.length === 1 ? 'destination' : 'destinations'} to discover
                    </p>
                </div>

                {destinations.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-gray-500 text-lg">No destinations found in this region yet.</p>
                        <Link
                            href="/"
                            className="inline-block mt-6 px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                        >
                            Back to Home
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {destinations.map((destination) => (
                            <Link
                                key={destination.id}
                                href={`/destinations/${destination.slug}`}
                                className="group block"
                            >
                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                        style={{
                                            backgroundImage: `url(${destination.image_url || 'https://images.unsplash.com/photo-1596627885741-285627efc687?q=80&w=800'})`
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                                    <div className="absolute bottom-4 left-4 right-4">
                                        <h3 className="text-2xl font-bold text-white mb-1">
                                            {destination.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-white/90 text-sm">
                                            <MapPin size={14} />
                                            <span>{region.name}</span>
                                        </div>
                                    </div>
                                </div>

                                {destination.short_description && (
                                    <p className="text-gray-600 line-clamp-2 group-hover:text-gray-900 transition-colors">
                                        {destination.short_description}
                                    </p>
                                )}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
