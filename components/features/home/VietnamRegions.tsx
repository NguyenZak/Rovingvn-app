
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { getRegions } from '@/lib/actions/region-actions'

export async function VietnamRegions() {
    const { data: regions } = await getRegions()

    // Fallback if DB is empty or error, though usually we might want to handle error better
    // For now, if no regions, we might show nothing or empty state. 
    // Or we could keep the hardcoded as initial seed if DB is empty? 
    // Let's assume DB will be populated. If empty, section hides or shows empty.

    if (!regions || regions.length === 0) {
        return null // Or return standard fallback if desired
    }

    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Vietnam by Region</h2>
                    <p className="text-gray-600 text-lg">From the misty mountains of the North to the tropical delta of the South.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {regions.map((region, i) => (
                        <div key={region.id} className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-500">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${region.image_url})` }}
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${region.color || 'from-emerald-900'} via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />

                            {/* Content */}
                            <div className="absolute inset-x-0 bottom-0 p-8 text-white">
                                <h3 className="text-2xl font-bold mb-2">{region.name}</h3>
                                <p className="text-white/90 font-medium mb-4">{region.description}</p>

                                {/* Expanded Content on Hover */}
                                <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mb-4 transition-all duration-300">
                                    <p className="text-sm text-gray-200 leading-relaxed">
                                        {region.details}
                                    </p>
                                </div>

                                <Link
                                    href={region.link || `/tours?region=${region.name}`}
                                    className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white border-b border-transparent group-hover:border-white transition-all pb-1 hover:gap-3"
                                >
                                    Discover Tours <ArrowRight size={16} />
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
