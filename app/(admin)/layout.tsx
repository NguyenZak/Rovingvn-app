
import Link from 'next/link'
import {
    LayoutDashboard, Map, Calendar, FileText, Settings, LogOut,
    Users, MapPin, BarChart3, CalendarDays, Image
} from 'lucide-react'
import { signout } from '@/app/login/actions'
import { Toaster } from 'sonner'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const NAV_ITEMS = [
        { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/tours', label: 'Tours', icon: Map },
        { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
        { href: '/admin/sliders', label: 'Sliders', icon: Image },
        { href: '/admin/media', label: 'Media', icon: Image },
        { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
        { href: '/admin/bookings/calendar', label: 'Calendar View', icon: CalendarDays },
        { href: '/admin/customers', label: 'Customers', icon: Users },
        { href: '/admin/blog', label: 'Blog', icon: FileText },
        { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ]

    return (
        <div className="flex h-screen bg-gray-100">
            <Toaster richColors position="top-right" />
            {/* Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex flex-col">
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-xl font-bold tracking-tight">Roving Admin</h1>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {NAV_ITEMS.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white rounded-lg transition-colors"
                        >
                            <item.icon size={20} />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <form action={signout}>
                        <button type="submit" className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors w-full">
                            <LogOut size={20} />
                            <span className="font-medium">Sign Out</span>
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-auto">
                <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-semibold text-gray-700">Dashboard</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold border border-emerald-200">
                            A
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    )
}
