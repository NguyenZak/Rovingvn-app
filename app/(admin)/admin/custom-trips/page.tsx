import { getAllCustomTrips } from '@/lib/actions/custom-trip-actions'
import Link from 'next/link'
import { Calendar, Mail, MapPin, Phone, User, Eye } from 'lucide-react'
import DeleteCustomTripButton from '@/components/features/cms/DeleteCustomTripButton'

export const metadata = {
    title: 'Custom Trip Requests | Roving Admin',
    description: 'Manage custom trip inquiries from customers'
}

export const dynamic = 'force-dynamic';

export default async function CustomTripsPage() {
    const result = await getAllCustomTrips()
    const trips = result.data || []

    const getStatusBadge = (status: string) => {
        const styles = {
            pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
            reviewed: 'bg-blue-100 text-blue-800 border-blue-200',
            contacted: 'bg-purple-100 text-purple-800 border-purple-200',
            converted: 'bg-green-100 text-green-800 border-green-200',
            archived: 'bg-gray-100 text-gray-800 border-gray-200'
        }
        return styles[status as keyof typeof styles] || styles.pending
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Custom Trip Requests</h1>
                    <p className="text-gray-600 mt-1">Manage and respond to custom tour inquiries</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-900">{trips.length}</span> requests
                </div>
            </div>

            {trips.length === 0 ? (
                <div className="bg-white rounded-xl bordered border-gray-200 p-12 text-center">
                    <MapPin className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No custom trip requests yet</h3>
                    <p className="text-gray-500">Customer inquiries will appear here when they submit the custom trip form</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destinations</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {trips.map((trip: any) => (
                                <tr key={trip.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <User size={18} className="text-emerald-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900">{trip.customer_name}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Mail size={12} />
                                                    {trip.customer_email}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Phone size={12} />
                                                    {trip.customer_phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">
                                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                            {trip.destinations?.map((d: any) => d.name).join(', ') || 'N/A'}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {trip.number_of_travelers} traveler(s)
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{trip.duration_days} days</div>
                                        {trip.travel_date && (
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                <Calendar size={12} />
                                                {new Date(trip.travel_date).toLocaleDateString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(trip.status)}`}>
                                            {trip.status.charAt(0).toUpperCase() + trip.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(trip.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/custom-trips/${trip.id}`}
                                                className="p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                                title="View/Edit Details"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <DeleteCustomTripButton id={trip.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}
