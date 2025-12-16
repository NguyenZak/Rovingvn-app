import { createClient } from '@/lib/supabase/server'
import { upsertCustomer } from '../actions'
import { ChevronLeft, Save, User, Mail, Phone, MapPin, Calendar, FileText, Tag } from 'lucide-react'
import Link from 'next/link'

export default async function CustomerDetailPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()
    const isEdit = params.id !== 'new'

    let customer = null
    let bookings = []

    if (isEdit) {
        const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('id', params.id)
            .single()
        customer = customerData

        // Get customer's booking history
        const { data: bookingsData } = await supabase
            .from('bookings')
            .select(`
                *,
                tours(id, title, image_url)
            `)
            .eq('customer_id', params.id)
            .order('created_at', { ascending: false })
        bookings = bookingsData || []
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <ChevronLeft size={24} className="text-gray-600" />
                </Link>
                <h1 className="text-2xl font-bold text-gray-900">
                    {isEdit ? 'Customer Profile' : 'New Customer'}
                </h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Customer Form */}
                <div className="lg:col-span-2">
                    <form action={upsertCustomer} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                        {isEdit && <input type="hidden" name="id" value={customer.id} />}

                        {/* Personal Information */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-emerald-600" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input
                                        required
                                        name="fullname"
                                        defaultValue={customer?.fullname}
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input
                                        required
                                        name="email"
                                        defaultValue={customer?.email}
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        name="phone"
                                        defaultValue={customer?.phone || ''}
                                        type="tel"
                                        placeholder="+84 90 123 4567"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <input
                                        name="nationality"
                                        defaultValue={customer?.nationality || ''}
                                        type="text"
                                        placeholder="Vietnam"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input
                                        name="date_of_birth"
                                        defaultValue={customer?.date_of_birth || ''}
                                        type="date"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                    <input
                                        name="passport_number"
                                        defaultValue={customer?.passport_number || ''}
                                        type="text"
                                        placeholder="A12345678"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input
                                        name="address"
                                        defaultValue={customer?.address || ''}
                                        type="text"
                                        placeholder="123 Street, City, Country"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Tags & Notes */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag size={20} className="text-blue-600" />
                                Tags & Notes
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                    <input
                                        name="tags"
                                        defaultValue={customer?.tags || ''}
                                        type="text"
                                        placeholder="VIP, Returning, Corporate (comma-separated)"
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea
                                        name="notes"
                                        defaultValue={customer?.notes || ''}
                                        rows={4}
                                        placeholder="Special requirements, preferences, dietary restrictions..."
                                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <Link href="/admin/customers" className="text-gray-600 hover:text-gray-900 font-medium">
                                Cancel
                            </Link>
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                <Save size={18} />
                                <span>{isEdit ? 'Update' : 'Create'} Customer</span>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Sidebar - Booking History */}
                <div className="space-y-6">
                    {isEdit && (
                        <>
                            {/* Quick Stats */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Total Bookings</span>
                                        <span className="text-lg font-bold text-emerald-600">{bookings.length}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Member Since</span>
                                        <span className="text-sm font-medium text-gray-900">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Booking History */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking History</h3>
                                <div className="space-y-3 max-h-96 overflow-y-auto">
                                    {bookings.length > 0 ? (
                                        bookings.map((booking) => (
                                            <Link
                                                key={booking.id}
                                                href={`/admin/bookings/${booking.id}`}
                                                className="block p-3 rounded-lg border border-gray-100 hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                                            >
                                                <div className="flex items-start gap-3">
                                                    <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                                                        {(booking as any).tours?.image_url ? (
                                                            <img
                                                                src={(booking as any).tours.image_url}
                                                                className="w-full h-full object-cover"
                                                                alt=""
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <FileText size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900 line-clamp-1">
                                                            {(booking as any).tours?.title || 'Tour'}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(booking.tour_date).toLocaleDateString()}
                                                        </p>
                                                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${booking.booking_status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                                booking.booking_status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                    'bg-amber-100 text-amber-800'
                                                            }`}>
                                                            {booking.booking_status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500 text-center py-4">No bookings yet</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
