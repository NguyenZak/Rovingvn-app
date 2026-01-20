'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, SlidersHorizontal, X, MapPin, DollarSign, Clock, ChevronDown } from 'lucide-react'
import { TourCard } from '@/components/features/tours/TourCard'
import type { Tour } from '@/lib/actions/tour-actions'

interface Destination {
    id: string
    name: string
    slug: string
}

interface Region {
    id: string
    name: string
    slug: string
}

interface ToursClientProps {
    initialTours: Tour[]
    destinations: Destination[]
    regions: Region[]
}

const DURATION_OPTIONS = [
    { label: '1 Day', value: '1' },
    { label: '2-3 Days', value: '2-3' },
    { label: '4-7 Days', value: '4-7' },
    { label: '8+ Days', value: '8+' }
]

export function ToursClient({ initialTours, destinations, regions }: ToursClientProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [tours, setTours] = useState(initialTours)
    const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
    const [selectedDestination, setSelectedDestination] = useState(searchParams.get('destination') || '')
    const [selectedRegion, setSelectedRegion] = useState(searchParams.get('region') || '')
    const [selectedDuration, setSelectedDuration] = useState(searchParams.get('duration') || '')
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '')
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '')
    const [showFilters, setShowFilters] = useState(false)

    // Update URL params
    const updateURL = useCallback(() => {
        const params = new URLSearchParams()

        if (searchQuery) params.set('q', searchQuery)
        if (selectedDestination) params.set('destination', selectedDestination)
        if (selectedRegion) params.set('region', selectedRegion)
        if (selectedDuration) params.set('duration', selectedDuration)
        if (minPrice) params.set('minPrice', minPrice)
        if (maxPrice) params.set('maxPrice', maxPrice)

        const queryString = params.toString()
        router.push(queryString ? `/tours?${queryString}` : '/tours')
    }, [searchQuery, selectedDestination, selectedRegion, selectedDuration, minPrice, maxPrice, router])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            updateURL()
        }, 500)

        return () => clearTimeout(timer)
    }, [searchQuery, updateURL])

    // Immediate update for filters
    useEffect(() => {
        if (searchParams.get('q') !== searchQuery) return // Skip if search is updating
        updateURL()
    }, [selectedDestination, selectedRegion, selectedDuration, minPrice, maxPrice])

    // Update tours when URL changes
    useEffect(() => {
        setTours(initialTours)
    }, [initialTours])

    const clearFilters = () => {
        setSearchQuery('')
        setSelectedDestination('')
        setSelectedRegion('')
        setSelectedDuration('')
        setMinPrice('')
        setMaxPrice('')
        router.push('/tours')
    }

    const activeFiltersCount = [
        searchQuery,
        selectedDestination,
        selectedRegion,
        selectedDuration,
        minPrice,
        maxPrice
    ].filter(Boolean).length

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in duration-700">
                            Explore Our Tours
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed">
                            Browse our handpicked selection of tours designed to immerse you in the culture, history, and natural beauty of Vietnam
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-12 md:py-24">
                {/* Search and Filters Bar */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                            <input
                                type="text"
                                placeholder="Search tours..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                            />
                        </div>

                        {/* Filter Toggle Button */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                        >
                            <SlidersHorizontal size={18} />
                            Filters
                            {activeFiltersCount > 0 && (
                                <span className="bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>

                        {/* Clear Filters */}
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="flex items-center gap-2 px-6 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
                            >
                                <X size={18} />
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Filters Panel */}
                    {showFilters && (
                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Destination Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-emerald-600" />
                                    Destination
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedDestination}
                                        onChange={(e) => setSelectedDestination(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                                    >
                                        <option value="">All Destinations</option>
                                        {destinations.map((dest) => (
                                            <option key={dest.id} value={dest.slug}>
                                                {dest.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Region Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <MapPin size={16} className="text-blue-600" />
                                    Region
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedRegion}
                                        onChange={(e) => setSelectedRegion(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                                    >
                                        <option value="">All Regions</option>
                                        {regions.map((region) => (
                                            <option key={region.id} value={region.slug}>
                                                {region.name}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Duration Filter */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock size={16} className="text-purple-600" />
                                    Duration
                                </label>
                                <div className="relative">
                                    <select
                                        value={selectedDuration}
                                        onChange={(e) => setSelectedDuration(e.target.value)}
                                        className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white"
                                    >
                                        <option value="">Any Duration</option>
                                        {DURATION_OPTIONS.map((opt) => (
                                            <option key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                                </div>
                            </div>

                            {/* Price Range */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <DollarSign size={16} className="text-amber-600" />
                                    Price Range (USD)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={minPrice}
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={maxPrice}
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        className="w-1/2 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Active Filters Display */}
                {activeFiltersCount > 0 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {searchQuery && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                                Search: "{searchQuery}"
                                <button onClick={() => setSearchQuery('')} className="hover:text-emerald-900">
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {selectedDestination && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                                {destinations.find(d => d.slug === selectedDestination)?.name}
                                <button onClick={() => setSelectedDestination('')} className="hover:text-blue-900">
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {selectedRegion && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                                {regions.find(r => r.slug === selectedRegion)?.name}
                                <button onClick={() => setSelectedRegion('')} className="hover:text-purple-900">
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {selectedDuration && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm">
                                {DURATION_OPTIONS.find(d => d.value === selectedDuration)?.label}
                                <button onClick={() => setSelectedDuration('')} className="hover:text-amber-900">
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                        {(minPrice || maxPrice) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                                ${minPrice || '0'} - ${maxPrice || '∞'}
                                <button onClick={() => { setMinPrice(''); setMaxPrice('') }} className="hover:text-green-900">
                                    <X size={14} />
                                </button>
                            </span>
                        )}
                    </div>
                )}

                {/* Results Count */}
                <div className="mb-6 text-gray-600">
                    <span className="font-medium text-gray-900">{tours.length}</span> {tours.length === 1 ? 'tour' : 'tours'} found
                </div>

                {/* Tours Grid */}
                {tours && tours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {tours.map((tour) => (
                            <TourCard key={tour.id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No tours found</h3>
                        <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Clear All Filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
