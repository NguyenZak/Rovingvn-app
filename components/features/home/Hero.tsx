'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { Slider } from '@/lib/types/cms'

// Extended type to include the joined image object
interface SliderWithImage extends Slider {
    image?: {
        id: string;
        url: string;
        filename: string;
    } | null;
}

interface HeroProps {
    sliders?: SliderWithImage[];
    destinations?: { id: string; name: string; slug: string }[];
}

export function Hero({ sliders = [], destinations = [] }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [query, setQuery] = useState('')
    const [selectedDestination, setSelectedDestination] = useState('')
    const [selectedDuration, setSelectedDuration] = useState('')
    const router = useRouter()

    // Default fallback slides if no dynamic sliders are provided
    const defaultSlides = [
        {
            id: 'default',
            image: { url: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop' },
            title: 'Discover the Soul of Vietnam',
            subtitle: 'Authentic journeys, hidden gems, and unforgettable memories tailored just for you.',
            link: '/tours',
            button_text: 'Explore Now'
        }
    ]

    const activeSlides = sliders.length > 0 ? sliders : defaultSlides

    useEffect(() => {
        if (activeSlides.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [activeSlides.length])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        const params = new URLSearchParams()

        if (query.trim()) params.set('q', query)
        if (selectedDestination) params.set('destination', selectedDestination)
        if (selectedDuration) params.set('duration', selectedDuration)

        const queryString = params.toString()
        if (queryString) {
            router.push(`/tours?${queryString}`)
        } else {
            router.push('/tours')
        }
    }

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % activeSlides.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + activeSlides.length) % activeSlides.length)

    // Helper to get image URL safely
    const getImageUrl = (slide: SliderWithImage | (typeof defaultSlides)[0]) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const url = (slide as any).image?.url || (slide as any).image_url;
        return url || 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070';
    }

    return (
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Slider Backgrounds */}
            {activeSlides.map((slide, index) => (
                <div
                    key={slide.id || index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                        }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[5000ms]"
                        style={{
                            backgroundImage: `url("${getImageUrl(slide)}")`,
                            transform: index === currentSlide ? 'scale(100%)' : 'scale(110%)'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}

            {/* Manual Controls - Only show if > 1 slide */}
            {activeSlides.length > 1 && (
                <>
                    <button onClick={prevSlide} className="absolute left-4 z-20 text-white/50 hover:text-white transition-colors p-2 hidden md:block">
                        <ChevronLeft size={48} />
                    </button>
                    <button onClick={nextSlide} className="absolute right-4 z-20 text-white/50 hover:text-white transition-colors p-2 hidden md:block">
                        <ChevronRight size={48} />
                    </button>
                </>
            )}

            {/* Dots */}
            {activeSlides.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {activeSlides.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                }`}
                        />
                    ))}
                </div>
            )}

            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <div className="transition-all duration-500 transform translate-y-0 opacity-100 mb-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                        {activeSlides[currentSlide].title.includes('Vietnam') ? (
                            <>Discover the Soul of <span className="text-emerald-400">Vietnam</span></>
                        ) : (
                            activeSlides[currentSlide].title
                        )}
                    </h1>
                    <p className="text-xl md:text-2xl max-w-2xl mx-auto font-light drop-shadow-md min-h-[3rem]">
                        {activeSlides[currentSlide].subtitle}
                    </p>
                </div>

                {/* Advanced Search Bar */}
                <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-2xl">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        {/* Keyword Input */}
                        <div className="flex-[2]">
                            <div className="relative h-14">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search tours..."
                                    className="w-full h-full pl-11 pr-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                />
                            </div>
                        </div>

                        {/* Destination Dropdown */}
                        <div className="flex-1">
                            <select
                                value={selectedDestination}
                                onChange={(e) => setSelectedDestination(e.target.value)}
                                className="w-full h-14 px-4 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                                style={{ backgroundImage: 'none' }}
                            >
                                <option value="" className="text-gray-500">Destination</option>
                                {destinations.map(dest => (
                                    <option key={dest.id} value={dest.slug}>{dest.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Duration Dropdown */}
                        <div className="flex-1">
                            <select
                                value={selectedDuration}
                                onChange={(e) => setSelectedDuration(e.target.value)}
                                className="w-full h-14 px-4 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                                style={{ backgroundImage: 'none' }}
                            >
                                <option value="" className="text-gray-500">Duration</option>
                                <option value="1">1 Day</option>
                                <option value="2-3">2-3 Days</option>
                                <option value="4-7">4-7 Days</option>
                                <option value="8+">8+ Days</option>
                            </select>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group md:w-auto w-full"
                        >
                            <span>Find Tours</span>
                            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
