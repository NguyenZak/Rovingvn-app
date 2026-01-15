"use client";

import { useState, useTransition } from "react";
import { Plus, Pencil, Trash2, Save, X, ImageIcon, Check } from "lucide-react";
import { createHighlight, updateHighlight, deleteHighlight, type Highlight } from "@/lib/actions/highlight-actions";
import { updateSiteSettings, type SiteSettings } from "@/lib/actions/site-settings";
import MediaPicker from "@/components/ui/MediaPicker";
import * as LucideIcons from "lucide-react";

interface HighlightsClientProps {
    initialHighlights: Highlight[];
    initialSettings: SiteSettings | null;
}

// Available colors for selection
const COLORS = [
    { label: "Orange", text: "text-orange-500", bg: "bg-orange-50" },
    { label: "Red", text: "text-red-500", bg: "bg-red-50" },
    { label: "Green", text: "text-green-500", bg: "bg-green-50" },
    { label: "Blue", text: "text-blue-500", bg: "bg-blue-50" },
    { label: "Purple", text: "text-purple-500", bg: "bg-purple-50" },
    { label: "Teal", text: "text-teal-500", bg: "bg-teal-50" },
    { label: "Indigo", text: "text-indigo-500", bg: "bg-indigo-50" },
    { label: "Pink", text: "text-pink-500", bg: "bg-pink-50" },
];

// Common icons list
const ICONS = ["Utensils", "Building2", "Palmtree", "Users", "Map", "Camera", "Sun", "Cloud", "Music", "Heart", "Coffee", "Compass", "Anchor", "Bike", "Car", "Plane"];

