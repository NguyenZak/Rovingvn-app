'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function DestinationsPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [destinations, setDestinations] = useState<any[]>([])

    useEffect(() => {
        async function fetchDestinations() {
            const supabase = createClient()
            const { data } = await supabase
                .from('destinations')
                .select('*')
                .eq('status', 'published')
                .order('name')
            setDestinations(data || [])
        }
        fetchDestinations()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in duration-700">
                            Our Destinations
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed">
                            From the misty mountains of Sapa to the emerald waters of Halong Bay, explore the diverse landscapes of Vietnam
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {destinations?.map((dest) => (
                        <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${dest.image_url || 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070'})` }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                    <MapPin size={24} className="text-emerald-400" />
                                    {dest.name}
                                </h3>
                                <p className="text-gray-300 text-sm line-clamp-2 max-w-xs">{dest.description}</p>
                            </div>
                        </Link>
                    ))}
                    {(!destinations || destinations.length === 0) && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            Destinations being updated...
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
