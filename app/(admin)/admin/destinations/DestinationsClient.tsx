'use client'

import Link from 'next/link'
import { Plus, Edit, MapPin, Trash2, Globe, Lock } from 'lucide-react'
import { deleteDestination, toggleDestinationStatus } from '@/app/(admin)/admin/actions'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface Destination {
    id: string
    name: string
    region: string | null
    image_url: string | null
    tours_count: number
    status: string
}

export default function DestinationsClient({ destinations }: { destinations: Destination[] }) {
    const router = useRouter()
    const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [toggling, setToggling] = useState<string | null>(null)

    const handleToggleStatus = async (id: string, currentStatus: string) => {
        setToggling(id)
        const result = await toggleDestinationStatus(id, currentStatus)
        setToggling(null)

        if (result?.error) {
            alert(result.error)
        } else {
            router.refresh()
        }
    }

    const handleDelete = async () => {
        if (!confirmDelete) return
        setDeleting(true)

        const result = await deleteDestination(confirmDelete.id)

        setDeleting(false)
        setConfirmDelete(null)

        if (result?.error) {
            alert(result.error)
        } else {
            window.location.reload()
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Destinations</h1>
                <Link href="/admin/destinations/new" className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                    <Plus size={20} /> Add Destination
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Name</th>
                            <th className="p-4 font-semibold text-gray-600">Region</th>
                            <th className="p-4 font-semibold text-gray-600">Status</th>
                            <th className="p-4 font-semibold text-gray-600">Tours</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {destinations.map((dest) => (
                            <tr key={dest.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        {dest.image_url ? (
                                            <img src={dest.image_url} alt={dest.name} className="w-10 h-10 rounded-lg object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                                                <MapPin size={20} />
                                            </div>
                                        )}
                                        <span className="font-medium text-gray-900">{dest.name}</span>
                                    </div>
                                </td>
                                <td className="p-4 text-gray-600">{dest.region || '-'}</td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleToggleStatus(dest.id, dest.status || 'draft')}
                                        disabled={toggling === dest.id}
                                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${dest.status === 'published'
                                            ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                            } ${toggling === dest.id ? 'opacity-50 cursor-wait' : ''}`}
                                    >
                                        {dest.status === 'published' ? <Globe size={12} /> : <Lock size={12} />}
                                        <span className="capitalize">{dest.status || 'draft'}</span>
                                    </button>
                                </td>
                                <td className="p-4 text-gray-600">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {dest.tours_count} {dest.tours_count === 1 ? 'tour' : 'tours'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <Link href={`/admin/destinations/${dest.id}`} className="text-gray-400 hover:text-blue-600 transition-colors" title="Edit">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => setConfirmDelete({ id: dest.id, name: dest.name })}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {destinations.length === 0 && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No destinations found. Create one to get started.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                isOpen={!!confirmDelete}
                title="Delete Destination"
                message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
                confirmText={deleting ? 'Deleting...' : 'Delete'}
                onConfirm={handleDelete}
                onCancel={() => setConfirmDelete(null)}
            />
        </div>
    )
}
