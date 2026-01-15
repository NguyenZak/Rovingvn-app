'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createRegion, updateRegion, type Region, type RegionInput } from '@/lib/actions/region-actions'
import MediaPicker from '@/components/ui/MediaPicker'
import { Loader2, Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface RegionFormProps {
    initialData?: Region
}

const COLOR_OPTIONS = [
    // ... (omitted for brevity, will remain unchanged)
];

export function RegionForm({ initialData }: RegionFormProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<RegionInput>({
        name: initialData?.name || '',
        description: initialData?.description || '',
        details: initialData?.details || '',
        image_url: initialData?.image_url || '',
        color: initialData?.color || 'from-emerald-900',
        link: initialData?.link || '',
        display_order: initialData?.display_order || 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const result = initialData
                ? await updateRegion(initialData.id, formData)
                : await createRegion(formData)

            if (result.success) {
                router.push('/admin/regions')
                router.refresh()
            } else {
                setError(result.error || 'Something went wrong')
            }
        } catch (err) {
            setError('An unexpected error occurred')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="mb-6">
                <Link href="/admin/regions" className="text-gray-500 hover:text-gray-700 flex items-center gap-1 text-sm mb-4">
                    <ArrowLeft size={16} /> Back to Regions
                </Link>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column: Basic Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Region Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g. Northern Vietnam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                            <input
                                type="text"
                                value={formData.description || ''}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g. Hanoi, Sapa, Ha Long Bay"
                            />
                            <p className="text-xs text-gray-500 mt-1">Shown below the name on the card.</p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                            <textarea
                                rows={4}
                                value={formData.details || ''}
                                onChange={e => setFormData({ ...formData, details: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="Detailed description shown on hover..."
                            />
                        </div>
                    </div>

                    {/* Right Column: Visuals & Links */}
                    {/* Right Column: Visuals & Links */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cover Image</label>
                            <div className="h-48 border border-gray-200 rounded-lg overflow-hidden relative mb-2">
                                {formData.image_url ? (
                                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 text-gray-400">No image selected</div>
                                )}
                            </div>
                            <MediaPicker
                                value={formData.image_url || ''}
                                onChange={(url) => {
                                    setFormData({ ...formData, image_url: url as string })
                                }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Overlay Color</label>
                                <select
                                    value={formData.color || ''}
                                    onChange={e => setFormData({ ...formData, color: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none appearance-none bg-white"
                                >
                                    {COLOR_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Link (Optional)</label>
                            <input
                                type="text"
                                value={formData.link || ''}
                                onChange={e => setFormData({ ...formData, link: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                placeholder="e.g. /tours?region=North"
                            />
                            <p className="text-xs text-gray-500 mt-1">Overrides default routing if set.</p>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-6 border-t border-gray-100">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                        Save Region
                    </button>
                </div>
            </form >
        </div >
    )
}
