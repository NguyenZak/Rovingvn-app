/**
 * Destinations Client Component
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    MapPin, Plus, Search, Eye, Edit, Trash2,
    CheckCircle, XCircle
} from "lucide-react";
import { deleteDestination } from "@/lib/actions/destination-actions";
import type { Destination } from "@/lib/actions/destination-actions";
import Link from "next/link";
import Image from "next/image";

interface DestinationsClientProps {
    initialDestinations: Destination[];
    initialSearch: string;
    initialStatus: string;
    initialRegion: string;
}

export function DestinationsClient({
    initialDestinations,
    initialSearch,
    initialStatus,
    initialRegion
}: DestinationsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [destinations, setDestinations] = useState(initialDestinations);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [regionFilter, setRegionFilter] = useState(initialRegion);
    const [isPending, startTransition] = useTransition();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deleteDestination(id);
            if (result.success) {
                setDestinations(destinations.filter(d => d.id !== id));
                setDeleteId(null);
                showMessage('success', 'Destination deleted successfully');
                router.refresh();
            } else {
                showMessage('error', result.error || 'Failed to delete');
            }
        });
    };

    return (
        <div className="w-full mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Destinations</h1>
                    <p className="text-gray-600 mt-1">Manage travel locations</p>
                </div>

                <Link
                    href="/admin/destinations/new"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Destination
                </Link>
            </div>

            {/* Message */}
            {message && (
                <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search destinations..."
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); updateParams('search', e.target.value); }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    <select
                        value={regionFilter}
                        onChange={(e) => { setRegionFilter(e.target.value); updateParams('region', e.target.value); }}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Regions</option>
                        <option value="North">North</option>
                        <option value="Central">Central</option>
                        <option value="South">South</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => { setStatusFilter(e.target.value); updateParams('status', e.target.value); }}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {destinations.map(dest => (
                    <div key={dest.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all">
                        <div className="relative h-48 bg-gray-200">
                            {dest.image_url ? (
                                <Image src={dest.image_url} alt={dest.name} fill className="object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <MapPin size={48} />
                                </div>
                            )}
                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-semibold shadow-sm">
                                {dest.region}
                            </div>
                        </div>

                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900">{dest.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-2 mt-1">{dest.short_description}</p>

                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/destinations/${dest.slug}`}
                                    target="_blank"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Eye size={16} /> View
                                </Link>
                                <Link
                                    href={`/admin/destinations/${dest.id}/edit`}
                                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 flex items-center justify-center gap-2 text-sm font-medium"
                                >
                                    <Edit size={16} /> Edit
                                </Link>
                                <button
                                    onClick={() => setDeleteId(dest.id)}
                                    className="p-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Delete Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Destination?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this destination? This might affect tours linked to it.
                        </p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setDeleteId(null)}
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                                disabled={isPending}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => handleDelete(deleteId)}
                                className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                                disabled={isPending}
                            >
                                {isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
