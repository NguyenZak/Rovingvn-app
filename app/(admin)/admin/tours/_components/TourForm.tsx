/**
 * Tour Form Component
 * Reusable form for creating and editing tours
 */

"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    Save, Plus, Trash2, MapPin, Calendar,
    DollarSign, Image as ImageIcon, Globe, Check
} from "lucide-react";
import { createTour, updateTour } from "@/lib/actions/tour-actions";
import type { Tour } from "@/lib/actions/tour-actions";
import { getAllDestinations } from "@/lib/actions/destination-actions";
import type { Destination } from "@/lib/actions/destination-actions";
import { GenericImageUpload } from "@/app/(admin)/admin/components/GenericImageUpload";
import MediaPicker from "@/components/ui/MediaPicker";

interface TourFormProps {
    initialData?: Tour;
}

export function TourForm({ initialData }: TourFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [activeTab, setActiveTab] = useState('basic');
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [availableDestinations, setAvailableDestinations] = useState<Destination[]>([]);

    // Form State
    const [formData, setFormData] = useState<Partial<Tour>>({
        title: initialData?.title || '',
        slug: initialData?.slug || '',
        short_description: initialData?.short_description || '',
        description: initialData?.description || '',
        duration_days: initialData?.duration_days || 1,
        duration_nights: initialData?.duration_nights || 0,
        max_participants: initialData?.max_participants || 10,
        difficulty_level: initialData?.difficulty_level || 'easy',
        price_adult: initialData?.price_adult || 0,
        price_child: initialData?.price_child || 0,
        featured_image: initialData?.featured_image || '',
        gallery_images: initialData?.gallery_images || [],
        itinerary: initialData?.itinerary || [],
        includes: initialData?.includes || [],
        excludes: initialData?.excludes || [],
        meta_title: initialData?.meta_title || '',
        meta_description: initialData?.meta_description || '',
        status: initialData?.status || 'draft',
        start_location: initialData?.start_location || '',
        destination_ids: initialData?.destination_ids || [],
    });

    // Fetch available destinations
    useEffect(() => {
        async function fetchDestinations() {
            const result = await getAllDestinations({ limit: 100, status: 'published' });
            if (result.success && result.data) {
                setAvailableDestinations(result.data);
            }
        }
        fetchDestinations();
    }, []);

    const generateSlug = (title: string) => {
        return title
            .toLowerCase()
            .normalize('NFD') // Change diacritics
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/-+/g, '-'); // Remove duplicate -
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleChange = (field: keyof Tour, value: any) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };
            if (field === 'title' && !initialData) {
                newData.slug = generateSlug(value);
            }
            return newData;
        });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleItineraryChange = (index: number, field: string, value: any) => {
        const newItinerary = [...(formData.itinerary || [])];
        if (!newItinerary[index]) newItinerary[index] = {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newItinerary[index] = { ...(newItinerary[index] as any), [field]: value };
        handleChange('itinerary', newItinerary);
    };

    const addItineraryDay = () => {
        const current = formData.itinerary || [];
        handleChange('itinerary', [...current, { day: current.length + 1, title: '', description: '' }]);
    };

    const removeItineraryDay = (index: number) => {
        const newItinerary = [...(formData.itinerary || [])];
        newItinerary.splice(index, 1);
        // Re-index days
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const reindexed = newItinerary.map((item, i) => ({ ...(item as any), day: i + 1 }));
        handleChange('itinerary', reindexed);
    };

    const handleArrayChange = (field: 'includes' | 'excludes', index: number, value: string) => {
        const newArray = [...(formData[field] || [])];
        newArray[index] = value;
        handleChange(field, newArray);
    };

    const addArrayItem = (field: 'includes' | 'excludes') => {
        const newArray = [...(formData[field] || []), ''];
        handleChange(field, newArray);
    };

    const removeArrayItem = (field: 'includes' | 'excludes', index: number) => {
        const newArray = [...(formData[field] || [])];
        newArray.splice(index, 1);
        handleChange(field, newArray);
    };

    const toggleDestination = (destinationId: string) => {
        const currentIds = formData.destination_ids || [];
        if (currentIds.includes(destinationId)) {
            handleChange('destination_ids', currentIds.filter(id => id !== destinationId));
        } else {
            handleChange('destination_ids', [...currentIds, destinationId]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            let result;
            if (initialData?.id) {
                result = await updateTour(initialData.id, formData);
            } else {
                result = await createTour(formData);
            }

            if (result.success) {
                setMessage({ type: 'success', text: initialData ? 'Tour updated!' : 'Tour created!' });
                if (!initialData) {
                    router.push('/admin/tours');
                } else {
                    router.refresh();
                }
            } else {
                setMessage({ type: 'error', text: result.error || 'Something went wrong' });
            }
        });
    };

    const tabs = [
        { id: 'basic', label: 'Basic Info', icon: MapPin },
        { id: 'pricing', label: 'Pricing', icon: DollarSign },
        { id: 'itinerary', label: 'Itinerary', icon: Calendar },
        { id: 'media', label: 'Media', icon: ImageIcon },
        { id: 'seo', label: 'SEO', icon: Globe },
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header Actions */}
            <div className="flex items-center justify-between sticky top-0 bg-gray-50 py-4 z-10 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-900">
                    {initialData ? 'Edit Tour' : 'Create New Tour'}
                </h1>
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Save size={18} />
                        )}
                        Save Tour
                    </button>
                </div>
            </div>

            {/* Message */}
            {message && (
                <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                    {message.text}
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar Tabs */}
                <div className="w-full lg:w-64 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${activeTab === tab.id
                                    ? 'bg-emerald-50 text-emerald-700 border-l-4 border-emerald-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 space-y-6">

                    {/* Basic Info Tab */}
                    <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleChange('title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 font-medium"
                                        placeholder="e.g., Ha Long Bay Luxury Cruise"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.slug}
                                        onChange={(e) => handleChange('slug', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-gray-50"
                                        placeholder="ha-long-bay-luxury-cruise"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.duration_days}
                                            onChange={(e) => handleChange('duration_days', parseInt(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            placeholder="e.g., 3"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Nights)</label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.duration_nights}
                                            onChange={(e) => handleChange('duration_nights', parseInt(e.target.value))}
                                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            placeholder="e.g., 2"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Participants</label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={formData.max_participants}
                                        onChange={(e) => handleChange('max_participants', parseInt(e.target.value))}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                        placeholder="e.g., 15"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => handleChange('status', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                        <option value="archived">Archived</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                                    <textarea
                                        rows={3}
                                        value={formData.short_description}
                                        onChange={(e) => handleChange('short_description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 font-medium"
                                        placeholder="Brief summary for listings..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Description</label>
                                    <textarea
                                        rows={8}
                                        value={formData.description}
                                        onChange={(e) => handleChange('description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-900 font-medium"
                                        placeholder="Detailed description of the tour..."
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Accepts Markdown or HTML.</p>
                                </div>

                                {/* Destinations Multi-Select */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Destinations</label>
                                    <p className="text-xs text-gray-500 mb-3">Select one or more destinations for this tour</p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        {availableDestinations.length === 0 ? (
                                            <p className="text-sm text-gray-400 italic col-span-2">Loading destinations...</p>
                                        ) : (
                                            availableDestinations.map(dest => {
                                                const isSelected = formData.destination_ids?.includes(dest.id) || false;
                                                return (
                                                    <label
                                                        key={dest.id}
                                                        className={`flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all ${isSelected
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 hover:border-emerald-300 bg-white'
                                                            }`}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={isSelected}
                                                            onChange={() => toggleDestination(dest.id)}
                                                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                                                        />
                                                        <div className="flex-1">
                                                            <div className="font-medium text-sm text-gray-900">{dest.name}</div>
                                                            {dest.region && (
                                                                <div className="text-xs text-gray-500">{dest.region}</div>
                                                            )}
                                                        </div>
                                                        {isSelected && <Check size={16} className="text-emerald-600" />}
                                                    </label>
                                                );
                                            })
                                        )}
                                    </div>
                                    {formData.destination_ids && formData.destination_ids.length > 0 && (
                                        <p className="text-xs text-emerald-600 mt-2">
                                            {formData.destination_ids.length} destination{formData.destination_ids.length > 1 ? 's' : ''} selected
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mt-6 space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Features</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Includes */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Includes</label>
                                        <button type="button" onClick={() => addArrayItem('includes')} className="text-emerald-600 hover:text-emerald-700"><Plus size={18} /></button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.includes?.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('includes', i, e.target.value)}
                                                    className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm"
                                                    placeholder="e.g. Breakfast"
                                                />
                                                <button type="button" onClick={() => removeArrayItem('includes', i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        {formData.includes?.length === 0 && <p className="text-sm text-gray-400 italic">No items included</p>}
                                    </div>
                                </div>

                                {/* Excludes */}
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label className="block text-sm font-medium text-gray-700">Excludes</label>
                                        <button type="button" onClick={() => addArrayItem('excludes')} className="text-emerald-600 hover:text-emerald-700"><Plus size={18} /></button>
                                    </div>
                                    <div className="space-y-2">
                                        {formData.excludes?.map((item, i) => (
                                            <div key={i} className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={item}
                                                    onChange={(e) => handleArrayChange('excludes', i, e.target.value)}
                                                    className="flex-1 px-3 py-1.5 rounded border border-gray-200 text-sm"
                                                    placeholder="e.g. Tips"
                                                />
                                                <button type="button" onClick={() => removeArrayItem('excludes', i)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                                            </div>
                                        ))}
                                        {formData.excludes?.length === 0 && <p className="text-sm text-gray-400 italic">No items excluded</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Pricing Tab */}
                    <div className={activeTab === 'pricing' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Pricing Configuration</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Adult Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.price_adult}
                                            onChange={(e) => handleChange('price_adult', parseInt(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            placeholder="150"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Child Price (USD)</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                        <input
                                            type="number"
                                            min="0"
                                            value={formData.price_child}
                                            onChange={(e) => handleChange('price_child', parseInt(e.target.value))}
                                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                            placeholder="100"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Itinerary Tab */}
                    <div className={activeTab === 'itinerary' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold">Daily Itinerary</h2>
                                <button
                                    type="button"
                                    onClick={addItineraryDay}
                                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-medium text-sm transition-colors"
                                >
                                    <Plus size={16} /> Add Day
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                {formData.itinerary?.map((day: any, index) => (
                                    <div key={index} className="border border-gray-200 rounded-xl p-4 bg-gray-50 relative group">
                                        <div className="absolute top-4 right-4">
                                            <button
                                                type="button"
                                                onClick={() => removeItineraryDay(index)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        <h3 className="font-semibold text-gray-900 mb-3">Day {index + 1}</h3>

                                        <div className="space-y-4">
                                            <div>
                                                <input
                                                    type="text"
                                                    placeholder="Day Title (e.g. Arrival in Hanoi)"
                                                    value={day.title || ''}
                                                    onChange={(e) => handleItineraryChange(index, 'title', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <textarea
                                                    placeholder="Description of activities..."
                                                    rows={3}
                                                    value={day.description || ''}
                                                    onChange={(e) => handleItineraryChange(index, 'description', e.target.value)}
                                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Day Images</label>
                                                <MediaPicker
                                                    multiple
                                                    compact
                                                    value={day.images || []}
                                                    onChange={(urls: string | string[]) => handleItineraryChange(index, 'images', Array.isArray(urls) ? urls : [urls])}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {formData.itinerary?.length === 0 && (
                                    <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                                        No days added yet. Click &quot;Add Day&quot; to start.
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Media Tab */}
                    <div className={activeTab === 'media' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Media</h2>

                            <MediaPicker
                                label="Cover Image"
                                value={formData.featured_image || ''}
                                onChange={(url) => handleChange('featured_image', Array.isArray(url) ? url[0] : url)}
                            />

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-md font-medium text-gray-700 mb-4">Gallery Images</h3>
                                <MediaPicker
                                    multiple
                                    label="Tour Gallery"
                                    value={formData.gallery_images || []}
                                    onChange={(urls: string | string[]) => handleChange('gallery_images', Array.isArray(urls) ? urls : [urls])}
                                />
                                <p className="text-xs text-gray-500 mt-2">Select multiple images for the tour gallery.</p>
                            </div>
                        </div>
                    </div>

                    {/* SEO Tab */}
                    <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
                            <h2 className="text-xl font-semibold mb-4">Search Engine Optimization</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
                                <input
                                    type="text"
                                    value={formData.meta_title || ''}
                                    onChange={(e) => handleChange('meta_title', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder={formData.title}
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave blank to use tour title</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                                <textarea
                                    rows={3}
                                    value={formData.meta_description || ''}
                                    onChange={(e) => handleChange('meta_description', e.target.value)}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder={formData.short_description}
                                />
                                <p className="text-xs text-gray-500 mt-1">Leave blank to use short description</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </form>
    );
}
