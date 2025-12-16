
import { createClient } from '@/lib/supabase/server'
import { updateBookingStatus } from './actions'
import { Check, X, Clock, Mail, Phone, User } from 'lucide-react'

export const revalidate = 0

export default async function AdminBookingsPage() {
    const supabase = await createClient()
    const { data: bookings } = await supabase
        .from('bookings')
        .select('*, tours(title)')
        .order('created_at', { ascending: false })

    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Booking Inquiries</h1>

            <div className="space-y-4">
                {bookings?.map((booking) => (
                    <div key={booking.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-3">
                                <h3 className="font-bold text-gray-900">{booking.tours?.title || 'Unknown Tour'}</h3>
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                   ${booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'}`}>
                                    {booking.status}
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><User size={14} /> {booking.customer_name} ({booking.people_count} pax)</span>
                                <span className="flex items-center gap-1"><Mail size={14} /> {booking.customer_email}</span>
                                {booking.customer_phone && <span className="flex items-center gap-1"><Phone size={14} /> {booking.customer_phone}</span>}
                                {booking.start_date && <span className="flex items-center gap-1"><Clock size={14} /> {new Date(booking.start_date).toLocaleDateString()}</span>}
                            </div>

                            {booking.message && (
                                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600 mt-2">
                                    "{booking.message}"
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-center">
                            <form action={updateBookingStatus.bind(null, booking.id, 'confirmed')}>
                                <button disabled={booking.status === 'confirmed'} className="p-2 text-emerald-600 bg-emerald-50 rounded-lg hover:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Confirm">
                                    <Check size={20} />
                                </button>
                            </form>
                            <form action={updateBookingStatus.bind(null, booking.id, 'cancelled')}>
                                <button disabled={booking.status === 'cancelled'} className="p-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed" title="Cancel">
                                    <X size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {(!bookings || bookings.length === 0) && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed text-gray-500">
                        No booking inquiries yet.
                    </div>
                )}
            </div>
        </div>
    )
}
