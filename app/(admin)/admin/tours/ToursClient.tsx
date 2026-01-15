/**
 * Tours Management - Client Component
 * Interactive listing with search, filters, and actions
 */

"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    MapPin, Calendar, Users, DollarSign, Eye, Edit, Trash2,
    Plus, Search, Star, StarOff, CheckCircle, XCircle
} from "lucide-react";
import { deleteTour, updateTourStatus, toggleTourFeatured } from "@/lib/actions/tour-actions";
import type { Tour } from "@/lib/actions/tour-actions";
import Link from "next/link";
import Image from "next/image";

interface ToursClientProps {
    initialTours: Tour[];
    initialSearch: string;
    initialStatus: string;
}

export function ToursClient({
    initialTours,
    initialSearch,
    initialStatus
}: ToursClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [tours, setTours] = useState(initialTours);
    const [searchQuery, setSearchQuery] = useState(initialSearch);
    const [statusFilter, setStatusFilter] = useState(initialStatus);
    const [isPending, startTransition] = useTransition();
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 3000);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set('search', query);
        } else {
            params.delete('search');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleStatusFilter = (status: string) => {
        setStatusFilter(status);
        const params = new URLSearchParams(searchParams.toString());
        if (status) {
            params.set('status', status);
        } else {
            params.delete('status');
        }
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const handleDelete = async (id: string) => {
        startTransition(async () => {
            const result = await deleteTour(id);
            if (result.success) {
                setTours(tours.filter(t => t.id !== id));
                setDeleteId(null);
                showMessage('success', 'Tour deleted successfully');
                router.refresh();
            } else {
                showMessage('error', result.error || 'Failed to delete tour');
            }
        });
    };

    const handleToggleFeatured = async (id: string, featured: boolean) => {
        startTransition(async () => {
            const result = await toggleTourFeatured(id, !featured);
            if (result.success) {
                setTours(tours.map(t => t.id === id ? { ...t, featured: !featured } : t));
                showMessage('success', `Tour ${!featured ? 'featured' : 'unfeatured'}`);
            } else {
                showMessage('error', 'Failed to update tour');
            }
        });
    };

    const handleStatusChange = async (id: string, status: 'draft' | 'published' | 'archived') => {
        startTransition(async () => {
            const result = await updateTourStatus(id, status);
            if (result.success) {
                setTours(tours.map(t => t.id === id ? { ...t, status } : t));
                showMessage('success', `Tour ${status}`);
            } else {
                showMessage('error', 'Failed to update status');
            }
        });
    };

    const formatPrice = (price?: number) => {
        if (!price) return 'N/A';
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getStatusColor = (status?: string) => {
        switch (status) {
            case 'published': return 'bg-green-100 text-green-700';
            case 'draft': return 'bg-yellow-100 text-yellow-700';
            case 'archived': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="w-full mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tours Management</h1>
                    <p className="text-gray-600 mt-1">Manage tours and travel packages</p>
                </div>

                <Link
                    href="/admin/tours/new"
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add New Tour
                </Link>
            </div>

            {/* Message */}
            {message && (
                <div className={`px-4 py-3 rounded-lg flex items-center gap-2 ${message.type === 'success'
                    ? 'bg-green-50 border border-green-200 text-green-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                    }`}>
                    {message.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    {message.text}
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search tours..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                    </div>

                    {/* Status Filter */}
                    <select
                        value={statusFilter}
                        onChange={(e) => handleStatusFilter(e.target.value)}
                        className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    >
                        <option value="">All Status</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                    </select>
                </div>
            </div>

            {/* Tours Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {tours.map((tour) => (
                    <div key={tour.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                        {/* Image */}
                        <div className="relative h-48 bg-gray-200">
                            {tour.featured_image ? (
                                <Image
                                    src={tour.featured_image}
                                    alt={tour.title}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <MapPin size={48} />
                                </div>
                            )}

                            {/* Featured Badge */}
                            {tour.featured && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                    <Star size={12} fill="currentColor" />
                                    Featured
                                </div>
                            )}

                            {/* Status Badge */}
                            <div className={`absolute top-2 left-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(tour.status)}`}>
                                {tour.status}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                                {tour.title}
                            </h3>

                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                {tour.short_description}
                            </p>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar size={16} />
                                    {tour.duration_days}D{tour.duration_nights}N
                                </div>

                                {tour.max_participants && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Users size={16} />
                                        Max {tour.max_participants} pax
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-600">
                                    <DollarSign size={16} />
                                    {formatPrice(tour.price_adult)}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                                <Link
                                    href={`/tours/${tour.slug}`}
                                    target="_blank"
                                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Eye size={16} />
                                    View
                                </Link>

                                <Link
                                    href={`/admin/tours/${tour.id}/edit`}
                                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1"
                                >
                                    <Edit size={16} />
                                    Edit
                                </Link>

                                <button
                                    onClick={() => setDeleteId(tour.id)}
                                    className="px-3 py-2 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors"
                                    disabled={isPending}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            {/* Quick Actions */}
                            <div className="flex items-center gap-2 mt-2">
                                <button
                                    onClick={() => handleToggleFeatured(tour.id, tour.featured || false)}
                                    className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${tour.featured
                                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                    disabled={isPending}
                                >
                                    {tour.featured ? <><StarOff size={12} className="inline mr-1" />Unfeature</> : <><Star size={12} className="inline mr-1" />Feature</>}
                                </button>

                                {tour.status === 'draft' && (
                                    <button
                                        onClick={() => handleStatusChange(tour.id, 'published')}
                                        className="flex-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
                                        disabled={isPending}
                                    >
                                        Publish
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {tours.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                    <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No tours found</h3>
                    <p className="text-gray-600 mb-4">Get started by creating your first tour</p>
                    <Link
                        href="/admin/tours/new"
                        className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                    >
                        <Plus size={20} />
                        Add New Tour
                    </Link>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {deleteId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Tour?</h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this tour? This action cannot be undone.
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
