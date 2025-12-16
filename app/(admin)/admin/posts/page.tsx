// ============================================
// CMS Posts Listing Page (Server Component)
// ============================================

import { createClient } from '@/lib/supabase/server'
import { requireEditor } from '@/lib/supabase/server'
import Link from 'next/link'
import { PostWithRelations, PostStatus } from '@/lib/types/cms'
import { VI_LABELS } from '@/lib/constants/vi'


export default async function PostsPage() {
    await requireEditor()
    const supabase = await createClient()

    // Fetch all posts with author and categories
    const { data: posts, error } = await supabase
        .from('posts')
        .select(`
      *,
      author:author_id(id, email),
      featured_image:featured_image_id(id, url, filename),
      post_categories(category:category_id(id, name, slug)),
      post_tags(tag:tag_id(id, name, slug))
    `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching posts:', error)
    }

    const postsWithRelations: PostWithRelations[] = posts || []

    // Count stats
    const totalPosts = postsWithRelations.length
    const publishedPosts = postsWithRelations.filter(p => p.status === 'published').length
    const draftPosts = postsWithRelations.filter(p => p.status === 'draft').length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{VI_LABELS.posts.allPosts}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {totalPosts} bài viết ({publishedPosts} đã xuất bản, {draftPosts} nháp)
                    </p>
                </div>
                <Link
                    href="/admin/posts/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    {VI_LABELS.posts.createNew}
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">{VI_LABELS.stats.totalPosts}</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{totalPosts}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">{VI_LABELS.stats.publishedPosts}</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">{publishedPosts}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">{VI_LABELS.stats.draftPosts}</div>
                    <div className="text-3xl font-bold text-gray-400 mt-2">{draftPosts}</div>
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.posts.title}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.posts.status}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.posts.author}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.posts.categories}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.posts.createdAt}
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {VI_LABELS.actions.actions}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {postsWithRelations.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                    {VI_LABELS.posts.noPosts}
                                </td>
                            </tr>
                        ) : (
                            postsWithRelations.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                        <div className="text-sm text-gray-500">{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${post.status === 'published'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {post.status === 'published'
                                                ? VI_LABELS.posts.published
                                                : VI_LABELS.posts.draft}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {/* @ts-expect-error Supabase relation type */}
                                        {post.author?.email || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {/* @ts-expect-error Supabase relation type */}
                                        {post.post_categories?.map(pc => pc.category.name).join(', ') || '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                    <td className="px-6 py-4 text-right text-sm space-x-2">
                                        <Link
                                            href={`/admin/posts/${post.id}/edit`}
                                            className="text-blue-600 hover:text-blue-800"
                                        >
                                            {VI_LABELS.actions.edit}
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
