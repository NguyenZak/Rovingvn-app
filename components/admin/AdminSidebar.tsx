'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
    LayoutDashboard, Map, Calendar, FileText, Settings, LogOut,
    Users, MapPin, BarChart3, CalendarDays, Image, Compass, MessageSquare, Globe,
    ChevronLeft, ChevronRight, TrendingUp, MessageSquareQuote
} from 'lucide-react'
import { signout } from '@/app/login/actions'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
    { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/tours', label: 'Tours', icon: Map },
    { href: '/admin/destinations', label: 'Destinations', icon: MapPin },
    { href: '/admin/regions', label: 'Regions', icon: Globe },
    { href: '/admin/sliders', label: 'Sliders', icon: Image },
    { href: '/admin/media', label: 'Media', icon: Image },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/bookings/calendar', label: 'Calendar View', icon: CalendarDays },
    { href: '/admin/custom-trips', label: 'Custom Trips', icon: Compass },
    { href: '/admin/general-inquiries', label: 'General Inquiries', icon: MessageSquare },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/blog', label: 'Blog', icon: FileText },
    { href: '/admin/pages', label: 'Pages', icon: FileText },
    { href: '/admin/highlights', label: 'Highlights', icon: Compass },
    { href: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/admin/settings#stats', label: 'Stats', icon: TrendingUp },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Persist collapsed state
    useEffect(() => {
        setMounted(true)
        const savedState = localStorage.getItem('sidebarCollapsed')
        if (savedState) {
            setCollapsed(JSON.parse(savedState))
        }
    }, [])

    const toggleSidebar = () => {
        const newState = !collapsed
        setCollapsed(newState)
        localStorage.setItem('sidebarCollapsed', JSON.stringify(newState))
    }

    if (!mounted) {
        // Prevent hydration mismatch by rendering a default width or placeholder
        return <aside className="w-64 bg-slate-900 border-r border-gray-800" />
    }

    return (
        <aside
            className={cn(
                "bg-slate-900 text-white flex flex-col transition-all duration-300 border-r border-gray-800 relative",
                collapsed ? "w-20" : "w-64"
            )}
        >
            {/* Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute -right-3 top-8 bg-emerald-500 text-white rounded-full p-1 shadow-md hover:bg-emerald-600 transition-colors z-20 border-2 border-slate-900"
            >
                {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <div className={cn(
                "p-6 border-b border-gray-800 flex items-center h-20",
                collapsed ? "justify-center px-2" : "justify-between"
            )}>
                {collapsed ? (
                    <span className="font-bold text-xl bg-gradient-to-tr from-emerald-400 to-cyan-400 bg-clip-text text-transparent">R</span>
                ) : (
                    <h1 className="text-xl font-bold tracking-tight">Roving Admin</h1>
                )}
            </div>

            <nav className="flex-1 p-3 space-y-1 overflow-y-auto custom-scrollbar">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            title={collapsed ? item.label : undefined}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors group relative",
                                isActive
                                    ? "bg-emerald-600/10 text-emerald-400 font-medium"
                                    : "text-gray-400 hover:bg-gray-800 hover:text-gray-100",
                                collapsed && "justify-center px-2"
                            )}
                        >
                            <item.icon size={20} className={cn(isActive && "text-emerald-400")} />
                            {!collapsed && <span>{item.label}</span>}

                            {/* Tooltip for collapsed mode */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-lg border border-gray-700">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    )
                })}
            </nav>

            <div className="p-4 border-t border-gray-800">
                <form action={signout}>
                    <button
                        type="submit"
                        className={cn(
                            "flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-gray-800 hover:text-red-300 rounded-lg transition-colors w-full",
                            collapsed && "justify-center px-2"
                        )}
                        title={collapsed ? "Sign Out" : undefined}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Sign Out</span>}
                    </button>
                </form>
            </div>
        </aside>
    )
}
