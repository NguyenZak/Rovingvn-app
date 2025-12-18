
import { createClient } from '@/lib/supabase/server'
import { Users, Calendar, Map, BookOpen, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'

export default async function AdminDashboard() {
    const supabase = await createClient()

    // Fetch comprehensive data
    const [
        { count: toursCount },
        { count: bookingsCount },
        { count: postsCount },
        { count: destinationsCount },
        { data: recentBookings },
        { data: recentPosts }
    ] = await Promise.all([
        supabase.from('tours').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*', { count: 'exact', head: true }),
        supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
        supabase.from('destinations').select('*', { count: 'exact', head: true }),
        supabase.from('bookings').select('*, tours(title)').order('created_at', { ascending: false }).limit(5),
        supabase.from('blog_posts').select('*').order('created_at', { ascending: false }).limit(5)
    ])

    const stats = [
        {
            label: 'Total Tours',
            value: toursCount || 0,
            icon: Map,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            trend: '+12%',
            trendUp: true
        },
        {
            label: 'Active Bookings',
            value: bookingsCount || 0,
            icon: Calendar,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            trend: '+23%',
            trendUp: true
        },
        {
            label: 'Blog Posts',
            value: postsCount || 0,
            icon: BookOpen,
            color: 'text-purple-600',
            bg: 'bg-purple-50',
            trend: '+8%',
            trendUp: true
        },
        {
            label: 'Destinations',
            value: destinationsCount || 0,
            icon: Users,
            color: 'text-amber-600',
            bg: 'bg-amber-50',
            trend: '0%',
            trendUp: false
        },
    ]

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                    <p className="text-sm text-gray-500 mt-1">Welcome back! Here&apos;s what&apos;s happening with your business.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center`}>
                                    <stat.icon size={24} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                </div>
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-medium ${stat.trendUp ? 'text-emerald-600' : 'text-gray-400'}`}>
                                {stat.trendUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                {stat.trend}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Bookings */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-bold text-gray-900">Recent Bookings</h2>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {recentBookings && recentBookings.length > 0 ? (
                                recentBookings.map((booking) => (
                                    <div key={booking.id} className="p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="font-medium text-gray-900">{booking.customer_name}</p>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                <p className="text-sm text-gray-600 mt-1">{(booking as any).tours?.title || 'Tour'}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                    'bg-amber-100 text-amber-800'
                                                }`}>
                                                {booking.status}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">
                                            {new Date(booking.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-gray-400">No recent bookings</div>
                            )}
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100">
                            <Link href="/admin/bookings" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                                View all bookings →
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link href="/admin/tours/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <Map size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-emerald-600">New Tour</span>
                            </Link>
                            <Link href="/admin/blog/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <BookOpen size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-purple-600">New Post</span>
                            </Link>
                            <Link href="/admin/destinations/new" className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition-colors group">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Users size={20} />
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-blue-600">New Destination</span>
                            </Link>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Posts</h2>
                        <div className="space-y-3">
                            {recentPosts && recentPosts.length > 0 ? (
                                recentPosts.slice(0, 3).map((post) => (
                                    <Link key={post.id} href={`/admin/blog/${post.id}`} className="block p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{post.title}</p>
                                        <p className="text-xs text-gray-400 mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-sm text-gray-400">No posts yet</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
