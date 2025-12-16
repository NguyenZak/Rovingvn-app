
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const REGIONS = [
    {
        name: 'Northern Vietnam',
        description: 'Hanoi, Sapa, Ha Long Bay',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200',
        color: 'from-emerald-900',
        details: 'Majestic mountains, rice terraces, and the capital\'s ancient charm.'
    },
    {
        name: 'Central Vietnam',
        description: 'Hue, Da Nang, Hoi An',
        image: 'https://images.unsplash.com/photo-1565063670637-238478d15443?q=80&w=1200', // Hoi An
        color: 'from-amber-900',
        details: 'Heritage sites, stunning caves, and beautiful beaches.'
    },
    {
        name: 'Southern Vietnam',
        description: 'Ho Chi Minh City, Mekong Delta',
        image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200', // Mekong/HCMC
        color: 'from-blue-900',
        details: 'Vibrant city life, floating markets, and tropical islands.'
    }
]

export function VietnamRegions() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Explore Vietnam by Region</h2>
                    <p className="text-gray-600 text-lg">From the misty mountains of the North to the tropical delta of the South.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {REGIONS.map((region, i) => (
                        <div key={i} className="group relative h-[400px] rounded-3xl overflow-hidden cursor-pointer">
                            {/* Background Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                style={{ backgroundImage: `url(${region.image})` }}
                            />

                            {/* Gradient Overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${region.color} via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity`} />

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

                                <Link href={`/tours?region=${region.name.includes('North') ? 'North' : region.name.includes('Central') ? 'Central' : 'South'}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-white border-b border-transparent group-hover:border-white transition-all pb-1 hover:gap-3">
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
