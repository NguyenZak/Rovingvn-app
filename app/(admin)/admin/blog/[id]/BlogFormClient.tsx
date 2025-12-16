'use client'

import { createClient } from '@/lib/supabase/server'
import { upsertBlogPost } from '../../actions'
import { ChevronLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function BlogPostFormClient({ post, isNew }: { post: any, isNew: boolean }) {
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        const result = await upsertBlogPost(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Blog post saved successfully!')
            router.push('/admin/blog')
        }
    }

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/blog" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">{isNew ? 'New Blog Post' : 'Edit Post'}</h1>
            </div>

            <form action={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <input type="hidden" name="id" value={post?.id || ''} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                        <input required name="title" defaultValue={post?.title} placeholder="10 Best things to do in..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-bold text-lg" />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select name="category" defaultValue={post?.category || 'guide'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="guide">Travel Guide</option>
                            <option value="culture">Culture & History</option>
                            <option value="food">Food & Drink</option>
                            <option value="news">News & Updates</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select name="status" defaultValue={post?.status || 'draft'} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none">
                            <option value="draft">Draft</option>
                            <option value="published">Published</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
                    <textarea name="excerpt" rows={3} defaultValue={post?.excerpt} placeholder="Short summary for preview cards..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input name="cover_image" defaultValue={post?.cover_image} placeholder="https://..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content (Markdown supported)</label>
                    <textarea required name="content" rows={15} defaultValue={post?.content} placeholder="# Heading..." className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono text-sm" />
                </div>

                <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button type="submit" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                        <Save size={20} /> Save Post
                    </button>
                </div>
            </form>
        </div>
    )
}
