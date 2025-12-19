import { getAllGeneralInquiries } from '@/lib/actions/general-inquiry-actions'
import Link from 'next/link'
import { Mail, Phone, User, Eye, Calendar } from 'lucide-react'

export const metadata = {
    title: 'General Inquiries | Roving Admin',
    description: 'Manage contact form inquiries from the homepage'
}

export const dynamic = 'force-dynamic'

export default async function GeneralInquiriesPage() {
    const result = await getAllGeneralInquiries()
    const inquiries = result.data || []

    const getStatusBadge = (status: string) => {
        const styles = {
            new: 'bg-blue-100 text-blue-800 border-blue-200',
            contacted: 'bg-purple-100 text-purple-800 border-purple-200',
            converted: 'bg-green-100 text-green-800 border-green-200',
            archived: 'bg-gray-100 text-gray-800 border-gray-200'
        }
        return styles[status as keyof typeof styles] || styles.new
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">General Inquiries</h1>
                    <p className="text-gray-600 mt-1">Contact form submissions from homepage</p>
                </div>
                <div className="text-sm text-gray-500">
                    Total: <span className="font-semibold text-gray-900">{inquiries.length}</span> inquiries
                </div>
            </div>

            {inquiries.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <Mail className="mx-auto text-gray-300 mb-4" size={48} />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
                    <p className="text-gray-500">Contact form submissions will appear here</p>
                </div>
            ) : (
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">People</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {inquiries.map((inquiry: any) => (
                                <tr key={inquiry.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                                <User size={18} className="text-emerald-600" />
                                            </div>
                                            <div className="min-w-0">
                                                <div className="font-medium text-gray-900">{inquiry.name}</div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                                    <Mail size={12} />
                                                    {inquiry.email}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-1">
                                                    <Phone size={12} />
                                                    {inquiry.phone}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">
                                            {inquiry.subject || <span className="text-gray-400 italic">No subject</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 line-clamp-2">
                                            {inquiry.message || <span className="text-gray-400 italic">No message</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{inquiry.number_of_people}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(inquiry.status)}`}>
                                            {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                            <Calendar size={12} />
                                            {new Date(inquiry.created_at).toLocaleDateString()}
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
