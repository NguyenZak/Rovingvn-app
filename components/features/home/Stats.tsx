'use client'

import React, { useEffect, useState, useRef } from 'react'
import { Trophy, Users, Map, Clock } from 'lucide-react'

function Counter({ end, duration = 2000, suffix = '' }: { end: number, duration?: number, suffix?: string }) {
    const [count, setCount] = useState(0)
    const countRef = useRef(null)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1 }
        )

        if (countRef.current) {
            observer.observe(countRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime: number | null = null
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1) // 0 to 1

            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)

            setCount(Math.floor(easeProgress * end))

            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)

        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration, isVisible])

    return (
        <span ref={countRef}>
            {count.toLocaleString()}{suffix}
        </span>
    )
}

export function Stats({
    travelers = 10000,
    tours = 500,
    destinations = 30,
    years = 10
}: {
    travelers?: number,
    tours?: number,
    destinations?: number,
    years?: number
}) {
    const stats = [
        { label: 'Happy Travelers', value: travelers, suffix: '+', icon: Users },
        { label: 'Custom Tours', value: tours, suffix: '+', icon: Clock },
        { label: 'Destinations', value: destinations, suffix: '+', icon: Map },
        { label: 'Years Experience', value: years, suffix: '+', icon: Trophy },
    ]

    return (
        <section className="py-16 bg-white border-y border-gray-100">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <div key={i} className="text-center group p-6 rounded-2xl hover:bg-emerald-50 transition-colors duration-300">
                            <div className="w-12 h-12 mx-auto mb-4 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                <stat.icon size={24} />
                            </div>
                            <p className="text-3xl md:text-5xl font-bold text-gray-900 mb-2">
                                <Counter end={stat.value} suffix={stat.suffix} />
                            </p>
                            <p className="text-gray-500 font-medium text-sm md:text-base uppercase tracking-wider">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

