
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { MapPin } from 'lucide-react'

export const revalidate = 0 // Dynamic data for development

export default async function DestinationsPage() {
    const supabase = await createClient()
    const { data: destinations } = await supabase
        .from('destinations')
        .select('*')
        .eq('status', 'published')
        .order('name')

    return (
        <div className="bg-white min-h-screen py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Destinations</h1>
                    <p className="text-lg text-gray-600">
                        From the misty mountains of Sapa to the emerald waters of Halong Bay, explore the diverse landscapes of Vietnam.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {destinations?.map((dest) => (
                        <Link key={dest.id} href={`/tours?destination=${dest.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[4/3] block">
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
