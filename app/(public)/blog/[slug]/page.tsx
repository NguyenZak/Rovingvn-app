import { getPostBySlug, incrementViewCount, getRelatedPosts } from '@/lib/actions/blog-actions'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Calendar, ArrowLeft, Eye, Tag } from 'lucide-react'
import { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface BlogPageProps {
    params: Promise<{ slug: string }>
}

// Generate metadata for SEO
export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
    const { slug } = await params
    const result = await getPostBySlug(slug)

    if (!result.success || !result.data) {
        return {
            title: 'Blog Post Not Found',
        }
    }

    const post = result.data

    return {
        title: post.meta_title || post.title,
        description: post.meta_description || post.excerpt || post.title,
        openGraph: {
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt || post.title,
            images: post.featured_image ? [post.featured_image] : [],
            type: 'article',
            publishedTime: post.published_at || post.created_at,
        },
        twitter: {
            card: 'summary_large_image',
            title: post.meta_title || post.title,
            description: post.meta_description || post.excerpt || post.title,
            images: post.featured_image ? [post.featured_image] : [],
        },
    }
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const { slug } = await params
    const result = await getPostBySlug(slug)

    if (!result.success || !result.data) {
        notFound()
    }

    const post = result.data

    // Increment view count (fire and forget)
    incrementViewCount(post.id).catch(() => {
        // Silently fail - not critical
    })

    // Get related posts
    const relatedResult = post.category_id
        ? await getRelatedPosts(post.category_id, post.id, 3)
        : { success: false, data: [] }
    const relatedPosts = relatedResult.success ? relatedResult.data || [] : []

    const coverImage = post.featured_image || 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=2000'
    const publishDate = new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Hero Section */}
            <div className="relative h-[70vh] min-h-[500px]">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${coverImage})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />

                {/* Breadcrumb */}
                <div className="absolute top-24 left-0 right-0 z-10">
                    <div className="container mx-auto px-4">
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 text-white/90 hover:text-white transition-colors group"
                        >
                            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="font-medium">Back to Blog</span>
                        </Link>
                    </div>
                </div>

                {/* Hero Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                    <div className="container mx-auto max-w-4xl">
                        {/* Category Badge */}
                        {post.category && (
                            <Link
                                href={`/blog?category=${post.category.slug}`}
                                className="inline-block bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-full text-sm font-bold text-white mb-6 transition-colors"
                            >
                                {post.category.name}
                            </Link>
                        )}

                        {/* Title */}
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            {post.title}
                        </h1>

                        {/* Meta Information */}
                        <div className="flex flex-wrap items-center gap-6 text-white/90 text-sm md:text-base">
                            <div className="flex items-center gap-2">
                                <Calendar size={18} />
                                <span>{publishDate}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Eye size={18} />
                                <span>{post.views_count || 0} views</span>
                            </div>
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex items-center gap-2">
                                    <Tag size={18} />
                                    <span>{post.tags.slice(0, 2).join(', ')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-12 md:py-20">
                <div className="max-w-4xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                        {/* Article Content */}
                        <article className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-8 md:p-12">
                            {/* Excerpt */}
                            {post.excerpt && (
                                <div className="text-xl text-gray-600 italic mb-8 pb-8 border-b border-gray-200">
                                    {post.excerpt}
                                </div>
                            )}

                            {/* Main Content */}
                            <div
                                className="prose prose-lg max-w-none
                                    prose-headings:font-bold prose-headings:text-gray-900
                                    prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
                                    prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                                    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:mb-6
                                    prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:text-emerald-700
                                    prose-img:rounded-xl prose-img:shadow-md
                                    prose-ul:my-6 prose-li:text-gray-600
                                    prose-strong:text-gray-900
                                    prose-blockquote:border-l-4 prose-blockquote:border-emerald-600 
                                    prose-blockquote:bg-emerald-50 prose-blockquote:py-4 prose-blockquote:px-6 
                                    prose-blockquote:rounded-r-lg prose-blockquote:not-italic"
                            >
                                <div dangerouslySetInnerHTML={{ __html: post.content }} />
                            </div>

                            {/* Tags */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <h3 className="text-sm font-bold text-gray-500 uppercase mb-4">Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {post.tags.map((tag, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-gray-100 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-full text-sm transition-colors cursor-pointer"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </article>

                        {/* Sidebar */}
                        <aside className="lg:col-span-1">
                            <div className="sticky top-24 space-y-8">

                                {/* Related Posts */}
                                {relatedPosts.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm p-6">
                                        <h3 className="text-lg font-bold text-gray-900 mb-6">Related Articles</h3>
                                        <div className="space-y-6">
                                            {relatedPosts.map((relatedPost) => (
                                                <Link
                                                    key={relatedPost.id}
                                                    href={`/blog/${relatedPost.slug}`}
                                                    className="block group"
                                                >
                                                    <div className="aspect-video rounded-lg overflow-hidden mb-3 bg-gray-100">
                                                        <div
                                                            className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                            style={{
                                                                backgroundImage: `url(${relatedPost.featured_image || 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=800'})`
                                                            }}
                                                        />
                                                    </div>
                                                    <h4 className="font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 mb-2">
                                                        {relatedPost.title}
                                                    </h4>
                                                    <p className="text-sm text-gray-500">
                                                        {new Date(relatedPost.created_at || '').toLocaleDateString()}
                                                    </p>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Newsletter CTA */}
                                <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl shadow-lg p-6 text-white">
                                    <h3 className="text-lg font-bold mb-3">Stay Updated</h3>
                                    <p className="text-emerald-50 text-sm mb-4">
                                        Get the latest travel tips and destination guides delivered to your inbox.
                                    </p>
                                    <Link
                                        href="/blog"
                                        className="block w-full bg-white text-emerald-600 hover:bg-emerald-50 text-center font-bold py-3 rounded-lg transition-colors"
                                    >
                                        View All Articles
                                    </Link>
                                </div>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </div>
    )
}
