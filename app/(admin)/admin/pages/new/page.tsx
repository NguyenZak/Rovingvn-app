'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPage } from '@/lib/actions/page-actions'
import { Save, X } from 'lucide-react'
import { toast } from 'sonner'

export default function CreatePageClient() {
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({
        slug: '',
        title: '',
        meta_title: '',
        meta_description: '',
        content: JSON.stringify({
            hero: {
                title: 'Page Title',
                subtitle: 'Page subtitle'
            },
            sections: []
        }, null, 2)
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSaving(true)

        try {
            const contentObj = JSON.parse(formData.content)
            const result = await createPage({
                slug: formData.slug,
                title: formData.title,
                meta_title: formData.meta_title,
                meta_description: formData.meta_description,
                content: contentObj
            })

            if (result.success) {
                toast.success('Page created successfully!')
                router.push('/admin/pages')
                router.refresh()
            } else {
                toast.error(result.error || 'Failed to create page')
            }
        } catch (error) {
            toast.error('Invalid JSON in content field')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
                <p className="text-gray-600 mt-1">Add a new page to your website</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6">Page Information</h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Slug (URL) <span className="text-red-500">*</span>
                            </label>
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">/</span>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                    placeholder="about-us"
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    required
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                Only lowercase letters, numbers, and hyphens. Example: about-us, faq, privacy-policy
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Page Title <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="About Us"
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
                                placeholder="About Us - Your Company"
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
                                placeholder="Learn more about our company and mission..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                            />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Page Content (JSON)</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        Define your page structure in JSON format. You can customize this later.
                    </p>

                    <textarea
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        rows={15}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-mono text-sm"
                        required
                    />
                </div>

                <div className="flex items-center justify-end gap-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        <X size={20} />
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                        <Save size={20} />
                        {saving ? 'Creating...' : 'Create Page'}
                    </button>
                </div>
            </form>
        </div>
    )
}
