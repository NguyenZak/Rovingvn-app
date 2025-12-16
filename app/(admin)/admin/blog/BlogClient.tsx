'use client'

import Link from 'next/link'
import { Plus, Edit, FileText, Trash2, Search } from 'lucide-react'
import { deleteBlogPost } from '@/app/(admin)/admin/actions'
import { useState, useMemo } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface BlogPost {
    id: string
    title: string
    status: string
    category: string
    cover_image: string | null
    created_at: string
}

export default function BlogClient({ posts }: { posts: BlogPost[] }) {
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)

        const result = await deleteBlogPost(confirmDelete.id)

        setDeleting(false)
        setConfirmDelete(null)

        if (result?.error) {
            alert(result.error)
        } else {
            window.location.reload()
        }
    }

    // Filter and search posts
    const filteredPosts = useMemo(() => {
        return posts.filter(post => {
            const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase())
            const matchesStatus = statusFilter === 'all' || post.status === statusFilter
            const matchesCategory = categoryFilter === 'all' || post.category === categoryFilter

            return matchesSearch && matchesStatus && matchesCategory
        })
    }, [posts, searchQuery, statusFilter, categoryFilter])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Blog Posts</h1>
                <Link href="/admin/blog/new" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    <Plus size={20} /> New Post
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search posts by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="all">All Categories</option>
                    <option value="guide">Travel Guide</option>
                    <option value="culture">Culture & History</option>
                    <option value="food">Food & Drink</option>
                    <option value="news">News & Updates</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Title</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Category</th>
                            <th className="p-4 font-semibold text-gray-600">Date</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
                                            {post.cover_image ? <img src={post.cover_image} className="w-full h-full object-cover" alt="" /> : <FileText size={20} />}
                                        </div>
                                        <span className="font-medium text-gray-900 line-clamp-1">{post.title}</span>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.status === 'published' ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {post.status}
                                    </span>
                                </td>
                                <td className="p-4 text-gray-600 capitalize">{post.category}</td>
                                <td className="p-4 text-gray-600 text-sm">{new Date(post.created_at).toLocaleDateString()}</td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/blog/${post.id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setConfirmDelete({ id: post.id, title: post.title })}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredPosts.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    {searchQuery || statusFilter !== 'all' || categoryFilter !== 'all'
                                        ? 'No posts match your search criteria.'
                                        : 'No blog posts yet. Write something inspiring!'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredPosts.length} of {posts.length} posts
                </div>
            )}

            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Delete Blog Post"
                message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </div>
    )
}
