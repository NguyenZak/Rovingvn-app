// ============================================
// CMS Dashboard Overview Page
// ============================================

import { createClient } from '@/lib/supabase/server'
import { requireEditor } from '@/lib/supabase/server'
import { VI_LABELS } from '@/lib/constants/vi'
import Link from 'next/link'

export default async function CMSDashboardPage() {
    await requireEditor()
    const supabase = await createClient()

    // Fetch stats
    const [
        { count: totalPosts },
        { count: publishedPosts },
        { count: draftPosts },
        { count: totalPages },
        { count: totalMedia },
        { count: totalCategories },
        { count: totalTags },
        { data: recentLogs }
    ] = await Promise.all([
        supabase.from('posts').select('*', { count: 'exact', head: true }),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
        supabase.from('posts').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
        supabase.from('pages').select('*', { count: 'exact', head: true }),
        supabase.from('media').select('*', { count: 'exact', head: true }),
        supabase.from('categories').select('*', { count: 'exact', head: true }),
        supabase.from('tags').select('*', { count: 'exact', head: true }),
        supabase
            .from('audit_logs')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(10)
    ])

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">{VI_LABELS.nav.dashboard}</h1>
                <p className="text-sm text-gray-600 mt-1">Tổng quan hệ thống CMS</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title={VI_LABELS.stats.totalPosts}
                    value={totalPosts || 0}
                    href="/admin/posts"
                    color="blue"
                />
                <StatCard
                    title={VI_LABELS.stats.publishedPosts}
                    value={publishedPosts || 0}
                    href="/admin/posts"
                    color="green"
                />
                <StatCard
                    title={VI_LABELS.stats.totalPages}
                    value={totalPages || 0}
                    href="/admin/pages"
                    color="purple"
                />
                <StatCard
                    title={VI_LABELS.stats.totalMedia}
                    value={totalMedia || 0}
                    href="/admin/media"
                    color="yellow"
                />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                    title={VI_LABELS.stats.draftPosts}
                    value={draftPosts || 0}
                    href="/admin/posts"
                    color="gray"
                />
                <StatCard
                    title={VI_LABELS.stats.totalCategories}
                    value={totalCategories || 0}
                    href="/admin/posts"
                    color="indigo"
                />
                <StatCard
                    title={VI_LABELS.stats.totalTags}
                    value={totalTags || 0}
                    href="/admin/posts"
                    color="pink"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Thao tác nhanh</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <QuickAction
                        title="Tạo bài viết mới"
                        href="/admin/posts/create"
                        icon="📝"
                    />
                    <QuickAction
                        title="Tạo trang mới"
                        href="/admin/pages/create"
                        icon="📄"
                    />
                    <QuickAction
                        title="Tải media lên"
                        href="/admin/media"
                        icon="🖼️"
                    />
                </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                    {VI_LABELS.stats.recentActivity}
                </h2>
                {recentLogs && recentLogs.length > 0 ? (
                    <div className="space-y-3">
                        {recentLogs.slice(0, 5).map((log) => (
                            <div key={log.id} className="flex items-center justify-between border-b pb-2">
                                <div>
                                    <p className="text-sm text-gray-900">
                                        <span className="font-medium text-gray-700">{log.user_email}</span>
                                        {' '}
                                        {log.action === 'create' && 'đã tạo'}
                                        {log.action === 'update' && 'đã cập nhật'}
                                        {log.action === 'delete' && 'đã xoá'}
                                        {' '}
                                        {log.object_type === 'post' && 'bài viết'}
                                        {log.object_type === 'page' && 'trang'}
                                        {log.object_type === 'media' && 'media'}
                                        {log.object_name && `: ${log.object_name}`}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(log.created_at).toLocaleString('vi-VN')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-sm text-gray-500">{VI_LABELS.audit.noLogs}</p>
                )}
                <Link
                    href="/admin/audit-logs"
                    className="block mt-4 text-sm text-blue-600 hover:text-blue-800"
                >
                    Xem tất cả nhật ký →
                </Link>
            </div>
        </div>
    )
}

// Stat Card Component
function StatCard({
    title,
    value,
    href,
    color = 'blue'
}: {
    title: string
    value: number
    href: string
    color?: string
}) {
    const colorClasses = {
        blue: 'bg-blue-50 text-blue-600',
        green: 'bg-green-50 text-green-600',
        purple: 'bg-purple-50 text-purple-600',
        yellow: 'bg-yellow-50 text-yellow-600',
        gray: 'bg-gray-50 text-gray-600',
        indigo: 'bg-indigo-50 text-indigo-600',
        pink: 'bg-pink-50 text-pink-600'
    }

    return (
        <Link href={href} className="block">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
                <div className="text-sm text-gray-600">{title}</div>
                <div className={`text-3xl font-bold mt-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
                    {value}
                </div>
            </div>
        </Link>
    )
}

// Quick Action Component
function QuickAction({
    title,
    href,
    icon
}: {
    title: string
    href: string
    icon: string
}) {
    return (
        <Link
            href={href}
            className="flex items-center gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
            <span className="text-2xl">{icon}</span>
            <span className="font-medium text-gray-900">{title}</span>
        </Link>
    )
}
