
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const revalidate = 3600

export default async function BlogPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    return (
        <div className="bg-gray-50 min-h-screen py-24">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Travel Guide</h1>
                    <p className="text-lg text-gray-600">
                        Tips, stories, and inspiration for your next journey to Vietnam.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {posts?.map((post) => (
                        <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow flex flex-col h-full">
                            <Link href={`/blog/${post.slug}`} className="aspect-video bg-gray-200 block relative overflow-hidden group">
                                <div
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundImage: `url(${post.cover_image || 'https://images.unsplash.com/photo-1478860409698-8707f313ee8b?q=80&w=2000'})` }}
                                />
                            </Link>
                            <div className="p-8 flex flex-col flex-grow">
                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                                    <Calendar size={14} />
                                    {new Date(post.created_at).toLocaleDateString()}
                                </div>
                                <Link href={`/blog/${post.slug}`} className="block">
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-emerald-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-500 line-clamp-3 mb-6 flex-grow">{post.excerpt}</p>
                                <Link href={`/blog/${post.slug}`} className="text-emerald-600 font-semibold hover:text-emerald-700 inline-block mt-auto">
                                    Read Article →
                                </Link>
                            </div>
                        </article>
                    ))}
                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full text-center py-20 bg-white rounded-xl border border-dashed text-gray-500">
                            New articles coming soon!
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
