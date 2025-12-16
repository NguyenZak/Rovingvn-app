'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, DollarSign } from 'lucide-react'
import Link from 'next/link'

interface Booking {
    id: string
    booking_reference: string
    tour_date: string
    adults_count: number
    children_count: number
    total_price: number
    booking_status: string
    tours: {
        id: string
        title: string
        image_url: string | null
    } | null
    customers: {
        id: string
        fullname: string
        email: string
    } | null
}

export default function BookingCalendarClient({ bookings }: { bookings: Booking[] }) {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [viewMode, setViewMode] = useState<'month' | 'week'>('month')

    // Calendar navigation
    const navigateMonth = (direction: number) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1))
    }

    const navigateWeek = (direction: number) => {
        const newDate = new Date(currentDate)
        newDate.setDate(newDate.getDate() + (direction * 7))
        setCurrentDate(newDate)
    }

    // Get calendar days for month view
    const getMonthDays = () => {
        const year = currentDate.getFullYear()
        const month = currentDate.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const startDate = new Date(firstDay)
        startDate.setDate(startDate.getDate() - firstDay.getDay()) // Start from Sunday

        const days = []
        const endDate = new Date(lastDay)
        endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())) // End on Saturday

        let current = new Date(startDate)
        while (current <= endDate) {
            days.push(new Date(current))
            current.setDate(current.getDate() + 1)
        }

        return days
    }

    // Get bookings for a specific date
    const getBookingsForDate = (date: Date) => {
        const dateStr = date.toISOString().split('T')[0]
        return bookings.filter(booking =>
            booking.tour_date.startsWith(dateStr)
        )
    }

    // Calculate stats
    const stats = useMemo(() => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)

        const monthBookings = bookings.filter(b => {
            const tourDate = new Date(b.tour_date)
            return tourDate >= monthStart && tourDate <= monthEnd
        })

        const revenue = monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const confirmed = monthBookings.filter(b => b.booking_status === 'confirmed').length

        return {
            total: monthBookings.length,
            confirmed,
            revenue
        }
    }, [bookings, currentDate])

    const monthDays = getMonthDays()
    const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Booking Calendar</h1>
                    <p className="text-sm text-gray-500 mt-1">View all bookings in calendar format</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setViewMode('month')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'month'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Month
                    </button>
                    <button
                        onClick={() => setViewMode('week')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${viewMode === 'week'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                            }`}
                    >
                        Week
                    </button>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <CalendarIcon size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">This Month</p>
                            <p className="text-xl font-bold text-gray-900">{stats.total} bookings</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Confirmed</p>
                            <p className="text-xl font-bold text-gray-900">{stats.confirmed} bookings</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                            <DollarSign size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="text-xl font-bold text-gray-900">${stats.revenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Calendar Navigation */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <button
                        onClick={() => viewMode === 'month' ? navigateMonth(-1) : navigateWeek(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold text-gray-900">{monthName}</h2>
                    <button
                        onClick={() => viewMode === 'month' ? navigateMonth(1) : navigateWeek(1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Calendar Grid */}
                <div className="p-4">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {monthDays.map((day, idx) => {
                            const dayBookings = getBookingsForDate(day)
                            const isCurrentMonth = day.getMonth() === currentDate.getMonth()
                            const isToday = day.toDateString() === new Date().toDateString()

                            return (
                                <div
                                    key={idx}
                                    className={`min-h-24 border rounded-lg p-2 ${isCurrentMonth ? 'bg-white border-gray-200' : 'bg-gray-50 border-gray-100'
                                        } ${isToday ? 'ring-2 ring-emerald-500' : ''}`}
                                >
                                    <div className={`text-sm font-medium mb-1 ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                                        }`}>
                                        {day.getDate()}
                                    </div>
                                    <div className="space-y-1">
                                        {dayBookings.slice(0, 2).map(booking => (
                                            <Link
                                                key={booking.id}
                                                href={`/admin/bookings/${booking.id}`}
                                                className={`block text-xs p-1 rounded truncate ${booking.booking_status === 'confirmed'
                                                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                                        : booking.booking_status === 'cancelled'
                                                            ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                                            : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                                                    }`}
                                                title={booking.tours?.title || 'Booking'}
                                            >
                                                {booking.tours?.title || 'Booking'}
                                            </Link>
                                        ))}
                                        {dayBookings.length > 2 && (
                                            <div className="text-xs text-gray-500 font-medium">
                                                +{dayBookings.length - 2} more
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Legend */}
            <div className="mt-4 flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-emerald-100"></div>
                    <span className="text-gray-600">Confirmed</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-amber-100"></div>
                    <span className="text-gray-600">Pending</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-red-100"></div>
                    <span className="text-gray-600">Cancelled</span>
                </div>
            </div>
        </div>
    )
}
