
'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'

// Mock data for provinces just for visualization if DB doesn't have enough
// Ideally this comes from props, but for the component I'll use static or mixed
// Mock data removed in favor of dynamic props

interface RecommendedProvincesProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destinations: any[]
}

export function RecommendedProvinces({ destinations }: RecommendedProvincesProps) {
    // Determine which data to show: props or fallback (if empty)
    // Actually, let's just use what's passed. If empty, the parent handles it or we show nothing?
    // Let's keep the hook logic, assuming destinations is valid array.

    // Fallback if no destinations provided (avoid breaking UI pending DB population)
    const items = destinations && destinations.length > 0 ? destinations : []
    const scrollRef = useRef<HTMLDivElement>(null)
    const [canScrollLeft, setCanScrollLeft] = useState(false)
    const [canScrollRight, setCanScrollRight] = useState(true)

    const checkScroll = () => {
        if (scrollRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
            setCanScrollLeft(scrollLeft > 0)
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
        }
    }

    useEffect(() => {
        checkScroll()
        window.addEventListener('resize', checkScroll)
        return () => window.removeEventListener('resize', checkScroll)
    }, [])

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { clientWidth } = scrollRef.current
            const scrollAmount = direction === 'left' ? -clientWidth / 2 : clientWidth / 2
            scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
            setTimeout(checkScroll, 300)
        }
    }

    return (
        <section className="py-20 bg-emerald-50/50">
            <div className="container mx-auto px-4">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Destinations Not To Miss</h2>
                        <p className="text-gray-600">Explore travel gems across 63 provinces of Vietnam.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll('left')}
                            disabled={!canScrollLeft}
                            className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            disabled={!canScrollRight}
                            className="p-3 rounded-full bg-white border border-gray-200 text-gray-600 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-600"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                <div
                    ref={scrollRef}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-8 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((province, i) => (
                        <Link
                            key={province.id || i}
                            href={`/destinations/${province.slug || province.name.toLowerCase()}`}
                            className="flex-shrink-0 w-[280px] md:w-[320px] scroll-snap-align-start group block"
                        >
                            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-4">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                                    style={{ backgroundImage: `url(${province.image_url || 'https://images.unsplash.com/photo-1596627885741-285627efc687?q=80&w=800'})` }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-2xl font-bold mb-1">{province.name}</h3>
                                    <span className="inline-flex items-center gap-1 text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white/90">
                                        <MapPin size={12} />
                                        {/* Handle tour count safely */}
                                        {province.tours && province.tours[0] ? province.tours[0].count : (province.tour_count || 0)} Tours Available
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    )
}
