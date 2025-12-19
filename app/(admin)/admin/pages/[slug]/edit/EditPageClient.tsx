'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getPageContent, updatePageContent } from '@/lib/actions/page-actions'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'

export default function EditPageClient({ slug }: { slug: string }) {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [page, setPage] = useState<any>(null)
    const [formData, setFormData] = useState({
        title: '',
        meta_title: '',
        meta_description: '',
        content: '{}'
    })

    useEffect(() => {
        async function loadPage() {
            const result = await getPageContent(slug)
            if (result.success && result.data) {
                setPage(result.data)
                setFormData({
                    title: result.data.title,
                    meta_title: result.data.meta_title || '',
                    meta_description: result.data.meta_description || '',
                    content: JSON.stringify(result.data.content, null, 2)
                })
            }
            setLoading(false)
        }
        loadPage()
    }, [slug])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const contentObj = JSON.parse(formData.content)
            const result = await updatePageContent(slug, {
                title: formData.title,
                meta_title: formData.meta_title,
                meta_description: formData.meta_description,
                content: contentObj
            })

            if (result.success) {
                toast.success('Page updated successfully!')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to update page')
            }
        } catch (error) {
            toast.error('Invalid JSON in content field')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 rounded"></div>
                </div>
            </div>
        )
    }

    if (!page) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-600">Page not found</p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <Link
                    href="/admin/pages"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={20} />
                    Back to Pages
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Edit {page.title}</h1>
                <p className="text-gray-600 mt-1">Update page content and SEO settings</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Page Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Title
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Title (SEO)
                            </label>
                            <input
                                type="text"
                                value={formData.meta_title}
                                onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Meta Description (SEO)
                            </label>
                            <textarea
                                value={formData.meta_description}
                                onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                                rows={3}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Page Content (JSON)</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Edit the JSON structure below. Be careful with syntax!
                    </p>

                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={20}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <Link
                        href="/admin/pages"
                        className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    )
}
