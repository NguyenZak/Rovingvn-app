import { Utensils, Building2, Palmtree, Users, Map, Camera, Sun, Cloud, Music, Heart, Coffee, Compass, Anchor, Bike, Car, Plane, HelpCircle } from 'lucide-react'
import Image from 'next/image'
import { Highlight } from '@/lib/actions/highlight-actions'
import * as LucideIcons from 'lucide-react'

// Fallback data if DB is empty
const DEFAULT_HIGHLIGHTS = [
    {
        icon: 'Utensils',
        title: 'Culinary Delights',
        description: 'Taste the world-famous Pho, Banh Mi, and vibrant street food culture.',
        color: 'text-orange-500',
        bg: 'bg-orange-50'
    },
    {
        icon: 'Building2',
        title: 'Ancient History',
        description: 'Walk through thousands of years of history in hue, Hoi An, and Hanoi.',
        color: 'text-red-500',
        bg: 'bg-red-50'
    },
    {
        icon: 'Palmtree',
        title: 'Natural Wonders',
        description: 'Cruise Halong Bay, trek Sapa, or relax on Phu Quoc beaches.',
        color: 'text-green-500',
        bg: 'bg-green-50'
    },
    {
        icon: 'Users',
        title: 'Local Life',
        description: 'Meet friendly locals and experience authentic village lifestyle.',
        color: 'text-blue-500',
        bg: 'bg-blue-50'
    }
]

interface CulturalHighlightsProps {
    heroTitle?: string
    heroSubtitle?: string
    heroDescription?: string
    highlights?: Highlight[]
    images?: {
        image1?: string
        image2?: string
        image3?: string
        image4?: string
    }
}

export function CulturalHighlights({
    heroTitle = "Why Vietnam?",
    heroSubtitle = "A Land of Timeless Charm",
    heroDescription = "Vietnam is a country of breathtaking natural beauty and unique heritage. From the jagged peaks of the north to the emerald waters of the south, every corner tells a story.",
    highlights = [],
    images = {
        image1: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600",
        image2: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600",
        image3: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600",
        image4: "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=600"
    }
}: CulturalHighlightsProps) {

    const displayItems = highlights.length > 0 ? highlights : DEFAULT_HIGHLIGHTS

    const renderIcon = (iconName: string) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || HelpCircle;
        return <Icon size={24} />;
    }

    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

                    <div className="w-full md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-4 mt-8">
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <Image src={images.image1 || "https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600"} fill className="object-cover" alt="Vietnam Street" />
                                </div>
                                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                                    <Image src={images.image2 || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600"} fill className="object-cover" alt="Vietnam Landscape" />
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg">
                                    <Image src={images.image3 || "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600"} fill className="object-cover" alt="Hoi An Lanterns" />
                                </div>
                                <div className="relative w-full h-48 rounded-2xl overflow-hidden shadow-lg">
                                    <Image src={images.image4 || "https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=600"} fill className="object-cover" alt="Golden Bridge" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-1/2">
                        <h4 className="text-emerald-600 font-bold uppercase tracking-wider text-sm mb-2">{heroTitle}</h4>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">{heroSubtitle}</h2>
                        <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                            {heroDescription}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {displayItems.map((item, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className={`w-12 h-12 rounded-xl ${item.bg} ${item.color} flex items-center justify-center flex-shrink-0`}>
                                        {renderIcon(item.icon)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500">{item.description}</p>
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
