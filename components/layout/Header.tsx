
'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, MapPin } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: (string | undefined | null | false)[]) {
    return twMerge(clsx(inputs))
}

const NAV_LINKS = [
    { href: '/tours', label: 'Tours' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/blog', label: 'Blog' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
]

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <header
            className={cn(
                'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
            )}
        >
            <div className="container mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="bg-emerald-600 text-white p-2 rounded-lg group-hover:bg-emerald-700 transition-colors">
                        <MapPin size={24} />
                    </div>
                    <span className={cn("text-xl font-bold tracking-tight", isScrolled ? "text-gray-900" : "text-white")}>
                        Roving Việt Nam
                    </span>
                </Link>

                {/* Desktop Nav */}
                <nav className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors hover:text-emerald-500",
                                isScrolled ? "text-gray-600" : "text-white/90"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/contact"
                        className="bg-emerald-600 text-white px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20"
                    >
                        Plan Your Trip
                    </Link>
                </nav>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden p-1"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? (
                        <X className={isScrolled ? "text-gray-900" : "text-white"} />
                    ) : (
                        <Menu className={isScrolled ? "text-gray-900" : "text-white"} />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-xl p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-gray-600 font-medium py-2 hover:text-emerald-600 px-2 rounded-md hover:bg-emerald-50"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <hr className="border-gray-100" />
                    <Link
                        href="/contact"
                        className="bg-emerald-600 text-white px-5 py-3 rounded-xl text-center font-semibold hover:bg-emerald-700 transition-colors"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Plan Your Trip
                    </Link>
                </div>
            )}
        </header>
    )
}
