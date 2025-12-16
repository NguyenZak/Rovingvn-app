'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'

const SLIDES = [
    {
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop', // Halong Bay?
        title: 'Discover the Soul of Vietnam',
        subtitle: 'Authentic journeys, hidden gems, and unforgettable memories tailored just for you.'
    },
    {
        image: 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=2070', // Golden Bridge / Mountains
        title: 'Breathtaking Landscapes',
        subtitle: 'From the misty peaks of Sapa to the emerald waters of Ha Long Bay.'
    },
    {
        image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=2000', // Hoi An / Lanterns
        title: 'Rich Culture & Heritage',
        subtitle: 'Immerse yourself in the ancient traditions and vibrant history.'
    }
]

export function Hero() {
    const [currentSlide, setCurrentSlide] = useState(0)
    const [query, setQuery] = useState('')
    const router = useRouter()

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/tours?search=${encodeURIComponent(query)}`)
        }
    }

    const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
    const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)

    return (
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
            {/* Slider Backgrounds */}
            {SLIDES.map((slide, index) => (
                <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
                        }`}
                >
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat transform scale-105 transition-transform duration-[5000ms]"
                        style={{
                            backgroundImage: `url("${slide.image}")`,
                            transform: index === currentSlide ? 'scale(100%)' : 'scale(110%)'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            ))}

            {/* Manual Controls */}
            <button onClick={prevSlide} className="absolute left-4 z-20 text-white/50 hover:text-white transition-colors p-2 hidden md:block">
                <ChevronLeft size={48} />
            </button>
            <button onClick={nextSlide} className="absolute right-4 z-20 text-white/50 hover:text-white transition-colors p-2 hidden md:block">
                <ChevronRight size={48} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                {SLIDES.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentSlide(idx)}
                        className={`w-3 h-3 rounded-full transition-all ${idx === currentSlide ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                            }`}
                    />
                ))}
            </div>

            <div className="relative z-10 container mx-auto px-4 text-center text-white">
                <div className="transition-all duration-500 transform translate-y-0 opacity-100">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight drop-shadow-lg">
                        {SLIDES[currentSlide].title.includes('Vietnam') ? (
                            <>Discover the Soul of <span className="text-emerald-400">Vietnam</span></>
                        ) : (
                            SLIDES[currentSlide].title
                        )}
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto font-light drop-shadow-md min-h-[3rem]">
                        {SLIDES[currentSlide].subtitle}
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
