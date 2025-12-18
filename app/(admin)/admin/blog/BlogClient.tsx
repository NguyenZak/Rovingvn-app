/**
 * Blog Management - Client Component
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    FileText, Calendar, Eye, Edit, Trash2,
    Plus, Search, CheckCircle, XCircle
} from "lucide-react";
import { deletePost } from "@/lib/actions/blog-actions";
import type { BlogPost, BlogCategory } from "@/lib/actions/blog-actions";
import Link from "next/link";
import Image from "next/image";

interface BlogClientProps {
    initialPosts: BlogPost[];
    initialCategories: BlogCategory[];
    // initialPagination: any;
    initialSearch: string;
    initialStatus: string;
    initialCategory: string;
}

export function BlogClient({
    initialPosts,
    initialCategories,
    // initialPagination,
    initialSearch,
    initialStatus,
    initialCategory
}: BlogClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [posts, setPosts] = useState(initialPosts);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [categoryFilter, setCategoryFilter] = useState(initialCategory);
    const [isPending, startTransition] = useTransition();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        updateParams('search', query);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        updateParams('status', status);
    };

    const handleCategoryFilter = (category: string) => {
        setCategoryFilter(category);
        updateParams('category', category);
    };

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deletePost(id);
            if (result.success) {
                setPosts(posts.filter(p => p.id !== id));
                setDeleteId(null);
                showMessage('success', 'Post deleted successfully');
                router.refresh();
            } else {
                showMessage('error', result.error || 'Failed to delete post');
            }
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="w-full mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
                    <p className="text-gray-600 mt-1">Manage articles and news</p>
                </div>

                <Link
                    href="/admin/blog/new"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Write New Post
                </Link>
            </div>

            {/* Message */}
            {message && (
                <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>

                    {/* Category Filter */}
                    <select
                        value={categoryFilter}
                        onChange={(e) => handleCategoryFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Categories</option>
                        {initialCategories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900 w-1/2">Title</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Category</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Status</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {post.featured_image ? (
                                                    <Image
                                                        src={post.featured_image}
                                                        alt={post.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full text-gray-300">
                                                        <FileText size={20} />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900 line-clamp-1">{post.title}</div>
                                                <div className="text-sm text-gray-500 line-clamp-1">{post.slug}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {post.category?.name || 'Uncategorized'}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                                            {post.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar size={14} />
                                            {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/blog/${post.slug}`}
                                                target="_blank"
                                                className="p-1.5 text-gray-500 hover:text-emerald-600 transition-colors"
                                                title="View"
                                            >
                                                <Eye size={18} />
                                            </Link>

                                            <Link
                                                href={`/admin/blog/${post.id}/edit`}
                                                className="p-1.5 text-gray-500 hover:text-blue-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Edit size={18} />
                                            </Link>

                                            <button
                                                onClick={() => setDeleteId(post.id)}
                                                className="p-1.5 text-gray-500 hover:text-red-600 transition-colors"
                                                title="Delete"
                                                disabled={isPending}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {posts.length === 0 && (
                    <div className="text-center py-12">
                        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
                        <p className="text-gray-600 mb-4">Start writing your first blog post</p>
                        <Link
                            href="/admin/blog/new"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            <Plus size={20} />
                            Write New Post
                        </Link>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Post?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this post? This action cannot be undone.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                disabled={isPending}
                            >
                                {isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
