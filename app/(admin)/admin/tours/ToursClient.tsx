'use client'

import Link from 'next/link'
import { Plus, Edit, Trash2, Search } from 'lucide-react'
import { deleteTour, toggleTourStatus } from '@/app/(admin)/admin/actions'
import { useState, useMemo } from 'react'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Tour {
    id: string
    title: string
    price: number
    duration: string | null
    status: string
    destinations: {
        name: string
    } | null
}

export default function ToursClient({ tours }: { tours: Tour[] }) {
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; title: string } | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [statusFilter, setStatusFilter] = useState<string>('all')

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)

        const result = await deleteTour(confirmDelete.id)

        setDeleting(false)
        setConfirmDelete(null)

        if (result?.error) {
            alert(result.error)
        } else {
            window.location.reload()
        }
    }

    // Filter and search tours
    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            // Search filter
            const matchesSearch = tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tour.destinations?.name.toLowerCase().includes(searchQuery.toLowerCase())

            // Status filter
            const matchesStatus = statusFilter === 'all' || tour.status === statusFilter

            return matchesSearch && matchesStatus
        })
    }, [tours, searchQuery, statusFilter])

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Tours</h1>
                <Link
                    href="/admin/tours/new"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add New Tour
                </Link>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search tours by name or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                </div>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-4 font-semibold text-gray-700">Tour Name</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Destination</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Price</th>
                            <th className="px-6 py-4 font-semibold text-gray-700">Status</th>
                            <th className="px-6 py-4 font-semibold text-gray-700 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredTours.map((tour) => (
                            <tr key={tour.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-medium text-gray-900">{tour.title}</td>
                                <td className="px-6 py-4 text-gray-600">{tour.destinations?.name || '-'}</td>
                                <td className="px-6 py-4 text-emerald-600 font-medium">${tour.price}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={async () => {
                                            const result = await toggleTourStatus(tour.id, tour.status)
                                            if (result?.error) {
                                                alert(result.error)
                                            }
                                        }}
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize cursor-pointer hover:opacity-80 transition-opacity ${tour.status === 'published' ? 'bg-green-100 text-green-800' :
                                            tour.status === 'archived' ? 'bg-gray-100 text-gray-800' : 'bg-amber-100 text-amber-800'
                                            }`}
                                        title="Click to toggle status"
                                    >
                                        {tour.status}
                                    </button>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/tours/${tour.id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setConfirmDelete({ id: tour.id, title: tour.title })}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredTours.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    {searchQuery || statusFilter !== 'all'
                                        ? 'No tours match your search criteria.'
                                        : 'No tours found. Create one to get started.'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Results count */}
            {(searchQuery || statusFilter !== 'all') && (
                <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredTours.length} of {tours.length} tours
                </div>
            )}

            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Delete Tour"
                message={`Are you sure you want to delete "${confirmDelete?.title}"? This action cannot be undone.`}
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </div>
    )
}
