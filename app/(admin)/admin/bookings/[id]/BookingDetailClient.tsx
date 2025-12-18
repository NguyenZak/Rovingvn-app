/**
 * Booking Detail Client Component
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
    ArrowLeft, Calendar, User,
    CheckCircle, XCircle, FileText,
    Mail, Phone, Globe, Save
} from "lucide-react";
import type { Booking } from "@/lib/actions/booking-actions";
import { updateBookingStatus, addBookingNote } from "@/lib/actions/booking-actions";
import Link from "next/link";
import Image from "next/image";

interface BookingDetailClientProps {
    booking: Booking;
}

export function BookingDetailClient({ booking: initialBooking }: BookingDetailClientProps) {
    const router = useRouter();
    const [booking, setBooking] = useState(initialBooking);
    const [isPending, startTransition] = useTransition();
    const [note, setNote] = useState("");
    const [isSavingNote, setIsSavingNote] = useState(false);

    // Parse customer info safely
    const customerInfo = booking.customer_info || {};

    const handleStatusChange = (newStatus: Booking['status']) => {
        startTransition(async () => {
            const result = await updateBookingStatus(booking.id, newStatus);
            if (result.success && result.data) {
                setBooking({ ...booking, status: newStatus });
                router.refresh();
            }
        });
    };

    const handlePaymentStatusChange = (newStatus: Booking['payment_status']) => {
        startTransition(async () => {
            const result = await updateBookingStatus(booking.id, booking.status, newStatus);
            if (result.success && result.data) {
                setBooking({ ...booking, payment_status: newStatus });
                router.refresh();
            }
        });
    };

    const handleAddNote = async () => {
        if (!note.trim()) return;
        setIsSavingNote(true);
        const result = await addBookingNote(booking.id, note);
        setIsSavingNote(false);

        if (result.success) {
            setBooking({ ...booking, admin_notes: note });
            // clear note or keep it to show what's saved? usually keep it or show generic list. 
            // For this simple version, we simply update the local state to match DB
            router.refresh();
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link
                    href="/admin/bookings"
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors"
                >
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        Booking #{booking.booking_code}
                        <span className={`text-sm px-3 py-1 rounded-full border ${booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            booking.status === 'cancelled' ? 'bg-red-50 text-red-700 border-red-200' :
                                booking.status === 'completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                            }`}>
                            {booking.status.toUpperCase()}
                        </span>
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Created on {new Date(booking.created_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Tour Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-start gap-4">
                            {booking.tour?.featured_image && (
                                <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                        src={booking.tour.featured_image}
                                        alt={booking.tour.title || 'Tour'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            )}
                            <div>
                                <h2 className="text-lg font-semibold text-gray-900">{booking.tour?.title}</h2>
                                <Link
                                    href={`/admin/tours/${booking.tour?.id}/edit`}
                                    className="text-emerald-600 hover:text-emerald-700 text-sm font-medium mt-1 inline-block"
                                >
                                    View Tour Details
                                </Link>
                                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                                    <div className="flex items-center gap-1">
                                        <Calendar size={16} />
                                        Travel Date: <span className="font-medium text-gray-900">{new Date(booking.travel_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <User size={16} />
                                        <span className="font-medium text-gray-900">{booking.adults} Adults, {booking.children} Children</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Price Breakdown (Placeholder logic) */}
                        <div className="p-6 bg-gray-50">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Total Price</span>
                                <span className="text-xl font-bold text-gray-900">
                                    {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: booking.currency }).format(booking.total_price)}
                                </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500">Payment Status</span>
                                <span className={`font-medium ${booking.payment_status === 'paid' ? 'text-green-600' :
                                    booking.payment_status === 'partial' ? 'text-blue-600' : 'text-yellow-600'
                                    }`}>
                                    {booking.payment_status?.toUpperCase()}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <User size={20} /> Customer Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Full Name</label>
                                <p className="text-gray-900 font-medium">{customerInfo.name}</p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Email Address</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Mail size={14} className="text-gray-400" />
                                    {customerInfo.email}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Phone Number</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Phone size={14} className="text-gray-400" />
                                    {customerInfo.phone}
                                </p>
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-semibold">Nationality</label>
                                <p className="text-gray-900 font-medium flex items-center gap-2">
                                    <Globe size={14} className="text-gray-400" />
                                    {customerInfo.nationality || 'N/A'}
                                </p>
                            </div>
                            <div className="md:col-span-2">
                                <label className="text-xs text-gray-500 uppercase font-semibold">Address</label>
                                <p className="text-gray-900">{customerInfo.address || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Special Requests */}
                    {booking.special_requests && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText size={20} /> Special Requests
                            </h2>
                            <div className="bg-yellow-50 border border-yellow-100 p-4 rounded-lg text-yellow-800 text-sm">
                                {booking.special_requests}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                        <h2 className="text-lg font-semibold text-gray-900">Booking Actions</h2>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Booking Status</label>
                            <div className="flex flex-col gap-2">
                                <button
                                    onClick={() => handleStatusChange('confirmed')}
                                    disabled={isPending || booking.status === 'confirmed'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${booking.status === 'confirmed'
                                        ? 'bg-green-50 text-green-700 border-green-200 cursor-default'
                                        : 'border-green-200 text-green-700 hover:bg-green-50'
                                        }`}
                                >
                                    <CheckCircle size={16} /> Mark as Confirmed
                                </button>
                                <button
                                    onClick={() => handleStatusChange('completed')}
                                    disabled={isPending || booking.status === 'completed'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${booking.status === 'completed'
                                        ? 'bg-blue-50 text-blue-700 border-blue-200 cursor-default'
                                        : 'border-blue-200 text-blue-700 hover:bg-blue-50'
                                        }`}
                                >
                                    <CheckCircle size={16} /> Mark as Completed
                                </button>
                                <button
                                    onClick={() => handleStatusChange('cancelled')}
                                    disabled={isPending || booking.status === 'cancelled'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium border flex items-center justify-center gap-2 transition-colors ${booking.status === 'cancelled'
                                        ? 'bg-red-50 text-red-700 border-red-200 cursor-default'
                                        : 'border-red-200 text-red-700 hover:bg-red-50'
                                        }`}
                                >
                                    <XCircle size={16} /> Cancel Booking
                                </button>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Status</label>
                            <select
                                value={booking.payment_status}
                                onChange={(e) => handlePaymentStatusChange(e.target.value as Booking['payment_status'])}
                                disabled={isPending}
                                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="pending">Pending (Unpaid)</option>
                                <option value="partial">Partially Paid</option>
                                <option value="paid">Fully Paid</option>
                                <option value="refunded">Refunded</option>
                            </select>
                        </div>
                    </div>

                    {/* Admin Notes */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-gray-900">Admin Notes</h2>
                        <textarea
                            rows={4}
                            value={booking.admin_notes || note}
                            onChange={(e) => {
                                setNote(e.target.value);
                                setBooking({ ...booking, admin_notes: e.target.value });
                            }}
                            className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-sm"
                            placeholder="Internal notes about this booking..."
                        />
                        <button
                            onClick={handleAddNote}
                            disabled={isSavingNote || isPending}
                            className="w-full px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium flex items-center justify-center gap-2"
                        >
                            <Save size={16} /> Save Notes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
