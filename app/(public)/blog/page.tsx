'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export default function BlogPage() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [posts, setPosts] = useState<any[]>([])

    useEffect(() => {
        async function fetchPosts() {
            const supabase = createClient()
            const { data } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('status', 'published')
                .order('created_at', { ascending: false })
            setPosts(data || [])
        }
        fetchPosts()
    }, [])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-in fade-in duration-700">
                            Travel Guide
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed">
                            Tips, stories, and inspiration for your next journey to Vietnam
                        </p>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
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
