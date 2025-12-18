'use client'

import { useState } from 'react'
import { upsertTour } from '@/app/(admin)/admin/actions'
import { Save, ChevronLeft, Image as ImageIcon } from 'lucide-react'
import Link from 'next/link'
import MediaPicker from '@/components/ui/MediaPicker'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface TourFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    tour?: any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destinations?: any[]
    relatedDestinationIds?: string[]
}

export default function TourForm({ tour, destinations, relatedDestinationIds = [] }: TourFormProps) {
    const router = useRouter()
    const isEdit = !!tour?.id
    const [imageUrl, setImageUrl] = useState(tour?.cover_image || tour?.featured_image || tour?.image_url || '')

    // Multi-destination state
    // Use relatedDestinationIds if available, otherwise fallback to single destination_id if present (legacy)
    const initialDests = relatedDestinationIds.length > 0
        ? relatedDestinationIds
        : (tour?.destination_id ? [tour.destination_id] : [])
    const [selectedDestIds, setSelectedDestIds] = useState<string[]>(initialDests)

    const toggleDestination = (id: string) => {
        if (selectedDestIds.includes(id)) {
            setSelectedDestIds(prev => prev.filter(d => d !== id))
        } else {
            setSelectedDestIds(prev => [...prev, id])
        }
    }

    // Gallery State Logic
    const getGalleryUrls = () => {
        // Check new schema first, then legacy schema (gallery_images might be array in DB)
        const images = tour?.images || tour?.gallery_images
        if (images && Array.isArray(images)) return images
        try {
            const parsed = JSON.parse(tour?.gallery_images || '[]')
            return Array.isArray(parsed) ? parsed : []
        } catch {
            return []
        }
    }
    const [galleryUrls, setGalleryUrls] = useState<string[]>(getGalleryUrls())

    const handleGalleryAdd = (url: string | string[]) => {
        const urlsToAdd = Array.isArray(url) ? url : [url]
        const newUrls = [...galleryUrls, ...urlsToAdd]
        setGalleryUrls(newUrls)
    }

    const removeGalleryImage = (index: number) => {
        const newUrls = galleryUrls.filter((_, i) => i !== index)
        setGalleryUrls(newUrls)
    }

    const handleSubmit = async (formData: FormData) => {
        const result = await upsertTour(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Tour saved successfully')
            router.refresh()
            router.push('/admin/tours')
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/tours" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Tour' : 'Create New Tour'}</h1>
            </div>

            <form action={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 space-y-6">
                {isEdit && <input type="hidden" name="id" value={tour.id} />}

                {/* Basic Information */}
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title *</label>
                                <input
                                    required
                                    name="title"
                                    defaultValue={tour?.title}
                                    type="text"
                                    placeholder="e.g., Halong Bay 2 Days 1 Night Cruise"
                                    className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Destinations</label>
                                <input type="hidden" name="destination_ids" value={JSON.stringify(selectedDestIds)} />
                                <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-h-60 overflow-y-auto">
                                    <div className="flex flex-wrap gap-2">
                                        {destinations?.map(d => {
                                            const isSelected = selectedDestIds.includes(d.id)
                                            return (
                                                <button
                                                    key={d.id}
                                                    type="button"
                                                    onClick={() => toggleDestination(d.id)}
                                                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${isSelected
                                                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200 hover:bg-emerald-200'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    {d.name} {isSelected && '✓'}
                                                </button>
                                            )
                                        })}
                                        {(!destinations || destinations.length === 0) && (
                                            <p className="text-sm text-gray-500 italic">No destinations found. Create one first.</p>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">Select all destinations included in this tour.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                                <input
                                    name="duration"
                                    defaultValue={tour?.duration || (tour?.duration_days ? `${tour.duration_days} Days ${tour.duration_nights} Nights` : '')}
                                    placeholder="e.g., 3 Days 2 Nights"
                                    type="text"
                                    className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                                <input
                                    name="price"
                                    defaultValue={tour?.price ?? tour?.price_adult}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    placeholder="Leave empty for 'Contact'"
                                    className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    name="status"
                                    defaultValue={tour?.status || 'draft'}
                                    className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description</h3>
                        <textarea
                            name="description"
                            defaultValue={tour?.description || ''}
                            rows={5}
                            placeholder="Describe the tour experience, what makes it special..."
                            className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Highlights/Inclusions */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Highlights & Inclusions</h3>
                        <textarea
                            name="highlights"
                            defaultValue={Array.isArray(tour?.highlights || tour?.includes) ? (tour?.highlights || tour?.includes).join('\n') : (tour?.highlights || tour?.includes) || ''}
                            rows={4}
                            placeholder="• Professional tour guide&#10;• Accommodation in 4-star hotel&#10;• All meals included&#10;• Airport transfers"
                            className="w-full px-4 py-2 font-medium text-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter one item per line, use • or - for bullet points</p>
                    </div>

                    {/* Images */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <ImageIcon size={20} className="text-purple-600" />
                            Images & Media
                        </h2>
                        <div className="space-y-6">
                            <div>
                                <MediaPicker
                                    label="Cover Image"
                                    name="cover_image"
                                    value={imageUrl}
                                    onChange={setImageUrl}
                                />
                                <p className="text-xs text-gray-400 mt-1">Main tour image (appears in cards and headers)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>

                                {/* Hidden input to store stringified array */}
                                <input type="hidden" name="gallery_images" value={JSON.stringify(galleryUrls)} />

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                                    {galleryUrls.map((url, index) => (
                                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 bg-gray-50 shadow-sm">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={url} alt={`Gallery ${index}`} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(index)}
                                                className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-red-600 shadow-sm"
                                                title="Remove image"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                            </button>
                                        </div>
                                    ))}

                                    {/* Add new image button using MediaPicker as a wrapper */}
                                    <MediaPicker
                                        multiple
                                        onChange={(url) => {
                                            if (url) handleGalleryAdd(url)
                                        }}
                                    >
                                        <div className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 hover:bg-emerald-50/50 hover:border-emerald-500 transition-all cursor-pointer group h-full w-full">
                                            <div className="w-10 h-10 rounded-full bg-white border border-gray-200 group-hover:border-emerald-200 group-hover:text-emerald-600 flex items-center justify-center mb-2 shadow-sm transition-colors text-gray-400">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-500 group-hover:text-emerald-700">Add Image</span>
                                        </div>
                                    </MediaPicker>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                    <Link href="/admin/tours" className="text-gray-600 hover:text-gray-900 font-medium">
                        Cancel
                    </Link>
                    <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                        <Save size={18} />
                        <span>{isEdit ? 'Update' : 'Create'} Tour</span>
                    </button>
                </div>
            </form>
        </div>
    )
}
