"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Save, X, Star } from "lucide-react";
import { createTestimonial, updateTestimonial, deleteTestimonial, type Testimonial } from "@/lib/actions/testimonial-actions";
import MediaPicker from "@/components/ui/MediaPicker";
import Image from "next/image";

interface TestimonialsClientProps {
    initialTestimonials: Testimonial[];
}

export function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
    const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials);
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        content: "",
        rating: 5,
        avatar_url: "",
        display_order: 0,
        status: "published"
    });

    const resetForm = () => {
        setFormData({
            name: "",
            role: "",
            content: "",
            rating: 5,
            avatar_url: "",
            display_order: testimonials.length + 1,
            status: "published"
        });
        setEditingId(null);
        setIsCreating(false);
    };

    const handleCreate = () => {
        startTransition(async () => {
            const result = await createTestimonial({
                name: formData.name,
                role: formData.role,
                content: formData.content,
                rating: formData.rating,
                avatar_url: formData.avatar_url,
                display_order: formData.display_order,
                status: formData.status as any,
            });

            if (result.success && result.data) {
                setTestimonials([result.data, ...testimonials]);
                resetForm();
            }
        });
    };

    const handleUpdate = () => {
        if (!editingId) return;
        startTransition(async () => {
            const result = await updateTestimonial(editingId, {
                name: formData.name,
                role: formData.role,
                content: formData.content,
                rating: formData.rating,
                avatar_url: formData.avatar_url,
                display_order: formData.display_order,
                status: formData.status as any,
            });

            if (result.success && result.data) {
                setTestimonials(testimonials.map(t => t.id === editingId ? result.data! : t));
                resetForm();
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        startTransition(async () => {
            const result = await deleteTestimonial(id);
            if (result.success) {
                setTestimonials(testimonials.filter(t => t.id !== id));
            }
        });
    };

    const startEdit = (testimonial: Testimonial) => {
        setFormData({
            name: testimonial.name,
            role: testimonial.role || "",
            content: testimonial.content,
            rating: testimonial.rating,
            avatar_url: testimonial.avatar_url || "",
            display_order: testimonial.display_order,
            status: testimonial.status
        });
        setEditingId(testimonial.id);
        setIsCreating(false);
    };

    const startCreate = () => {
        resetForm();
        setIsCreating(true);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
                    <p className="text-gray-500">Manage customer reviews and feedback</p>
                </div>
                {!isCreating && !editingId && (
                    <button
                        onClick={startCreate}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
                    >
                        <Plus size={20} /> Add New
                    </button>
                )}
            </div>

            {/* Form Area */}
            {(isCreating || editingId) && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8 animate-in fade-in slide-in-from-top-4">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">{isCreating ? 'Add New Testimonial' : 'Edit Testimonial'}</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="e.g. John Doe"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Role / Location</label>
                                <input
                                    type="text"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="e.g. CEO at Tech / USA"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, rating: star })}
                                            className={`p-1 rounded transition-colors ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}
                                        >
                                            <Star fill="currentColor" size={24} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="h-full flex flex-col">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Review Content</label>
                                <textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    className="flex-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[120px]"
                                    placeholder="Enter the testimonial text..."
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <MediaPicker
                                label="Customer Avatar"
                                value={formData.avatar_url}
                                onChange={(url) => setFormData({ ...formData, avatar_url: Array.isArray(url) ? url[0] : url })}
                                compact
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={isCreating ? handleCreate : handleUpdate}
                            disabled={isPending || !formData.name || !formData.content}
                            className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                        >
                            <Save size={18} />
                            {isCreating ? 'Create Testimonial' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {testimonials.map((item) => (
                    <div
                        key={item.id}
                        className={`bg-white rounded-xl border p-6 transition-shadow hover:shadow-md ${editingId === item.id ? 'ring-2 ring-emerald-500 border-emerald-500' : 'border-gray-200'}`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                {item.avatar_url ? (
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                                        <Image src={item.avatar_url} alt={item.name} fill className="object-cover" />
                                    </div>
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-lg">
                                        {item.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                    <p className="text-sm text-gray-500">{item.role}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => startEdit(item)}
                                    className="p-2 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                >
                                    <Pencil size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="flex text-yellow-400 mb-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={14}
                                        fill={i < item.rating ? "currentColor" : "none"}
                                        className={i >= item.rating ? "text-gray-300" : ""}
                                    />
                                ))}
                            </div>
                            <p className="text-gray-600 text-sm line-clamp-3 italic">"{item.content}"</p>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 text-xs text-gray-500">
                            <span className={item.status === 'published' ? 'text-green-600 font-medium' : 'text-gray-500'}>
                                {item.status === 'published' ? 'Published' : 'Draft'}
                            </span>
                            {/* <span>{new Date(item.created_at).toLocaleDateString()}</span> */}
                        </div>
                    </div>
                ))}
            </div>

            {testimonials.length === 0 && !isCreating && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    <p className="text-gray-500 mb-4">No testimonials yet</p>
                    <button
                        onClick={startCreate}
                        className="text-emerald-600 font-semibold hover:text-emerald-700"
                    >
                        Add your first testimonial
                    </button>
                </div>
            )}
        </div>
    );
}
