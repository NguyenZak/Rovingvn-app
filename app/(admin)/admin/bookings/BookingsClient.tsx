/**
 * Bookings Client Component
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    Search, Calendar, User, Plus, Pencil, Trash2
} from "lucide-react";
import type { Booking } from "@/lib/actions/booking-actions";
import { deleteBooking } from "@/lib/actions/booking-actions";
import Link from "next/link";
import { toast } from "sonner";

interface BookingsClientProps {
    initialBookings: Booking[];
    // initialPagination: any;
    initialSearch: string;
    initialStatus: string;
    initialPayment: string;
    initialDateFrom: string;
    initialDateTo: string;
}

export function BookingsClient({
    initialBookings,
    // initialPagination,
    initialSearch,
    initialStatus,
    initialPayment,
    initialDateFrom,
    initialDateTo
}: BookingsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Use props directly instead of state to ensure updates from server are reflected
    const bookings = initialBookings;

    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [paymentFilter, setPaymentFilter] = useState(initialPayment);
    const [dateFrom, setDateFrom] = useState(initialDateFrom);
    const [dateTo, setDateTo] = useState(initialDateTo);

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    // Debounce search update
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (searchQuery !== initialSearch) {
                updateParams('search', searchQuery);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchQuery]);



    const handleClearFilters = () => {
        setSearchQuery('');
        setStatusFilter('');
        setPaymentFilter('');
        setDateFrom('');
        setDateTo('');
        router.push('/admin/bookings');
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this booking? This action cannot be undone.")) return;

        startTransition(async () => {
            const result = await deleteBooking(id);
            if (result.success) {
                toast.success("Booking deleted successfully");
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete booking");
            }
        });
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'confirmed': return <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Confirmed</span>;
            case 'pending': return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">Pending</span>;
            case 'cancelled': return <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">Cancelled</span>;
            case 'completed': return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-semibold">Completed</span>;
            default: return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">{status}</span>;
        }
    };

    const getPaymentBadge = (status: string) => {
        switch (status) {
            case 'paid': return <span className="px-2 py-0.5 rounded text-green-600 border border-green-200 text-xs">Paid</span>;
            case 'pending': return <span className="px-2 py-0.5 rounded text-yellow-600 border border-yellow-200 text-xs">Unpaid</span>;
            case 'partial': return <span className="px-2 py-0.5 rounded text-blue-600 border border-blue-200 text-xs">Partial</span>;
            case 'refunded': return <span className="px-2 py-0.5 rounded text-purple-600 border border-purple-200 text-xs">Refunded</span>;
            default: return <span className="px-2 py-0.5 rounded text-gray-600 border border-gray-200 text-xs">{status}</span>;
        }
    };

    return (
        <div className="w-full mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-gray-600 mt-1">Manage tour reservations</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                    >
                        Clear Filters
                    </button>
                    <Link
                        href="/admin/bookings/new"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colours"
                    >
                        <Plus size={20} />
                        New Booking
                    </Link>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="relative md:col-span-2 lg:col-span-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                        />
                    </div>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); updateParams('status', e.target.value); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    >
                        <option value="">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                    </select>

                    <select
                        value={paymentFilter}
                        onChange={(e) => { setPaymentFilter(e.target.value); updateParams('payment', e.target.value); }}
                        className="px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                    >
                        <option value="">All Payment</option>
                        <option value="pending">Unpaid</option>
                        <option value="paid">Paid</option>
                        <option value="partial">Partial</option>
                        <option value="refunded">Refunded</option>
                    </select>

                    {/* Date From */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">From</span>
                        <input
                            type="date"
                            value={dateFrom}
                            onChange={(e) => { setDateFrom(e.target.value); updateParams('dateFrom', e.target.value); }}
                            className="w-full pl-12 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm text-gray-600"
                        />
                    </div>

                    {/* Date To */}
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">To</span>
                        <input
                            type="date"
                            value={dateTo}
                            onChange={(e) => { setDateTo(e.target.value); updateParams('dateTo', e.target.value); }}
                            className="w-full pl-8 pr-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm text-gray-600"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Code / Tour</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Customer</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Date / Guests</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">Total / Status</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings.map((booking) => (
                                <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-sm font-medium text-emerald-600">{booking.booking_code}</div>
                                        <div className="text-sm font-medium text-gray-900 mt-1">{booking.tour?.title || 'Unknown Tour'}</div>
                                        <div className="text-xs text-gray-500">Created: {new Date(booking.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <User size={16} className="text-gray-400" />
                                            <span className="text-sm font-medium text-gray-900">{booking.customer_info?.name}</span>
                                        </div>
                                        <div className="text-xs text-gray-500 ml-6">{booking.customer_info?.email}</div>
                                        <div className="text-xs text-gray-500 ml-6">{booking.customer_info?.phone}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-sm text-gray-900">
                                            <Calendar size={16} className="text-gray-400" />
                                            {new Date(booking.travel_date).toLocaleDateString()}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {booking.adults} Adults, {booking.children} Child
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 space-y-2">
                                        <div className="text-sm font-bold text-gray-900">
                                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: booking.currency || 'VND' }).format(booking.total_price)}
                                        </div>
                                        <div className="flex gap-2">
                                            {getStatusBadge(booking.status)}
                                            {getPaymentBadge(booking.payment_status)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/bookings/${booking.id}/edit`}
                                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                                                title="Edit"
                                            >
                                                <Pencil size={18} />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                disabled={isPending}
                                                className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                title="Delete"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {bookings.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No bookings found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
