'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

interface Destination {
    id: string
    name: string
    slug: string
    short_description?: string
    image_url?: string
    region?: string
}

interface RegionDestinationsModalProps {
    isOpen: boolean
    onClose: () => void
    regionName: string
    destinations: Destination[]
    isLoading?: boolean
}

export function RegionDestinationsModal({
    isOpen,
    onClose,
    regionName,
    destinations,
    isLoading = false
}: RegionDestinationsModalProps) {
    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose()
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

            {/* Modal Content */}
            <div
                className="relative bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            {regionName}
                        </h2>
                        <p className="text-gray-600 text-sm mt-1">
                            {isLoading ? 'Loading...' : `${destinations.length} destinations`}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        aria-label="Close modal"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(85vh-80px)] p-6">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                        </div>
                    ) : destinations.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-500 text-lg">
                                No destinations found in this region yet.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {destinations.map((destination) => (
                                <Link
                                    key={destination.id}
                                    href={`/destinations/${destination.slug}`}
                                    className="group block bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 bg-gray-200 overflow-hidden">
                                        {destination.image_url ? (
                                            <Image
                                                src={destination.image_url}
                                                alt={destination.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600">
                                                <span className="text-white text-4xl font-bold">
                                                    {destination.name.charAt(0)}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
                                            {destination.name}
                                        </h3>
                                        {destination.short_description && (
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {destination.short_description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
