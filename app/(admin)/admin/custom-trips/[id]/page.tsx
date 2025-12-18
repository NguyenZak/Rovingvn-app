'use client'

import { useState, useEffect } from 'react'
import { getCustomTripById, updateCustomTrip } from '@/lib/actions/custom-trip-actions'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Calendar, Mail, MapPin, Phone, User, Users, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function CustomTripDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [id, setId] = useState<string | null>(null)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [trip, setTrip] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState('')
    const [adminNotes, setAdminNotes] = useState('')
    const router = useRouter()

    useEffect(() => {
        params.then(resolvedParams => {
            setId(resolvedParams.id)
        })
    }, [params])

    useEffect(() => {
        if (!id) return

        async function fetchTrip() {
            const result = await getCustomTripById(id!)
            if (result.success && result.data) {
                setTrip(result.data)
                setStatus(result.data.status)
                setAdminNotes(result.data.admin_notes || '')
            }
            setLoading(false)
        }
        fetchTrip()
    }, [id])

    const handleSave = async () => {
        if (!id) return
        setSaving(true)
        const result = await updateCustomTrip(id, {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            status: status as any,
            admin_notes: adminNotes
        })
        setSaving(false)
        if (result.success) {
            router.refresh()
        }
    }

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
        )
    }

    if (!trip) {
        return (
            <div className="p-6">
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Trip request not found</h3>
                    <Link href="/admin/custom-trips" className="text-emerald-600 hover:text-emerald-700">
                        ← Back to all requests
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6 max-w-5xl">
            <div className="mb-6">
                <Link
                    href="/admin/custom-trips"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
                >
                    <ArrowLeft size={18} />
                    Back to all requests
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">Custom Trip Request Details</h1>
                <p className="text-gray-500 mt-1">Submitted on {new Date(trip.created_at).toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3">
                                <User size={20} className="text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Name</div>
                                    <div className="font-medium text-gray-900">{trip.customer_name}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Mail size={20} className="text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Email</div>
                                    <a href={`mailto:${trip.customer_email}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                                        {trip.customer_email}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Phone size={20} className="text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Phone</div>
                                    <a href={`tel:${trip.customer_phone}`} className="font-medium text-emerald-600 hover:text-emerald-700">
                                        {trip.customer_phone}
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users size={20} className="text-gray-400 mt-0.5" />
                                <div>
                                    <div className="text-sm text-gray-500">Number of Travelers</div>
                                    <div className="font-medium text-gray-900">{trip.number_of_travelers}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trip Details */}
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Trip Details</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="text-sm text-gray-500 mb-2">Selected Destinations</div>
                                <div className="flex flex-wrap gap-2">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {trip.destinations?.map((dest: any, idx: number) => (
                                        <div key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                                            <MapPin size={14} />
                                            {dest.name}
                                            {dest.region && <span className="text-emerald-600 text-xs">({dest.region})</span>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500 mb-1">Duration</div>
                                    <div className="font-medium text-gray-900">{trip.duration_days} days</div>
                                </div>
                                {trip.travel_date && (
                                    <div>
                                        <div className="text-sm text-gray-500 mb-1 flex items-center gap-1">
                                            <Calendar size={14} />
                                            Approximate Start Date
                                        </div>
                                        <div className="font-medium text-gray-900">
                                            {new Date(trip.travel_date).toLocaleDateString()}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {trip.travel_styles && trip.travel_styles.length > 0 && (
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">Travel Style Preferences</div>
                                    <div className="flex flex-wrap gap-2">
                                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                        {trip.travel_styles.map((style: any, idx: number) => (
                                            <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                                {style.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {trip.additional_notes && (
                                <div>
                                    <div className="text-sm text-gray-500 mb-2">Additional Notes from Customer</div>
                                    <div className="bg-gray-50 rounded-lg p-4 text-gray-700">
                                        {trip.additional_notes}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Status & Notes */}
                <div className="space-y-6">
                    <div className="bg-white rounded-xl border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Status & Management</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="reviewed">Reviewed</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="converted">Converted</option>
                                    <option value="archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
                                <textarea
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    rows={6}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                    placeholder="Add internal notes about this request..."
                                />
                            </div>

                            <button
                                onClick={handleSave}
                                disabled={saving}
                                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {saving ? (
                                    <>
                                        <Loader2 className="animate-spin" size={18} />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save size={18} />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                        <div className="font-medium mb-2">Quick Actions</div>
                        <a href={`mailto:${trip.customer_email}`} className="block text-emerald-600 hover:text-emerald-700 mb-1">
                            Send Email
                        </a>
                        <a href={`tel:${trip.customer_phone}`} className="block text-emerald-600 hover:text-emerald-700">
                            Call Customer
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
