'use client'

import { upsertCustomer } from '../actions'
import { ChevronLeft, Save, User, Tag } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export default function CustomerFormClient({ customer, isEdit, bookings }: { customer: any, isEdit: boolean, bookings: any[] }) {
    const router = useRouter()

    const handleSubmit = async (formData: FormData) => {
        const result = await upsertCustomer(formData)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success('Customer saved successfully!')
            router.push('/admin/customers')
        }
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
                <div className="lg:col-span-2">
                    <form action={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
                        {isEdit && <input type="hidden" name="id" value={customer.id} />}

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User size={20} className="text-emerald-600" />
                                Personal Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                                    <input required name="fullname" defaultValue={customer?.fullname} type="text" placeholder="John Doe" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input required name="email" defaultValue={customer?.email} type="email" placeholder="john@example.com" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input name="phone" defaultValue={customer?.phone || ''} type="tel" placeholder="+84 90 123 4567" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                                    <input name="nationality" defaultValue={customer?.nationality || ''} type="text" placeholder="Vietnam" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                                    <input name="date_of_birth" defaultValue={customer?.date_of_birth || ''} type="date" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
                                    <input name="passport_number" defaultValue={customer?.passport_number || ''} type="text" placeholder="A12345678" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                    <input name="address" defaultValue={customer?.address || ''} type="text" placeholder="123 Street, City, Country" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Tag size={20} className="text-blue-600" />
                                Tags & Notes
                            </h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                                    <input name="tags" defaultValue={customer?.tags || ''} type="text" placeholder="VIP, Returning, Corporate (comma-separated)" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                    <p className="text-xs text-gray-500 mt-1">Separate tags with commas</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                                    <textarea name="notes" defaultValue={customer?.notes || ''} rows={4} placeholder="Special requirements, preferences, dietary restrictions..." className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                            <Link href="/admin/customers" className="text-gray-600 hover:text-gray-900 font-medium">Cancel</Link>
                            <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-semibold flex items-center gap-2 transition-colors">
                                <Save size={18} />
                                <span>{isEdit ? 'Update' : 'Create'} Customer</span>
                            </button>
                        </div>
                    </form>
                </div>

                {isEdit && (
                    <div className="space-y-6">
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
                    </div>
                )}
            </div>
        </div>
    )
}
