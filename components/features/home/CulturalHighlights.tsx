
import { Utensils, Building2, Palmtree, Users } from 'lucide-react'

const HIGHLIGHTS = [
    {
        icon: Utensils,
        title: 'Culinary Delights',
        desc: 'Taste the world-famous Pho, Banh Mi, and vibrant street food culture.',
        color: 'text-orange-500',
        bg: 'bg-orange-50'
    },
    {
        icon: Building2,
        title: 'Ancient History',
        desc: 'Walk through thousands of years of history in hue, Hoi An, and Hanoi.',
        color: 'text-red-500',
        bg: 'bg-red-50'
    },
    {
        icon: Palmtree,
        title: 'Natural Wonders',
        desc: 'Cruise Halong Bay, trek Sapa, or relax on Phu Quoc beaches.',
        color: 'text-green-500',
        bg: 'bg-green-50'
    },
    {
        icon: Users,
        title: 'Local Life',
        desc: 'Meet friendly locals and experience authentic village lifestyle.',
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    }
]

export function CulturalHighlights() {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

                    <div className="w-full md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-8">
                                <img src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600" className="rounded-2xl shadow-lg w-full h-48 object-cover" alt="Vietnam Street" />
                                <img src="https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600" className="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Vietnam Landscape" />
                            </div>
                            <div className="space-y-4">
                                <img src="https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600" className="rounded-2xl shadow-lg w-full h-64 object-cover" alt="Hoi An Lanterns" />
                                <img src="https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=600" className="rounded-2xl shadow-lg w-full h-48 object-cover" alt="Golden Bridge" />
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h4 className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">Why Vietnam?</h4>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">A Land of Timeless Charm</h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            Vietnam is a country of breathtaking natural beauty and unique heritage. From the jagged peaks of the north to the emerald waters of the south, every corner tells a story.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {HIGHLIGHTS.map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0`}>
                                        <item.icon size={24} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
