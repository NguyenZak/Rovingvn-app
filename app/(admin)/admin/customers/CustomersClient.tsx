'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Search, User, Tag, Mail, Phone } from 'lucide-react'
import { deleteCustomer } from './actions'
import { useState, useMemo } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Customer {
    id: string
    fullname: string
    email: string
    phone: string | null
    nationality: string | null
    tags: string | null
    booking_count: number
    created_at: string
}

export default function CustomersClient({ customers }: { customers: Customer[] }) {
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [tagFilter, setTagFilter] = useState<string>('all')

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)

        const result = await deleteCustomer(confirmDelete.id)

        setDeleting(false)
        setConfirmDelete(null)

        if (result?.error) {
            alert(result.error)
        } else {
            window.location.reload()
        }
    }

    // Get unique tags
    const allTags = useMemo(() => {
        const tags = new Set<string>()
        customers.forEach(customer => {
            if (customer.tags) {
                customer.tags.split(',').forEach(tag => tags.add(tag.trim()))
            }
        })
        return Array.from(tags)
    }, [customers])

    // Filter customers
    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesSearch =
                customer.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone?.toLowerCase().includes(searchQuery.toLowerCase())

            const matchesTag = tagFilter === 'all' || customer.tags?.includes(tagFilter)

            return matchesSearch && matchesTag
        })
    }, [customers, searchQuery, tagFilter])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Customers (CRM)</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your customer database</p>
                </div>
                <Link
                    href="/admin/customers/new"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Customer
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Customers</p>
                            <p className="text-xl font-bold text-gray-900">{customers.length}</p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
                            <Tag size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">VIP Customers</p>
                            <p className="text-xl font-bold text-gray-900">
                                {customers.filter(c => c.tags?.includes('VIP')).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Repeat Customers</p>
                            <p className="text-xl font-bold text-gray-900">
                                {customers.filter(c => c.booking_count > 1).length}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                            <User size={20} />
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">New This Month</p>
                            <p className="text-xl font-bold text-gray-900">
                                {customers.filter(c => {
                                    const createdDate = new Date(c.created_at)
                                    const now = new Date()
                                    return createdDate.getMonth() === now.getMonth() &&
                                        createdDate.getFullYear() === now.getFullYear()
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <select
                    value={tagFilter}
                    onChange={(e) => setTagFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="all">All Tags</option>
                    {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                    ))}
                </select>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Customer</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Contact</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Nationality</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tags</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Bookings</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-blue-500 flex items-center justify-center text-white font-semibold">
                                            {customer.fullname.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{customer.fullname}</p>
                                            <p className="text-xs text-gray-500">
                                                Since {new Date(customer.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Mail size={14} />
                                            {customer.email}
                                        </div>
                                        {customer.phone && (
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <Phone size={14} />
                                                {customer.phone}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{customer.nationality || '-'}</td>
                                <td className="px-6 py-4">
                                    {customer.tags ? (
                                        <div className="flex flex-wrap gap-1">
                                            {customer.tags.split(',').map((tag, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                                >
                                                    {tag.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        {customer.booking_count} {customer.booking_count === 1 ? 'booking' : 'bookings'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link
                                            href={`/admin/customers/${customer.id}`}
                                            className="text-gray-400 hover:text-blue-600 transition-colors"
                                            title="View Details"
                                        >
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setConfirmDelete({ id: customer.id, name: customer.fullname })}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredCustomers.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery || tagFilter !== 'all'
                                        ? 'No customers match your search criteria.'
                                        : 'No customers yet. Add your first customer to get started.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            {(searchQuery || tagFilter !== 'all') && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredCustomers.length} of {customers.length} customers
                </div>
            )}

            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Delete Customer"
                message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </div>
    )
}
