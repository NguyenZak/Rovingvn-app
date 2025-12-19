'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { Camera, X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'

interface DestinationGalleryProps {
    images: string[]
    destinationName: string
}

export default function DestinationGallery({ images, destinationName }: DestinationGalleryProps) {
    const [lightboxOpen, setLightboxOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    // Handle keyboard navigation
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!lightboxOpen) return

        if (e.key === 'Escape') setLightboxOpen(false)
        if (e.key === 'ArrowLeft') setPhotoIndex((prev) => (prev + images.length - 1) % images.length)
        if (e.key === 'ArrowRight') setPhotoIndex((prev) => (prev + 1) % images.length)
    }, [lightboxOpen, images.length])

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [handleKeyDown])

    const openLightbox = (index: number) => {
        setPhotoIndex(index)
        setLightboxOpen(true)
    }

    if (!images || images.length === 0) return null

    return (
        <>
            <section>
                <h2 className="text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Camera className="text-emerald-600" />
                    Photo Gallery
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[200px]">
                    {images.slice(0, 5).map((img, idx) => (
                        <div
                            key={idx}
                            onClick={() => openLightbox(idx)}
                            className={`relative rounded-2xl overflow-hidden group cursor-pointer ${idx === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${destinationName} photo ${idx + 1}`}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                sizes={idx === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                                <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform scale-75 group-hover:scale-100" size={32} />
                            </div>
                        </div>
                    ))}
                    {images.length > 5 && (
                        <div
                            onClick={() => openLightbox(5)}
                            className="relative rounded-2xl overflow-hidden group col-span-1 row-span-1 bg-gray-100 flex items-center justify-center cursor-pointer"
                        >
                            <Image
                                src={images[5]}
                                alt="More photos"
                                fill
                                className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">+{images.length - 5} More</span>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Lightbox Overlay */}
            {lightboxOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-200">
                    <button
                        onClick={() => setLightboxOpen(false)}
                        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2 z-50"
                    >
                        <X size={32} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setPhotoIndex((photoIndex + images.length - 1) % images.length) }}
                        className="absolute left-4 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-black/40 rounded-full"
                    >
                        <ChevronLeft size={40} />
                    </button>

                    <button
                        onClick={(e) => { e.stopPropagation(); setPhotoIndex((photoIndex + 1) % images.length) }}
                        className="absolute right-4 text-white/70 hover:text-white transition-colors p-2 z-50 bg-black/20 hover:bg-black/40 rounded-full"
                    >
                        <ChevronRight size={40} />
                    </button>

                    <div className="relative w-full h-full max-w-7xl max-h-[90vh] p-4 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <Image
                                src={images[photoIndex]}
                                alt={`${destinationName} full screen ${photoIndex + 1}`}
                                fill
                                className="object-contain"
                                quality={90}
                                priority
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-4 left-0 right-0 text-center text-white/80 font-medium">
                        {photoIndex + 1} / {images.length}
                    </div>
                </div>
            )}
        </>
    )
}
