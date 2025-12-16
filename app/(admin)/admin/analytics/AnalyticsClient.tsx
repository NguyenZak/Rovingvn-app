'use client'

import { useMemo, useState } from 'react'
import { TrendingUp, DollarSign, Users, Calendar, MapPin, Star } from 'lucide-react'
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'

interface Booking {
    id: string
    created_at: string
    tour_date: string
    total_price: number
    booking_status: string
    adults_count: number
    children_count: number
    tours: {
        id: string
        title: string
    } | null
}

interface Tour {
    id: string
    title: string
}

interface Customer {
    id: string
    nationality: string | null
    created_at: string
}

interface Props {
    bookings: Booking[]
    tours: Tour[]
    customers: Customer[]
}

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899']

export default function AnalyticsClient({ bookings, tours, customers }: Props) {
    const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month')

    // Calculate revenue over time
    const revenueData = useMemo(() => {
        const now = new Date()
        const data: { date: string; revenue: number; bookings: number }[] = []

        if (timeRange === 'month') {
            // Last 30 days
            for (let i = 29; i >= 0; i--) {
                const date = new Date(now)
                date.setDate(date.getDate() - i)
                const dateStr = date.toISOString().split('T')[0]

                const dayBookings = bookings.filter(b => {
                    return b.created_at.startsWith(dateStr) && b.booking_status !== 'cancelled'
                })

                data.push({
                    date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                    revenue: dayBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
                    bookings: dayBookings.length
                })
            }
        } else if (timeRange === 'year') {
            // Last 12 months
            for (let i = 11; i >= 0; i--) {
                const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
                const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

                const monthBookings = bookings.filter(b => {
                    return b.created_at.startsWith(monthStr) && b.booking_status !== 'cancelled'
                })

                data.push({
                    date: date.toLocaleDateString('en-US', { month: 'short' }),
                    revenue: monthBookings.reduce((sum, b) => sum + (b.total_price || 0), 0),
                    bookings: monthBookings.length
                })
            }
        }

        return data
    }, [bookings, timeRange])

    // Popular tours
    const popularTours = useMemo(() => {
        const tourStats: Record<string, { title: string; bookings: number; revenue: number }> = {}

        bookings.forEach(booking => {
            if (booking.tours && booking.booking_status !== 'cancelled') {
                const tourId = booking.tours.id
                if (!tourStats[tourId]) {
                    tourStats[tourId] = {
                        title: booking.tours.title,
                        bookings: 0,
                        revenue: 0
                    }
                }
                tourStats[tourId].bookings++
                tourStats[tourId].revenue += booking.total_price || 0
            }
        })

        return Object.values(tourStats)
            .sort((a, b) => b.bookings - a.bookings)
            .slice(0, 5)
    }, [bookings])

    // Customer demographics
    const demographics = useMemo(() => {
        const countryStats: Record<string, number> = {}

        customers.forEach(customer => {
            const country = customer.nationality || 'Unknown'
            countryStats[country] = (countryStats[country] || 0) + 1
        })

        return Object.entries(countryStats)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value)
            .slice(0, 6)
    }, [customers])

    // Calculate KPIs
    const kpis = useMemo(() => {
        const confirmedBookings = bookings.filter(b => b.booking_status === 'confirmed')
        const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.total_price || 0), 0)
        const avgBookingValue = confirmedBookings.length > 0 ? totalRevenue / confirmedBookings.length : 0

        // Calculate conversion rate (simple: confirmed / total)
        const conversionRate = bookings.length > 0
            ? (confirmedBookings.length / bookings.length) * 100
            : 0

        return {
            totalRevenue,
            totalBookings: bookings.length,
            confirmedBookings: confirmedBookings.length,
            avgBookingValue,
            conversionRate,
            totalCustomers: customers.length
        }
    }, [bookings, customers])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Analytics & Reports</h1>
                    <p className="text-sm text-gray-500 mt-1">Track your business performance</p>
                </div>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="week">Last 7 Days</option>
                    <option value="month">Last 30 Days</option>
                    <option value="year">Last 12 Months</option>
                </select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                            <p className="text-2xl font-bold text-gray-900">${kpis.totalRevenue.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Total Bookings</p>
                            <p className="text-2xl font-bold text-gray-900">{kpis.totalBookings}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Avg Booking Value</p>
                            <p className="text-2xl font-bold text-gray-900">${Math.round(kpis.avgBookingValue)}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                            <p className="text-2xl font-bold text-gray-900">{kpis.conversionRate.toFixed(1)}%</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Revenue Trend */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Revenue Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#10b981"
                                strokeWidth={2}
                                name="Revenue ($)"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Bookings Trend */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Bookings Trend</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                            <YAxis tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="bookings" fill="#3b82f6" name="Bookings" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Popular Tours & Demographics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Popular Tours */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Star className="text-amber-500" size={20} />
                        Most Popular Tours
                    </h2>
                    <div className="space-y-4">
                        {popularTours.map((tour, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 line-clamp-1">{tour.title}</p>
                                    <p className="text-sm text-gray-500">{tour.bookings} bookings</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-emerald-600">${tour.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Customer Demographics */}
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="text-blue-500" size={20} />
                        Customer Demographics
                    </h2>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={demographics}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {demographics.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
