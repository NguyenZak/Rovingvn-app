'use client'

import { useState } from 'react'
import { Save, MapPin, Image as ImageIcon, Globe, Calendar, CloudRain } from 'lucide-react'
import NextImage from 'next/image'
import Link from 'next/link'
import { upsertDestination } from '@/app/(admin)/admin/actions'
import MediaPicker from '@/components/ui/MediaPicker'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import type { Region } from '@/lib/actions/region-actions'

interface DestinationFormProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    destination?: any
    isNew: boolean
    regions: Region[]
}

export function DestinationForm({ destination, isNew, regions }: DestinationFormProps) {
    const router = useRouter()
    const [imageUrl, setImageUrl] = useState(destination?.image_url || '')
    const [galleryImages] = useState(destination?.gallery_images || '[]')

    const getGalleryUrls = () => {
        if (Array.isArray(galleryImages)) return galleryImages
        try {
            const parsed = JSON.parse(galleryImages)
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
        const result = await upsertDestination(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success(isNew ? 'Destination created successfully' : 'Changes saved successfully')
            router.refresh()
            router.push('/admin/destinations')
        }
    }

    return (
        <form action={handleSubmit} className="space-y-6">
            <input type="hidden" name="id" value={destination?.id || ''} />

            {/* Basic Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-blue-600" />
                    Basic Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Destination Name *</label>
                        <input
                            required
                            name="name"
                            defaultValue={destination?.name}
                            placeholder="e.g., Hạ Long Bay, Hội An, Sapa"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
                        <input
                            name="country"
                            defaultValue={destination?.country || 'Vietnam'}
                            placeholder="Vietnam"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
                        <select
                            name="region"
                            defaultValue={destination?.region || ''}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        >
                            <option value="">Select a region</option>
                            {regions.map((region) => (
                                <option key={region.id} value={region.name}>
                                    {region.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                        <textarea
                            name="description"
                            rows={4}
                            defaultValue={destination?.description}
                            placeholder="Brief overview of the destination, what makes it special, main attractions..."
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                    </div>
                </div>
            </div>

            {/* Travel Details */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Calendar size={20} className="text-orange-500" />
                    Travel Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Best Time to Visit</label>
                        <input
                            name="best_time_to_visit"
                            defaultValue={destination?.best_time_to_visit || ''}
                            placeholder="e.g., October to April"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <CloudRain size={16} />
                            Climate Info
                        </label>
                        <input
                            name="climate_info"
                            defaultValue={destination?.climate_info || ''}
                            placeholder="e.g., Tropical, 25-35°C year-round"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Top Attractions</label>
                        <textarea
                            name="attractions"
                            rows={3}
                            defaultValue={destination?.attractions || ''}
                            placeholder="List main attractions (one per line)&#10;• Imperial Citadel&#10;• Japanese Covered Bridge&#10;• Ancient Town"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter one attraction per line</p>
                    </div>
                </div>
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
                            name="image_url"
                            value={imageUrl}
                            onChange={setImageUrl}
                        />
                        <p className="text-xs text-gray-400 mt-1">Main destination image (appears in cards and headers)</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images</label>

                        {/* Hidden input to store stringified array */}
                        <input type="hidden" name="gallery_images" value={JSON.stringify(galleryUrls)} />

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
                            {galleryUrls.map((url, index) => (
                                <div key={index} className="relative aspect-square rounded-xl overflow-hidden group border border-gray-200 bg-gray-50 shadow-sm">
                                    <NextImage
                                        src={url}
                                        alt={`Gallery ${index}`}
                                        fill
                                        className="object-cover transition-transform group-hover:scale-105"
                                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                                    />
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

                        <p className="text-xs text-gray-500">Drag and drop reordering coming soon.</p>
                    </div>
                </div>
            </div>

            {/* SEO Settings */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Globe size={20} className="text-blue-500" />
                    SEO & Metadata
                </h2>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug</label>
                        <input
                            name="slug"
                            defaultValue={destination?.slug || ''}
                            placeholder="ha-long-bay (auto-generated from name if empty)"
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Leave empty to auto-generate from destination name</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
                        <input
                            name="seo_title"
                            defaultValue={destination?.seo_title || ''}
                            placeholder="Visit Ha Long Bay - UNESCO World Heritage Site"
                            maxLength={60}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Recommended: 50-60 characters</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
                        <textarea
                            name="seo_description"
                            rows={2}
                            defaultValue={destination?.seo_description || ''}
                            placeholder="Explore the breathtaking Ha Long Bay with emerald waters and limestone islands..."
                            maxLength={160}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                        />
                        <p className="text-xs text-gray-500 mt-1">Recommended: 150-160 characters</p>
                    </div>
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center gap-6">
                    <select
                        name="status"
                        defaultValue={destination?.status || 'draft'}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700"
                    >
                        <option value="draft">Draft (not visible to public)</option>
                        <option value="published">Published (visible to public)</option>
                    </select>

                    <label className="flex items-center gap-2 cursor-pointer group">
                        <input
                            type="checkbox"
                            name="show_in_featured"
                            defaultChecked={destination?.show_in_featured || false}
                            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 focus:ring-2 cursor-pointer"
                        />
                        <span className="text-sm font-medium text-gray-700 group-hover:text-emerald-600 transition-colors">
                            Show in "Destinations Not To Miss"
                        </span>
                    </label>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/destinations"
                        className="px-6 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        className="flex items-center gap-2 px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors shadow-sm shadow-emerald-200"
                    >
                        <Save size={18} />
                        {isNew ? 'Create Destination' : 'Save Changes'}
                    </button>
                </div>
            </div>
        </form>
    )
}
