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
}

export function Hero({ sliders = [] }: HeroProps) {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [query, setQuery] = useState('')
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
        if (query.trim()) {
            router.push(`/tours?search=${encodeURIComponent(query)}`)
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
                <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                        {activeSlides[currentSlide].title.includes('Vietnam') ? (
                            <>Discover the Soul of <span className="text-emerald-400">Vietnam</span></>
                        ) : (
                            activeSlides[currentSlide].title
                        )}
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light drop-shadow-md min-h-[3rem]">
                        {activeSlides[currentSlide].subtitle}
                    </p>
                </div>

                <div className="max-w-3xl mx-auto bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-2xl">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-2">
                        <div className="flex-grow">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Where do you want to go?"
                                className="w-full h-14px px-6 py-4 rounded-xl bg-white text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 group"
                        >
                            <Search size={20} className="group-hover:scale-110 transition-transform" />
                            <span>Explore</span>
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}
