/**
 * Blog Form Component
 * Reusable form for creating and editing blog posts
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Image as ImageIcon, Globe
} from "lucide-react";
import { createPost, updatePost } from "@/lib/actions/blog-actions";
import type { BlogPost, BlogCategory } from "@/lib/actions/blog-actions";
import { GenericImageUpload } from "@/app/(admin)/admin/components/GenericImageUpload";
import { RichTextEditor } from "@/app/(admin)/admin/components/RichTextEditor";

interface BlogFormProps {
    initialData?: BlogPost;
    categories: BlogCategory[];
}

export function BlogForm({ initialData, categories }: BlogFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [formData, setFormData] = useState<Partial<BlogPost>>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        excerpt: initialData?.excerpt || '',
        content: initialData?.content || '',
        category_id: initialData?.category_id || '',
        featured_image: initialData?.featured_image || '',
        status: initialData?.status || 'draft',
        meta_title: initialData?.meta_title || '',
        meta_description: initialData?.meta_description || '',
        featured: initialData?.featured || false,
        tags: initialData?.tags || [],
    });

    const [tagsInput, setTagsInput] = useState(initialData?.tags?.join(', ') || '');

    const generateSlug = (title: string) => {
        return title.toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9\s-]/g, '')
            .trim().replace(/\s+/g, '-').replace(/-+/g, '-');
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: keyof BlogPost, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'title' && !initialData) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    const handleTagsChange = (value: string) => {
        setTagsInput(value);
        const tagsArray = value.split(',').map(t => t.trim()).filter(Boolean);
        handleChange('tags', tagsArray);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            let result;
            if (initialData?.id) {
                result = await updatePost(initialData.id, formData);
            } else {
                result = await createPost(formData);
            }

            if (result.success) {
                setMessage({ type: 'success', text: initialData ? 'Post updated!' : 'Post created!' });
                if (!initialData) {
                    router.push('/admin/blog');
                } else {
                    router.refresh();
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'Something went wrong' });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    {initialData ? 'Edit Post' : 'Write New Post'}
                </h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Save Post
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                type="text"
                                required
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-lg font-medium"
                                placeholder="Enter post title"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => handleChange('slug', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
                            <textarea
                                rows={3}
                                value={formData.excerpt}
                                onChange={(e) => handleChange('excerpt', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Brief summary..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                            <RichTextEditor
                                value={formData.content || ''}
                                onChange={(value) => handleChange('content', value)}
                                placeholder="Write your content here..."
                            />
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Globe size={18} /> SEO Settings
                        </h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                            <input
                                type="text"
                                value={formData.meta_title || ''}
                                onChange={(e) => handleChange('meta_title', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder={formData.title}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                            <textarea
                                rows={3}
                                value={formData.meta_description || ''}
                                onChange={(e) => handleChange('meta_description', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder={formData.excerpt}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                            <input
                                type="text"
                                value={tagsInput}
                                onChange={(e) => handleTagsChange(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Travel, Tips, Vietnam (comma separated)"
                            />
                            <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Status & Category */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                                <option value="archived">Archived</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                            <select
                                value={formData.category_id}
                                onChange={(e) => handleChange('category_id', e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="">Select Category</option>
                                <option value="">Uncategorized</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="featured"
                                checked={formData.featured}
                                onChange={(e) => handleChange('featured', e.target.checked)}
                                className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                            />
                            <label htmlFor="featured" className="text-sm font-medium text-gray-700 select-none">
                                Mark as Featured Post
                            </label>
                        </div>
                    </div>

                    {/* Featured Image */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ImageIcon size={18} /> Featured Image
                        </h2>
                        <GenericImageUpload
                            label=""
                            value={formData.featured_image || ''}
                            onChange={(url) => handleChange('featured_image', url)}
                            folder="blog"
                            recommendedSize="1200x630px"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
}