export function HighlightsClient({ initialHighlights, initialSettings }: HighlightsClientProps) {
    const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
    const [isPending, startTransition] = useTransition();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [showImageSuccess, setShowImageSuccess] = useState(false);

    // Images state
    const [highlightImages, setHighlightImages] = useState({
        highlight_image_1: initialSettings?.highlight_image_1 || "",
        highlight_image_2: initialSettings?.highlight_image_2 || "",
        highlight_image_3: initialSettings?.highlight_image_3 || "",
        highlight_image_4: initialSettings?.highlight_image_4 || "",
    });

    // Hero Text State
    const [heroText, setHeroText] = useState({
        hero_title: initialSettings?.hero_title || "",
        hero_subtitle: initialSettings?.hero_subtitle || "",
        hero_description: initialSettings?.hero_description || "",
    });

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        icon: "Palmtree",
        colorIndex: 0,
        display_order: 0,
    });

    const resetForm = () => {
        setFormData({
            title: "",
            description: "",
            icon: "Palmtree",
            colorIndex: 0,
            display_order: highlights.length + 1,
        });
        setEditingId(null);
        setIsCreating(false);
    };

    const handleCreate = () => {
        startTransition(async () => {
            const color = COLORS[formData.colorIndex];
            const result = await createHighlight({
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
                color: color.text,
                bg: color.bg,
                display_order: formData.display_order,
            });

            if (result.success && result.data) {
                // @ts-ignore
                setHighlights([...highlights, result.data]);
                resetForm();
            }
        });
    };

    const handleUpdate = () => {
        if (!editingId) return;
        startTransition(async () => {
            const color = COLORS[formData.colorIndex];
            const result = await updateHighlight(editingId, {
                title: formData.title,
                description: formData.description,
                icon: formData.icon,
                color: color.text,
                bg: color.bg,
                display_order: formData.display_order,
            });

            if (result.success && result.data) {
                // @ts-ignore
                setHighlights(highlights.map(h => h.id === editingId ? result.data : h));
                resetForm();
            }
        });
    };

    const handleDelete = (id: string) => {
        if (!confirm("Are you sure you want to delete this highlight?")) return;
        startTransition(async () => {
            const result = await deleteHighlight(id);
            if (result.success) {
                setHighlights(highlights.filter(h => h.id !== id));
            }
        });
    };

    const startEdit = (highlight: Highlight) => {
        const colorIdx = COLORS.findIndex(c => c.text === highlight.color) || 0;
        setFormData({
            title: highlight.title,
            description: highlight.description,
            icon: highlight.icon,
            colorIndex: Math.max(0, colorIdx),
            display_order: highlight.display_order,
        });
        setEditingId(highlight.id);
        setIsCreating(false);
    };

    const handleSaveSettings = () => {
        startTransition(async () => {
            const result = await updateSiteSettings({
                ...highlightImages,
                ...heroText
            });
            if (result.success) {
                setShowImageSuccess(true);
                setTimeout(() => setShowImageSuccess(false), 3000);
            }
        });
    };

    const renderIcon = (iconName: string, size = 20) => {
        // @ts-ignore
        const Icon = LucideIcons[iconName] || LucideIcons.HelpCircle;
        return <Icon size={size} />;
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cultural Highlights</h1>
                    <p className="text-gray-600 mt-1">Manage the "Why Vietnam?" highlights section</p>
                </div>
            </div>

            {/* General Settings Section (Hero Text & Images) */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center">
                            <ImageIcon size={20} className="text-violet-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">General Information & Images</h2>
                            <p className="text-sm text-gray-500">Manage title, description, and images for the section</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSaveSettings}
                        disabled={isPending}
                        className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {showImageSuccess ? <Check size={18} /> : <Save size={18} />}
                        {showImageSuccess ? "Saved!" : "Save All Changes"}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Small Title (Hero Title)</label>
                        <input
                            type="text"
                            value={heroText.hero_title}
                            onChange={e => setHeroText({ ...heroText, hero_title: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. Why Vietnam?"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Main Heading (Hero Subtitle)</label>
                        <input
                            type="text"
                            value={heroText.hero_subtitle}
                            onChange={e => setHeroText({ ...heroText, hero_subtitle: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            placeholder="e.g. A Land of Timeless Charm"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                            value={heroText.hero_description}
                            onChange={e => setHeroText({ ...heroText, hero_description: e.target.value })}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                            rows={3}
                            placeholder="Section description..."
                        />
                    </div>
                </div>

                <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-md font-semibold text-gray-900 mb-4">Display Images</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <MediaPicker
                            label="Image 1 (Top Left)"
                            value={highlightImages.highlight_image_1}
                            onChange={(url) => setHighlightImages({ ...highlightImages, highlight_image_1: url as string })}
                        />
                        <MediaPicker
                            label="Image 2 (Bottom Left)"
                            value={highlightImages.highlight_image_2}
                            onChange={(url) => setHighlightImages({ ...highlightImages, highlight_image_2: url as string })}
                        />
                        <MediaPicker
                            label="Image 3 (Top Right)"
                            value={highlightImages.highlight_image_3}
                            onChange={(url) => setHighlightImages({ ...highlightImages, highlight_image_3: url as string })}
                        />
                        <MediaPicker
                            label="Image 4 (Bottom Right)"
                            value={highlightImages.highlight_image_4}
                            onChange={(url) => setHighlightImages({ ...highlightImages, highlight_image_4: url as string })}
                        />
                    </div>
                </div>
            </section>

            <hr className="border-gray-200" />

            {/* Highlights List Section */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Highlight Items</h2>
                        <p className="text-gray-500 text-sm">Manage the text and icons list</p>
                    </div>
                    {!isCreating && !editingId && (
                        <button
                            onClick={() => {
                                resetForm();
                                setIsCreating(true);
                            }}
                            className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <Plus size={20} />
                            Add Highlights Item
                        </button>
                    )}
                </div>

                {/* Form */}
                {(isCreating || editingId) && (
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-emerald-100 mb-6">
                        <h2 className="text-lg font-bold mb-4">{isCreating ? "Create New Highlight" : "Edit Highlight"}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                                <select
                                    value={formData.icon}
                                    onChange={e => setFormData({ ...formData, icon: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    {ICONS.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    rows={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Color Theme</label>
                                <div className="flex gap-2 flex-wrap">
                                    {COLORS.map((color, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setFormData({ ...formData, colorIndex: index })}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${formData.colorIndex === index ? 'border-gray-900' : 'border-transparent'}`}
                                        >
                                            <div className={`w-6 h-6 rounded-full ${color.bg} ${color.text} flex items-center justify-center`}>
                                                <div className="w-2 h-2 rounded-full bg-current" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Order</label>
                                <input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2"
                            >
                                <X size={18} /> Cancel
                            </button>
                            <button
                                onClick={isCreating ? handleCreate : handleUpdate}
                                disabled={isPending}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                            >
                                <Save size={18} /> {isCreating ? "Create" : "Save Changes"}
                            </button>
                        </div>
                    </div>
                )}

                {/* List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Icon</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Title & Description</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900">Order</th>
                                <th className="px-6 py-3 text-sm font-semibold text-gray-900 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {highlights.map((highlight) => (
                                <tr key={highlight.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4">
                                        <div className={`w-10 h-10 rounded-lg ${highlight.bg} ${highlight.color} flex items-center justify-center`}>
                                            {renderIcon(highlight.icon)}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-semibold text-gray-900">{highlight.title}</div>
                                        <div className="text-sm text-gray-500">{highlight.description}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">
                                        {highlight.display_order}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => startEdit(highlight)}
                                            className="text-gray-400 hover:text-emerald-600 transition-colors p-1"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(highlight.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors p-1"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {highlights.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                                        No highlights found. Create one to get started.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
