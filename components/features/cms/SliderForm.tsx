'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { Slider, SliderStatus } from '@/lib/types/cms'
import { createSlider, updateSlider } from '@/app/(admin)/admin/sliders/actions'
import { VI_LABELS } from '@/lib/constants/vi'

interface SliderFormProps {
    slider?: Slider
}

export default function SliderForm({ slider }: SliderFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)

    // Form state
    const [formData, setFormData] = useState({
        title: slider?.title || '',
        subtitle: slider?.subtitle || '',
        description: slider?.description || '',
        image_id: slider?.image_id || '',
        link: slider?.link || '',
        button_text: slider?.button_text || '',
        display_order: slider?.display_order || 0,
        status: (slider?.status as SliderStatus) || SliderStatus.ACTIVE,
        start_date: slider?.start_date || '',
        end_date: slider?.end_date || ''
    })

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError(null)

        startTransition(async () => {
            const result = slider
                ? await updateSlider(slider.id, formData)
                : await createSlider(formData)

            if (result.success) {
                router.push('/admin/sliders')
                router.refresh()
            } else {
                setError(result.error || 'Có lỗi xảy ra')
            }
        })
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
            {error && (
                <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                    {error}
                </div>
            )}

            {/* Title */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.title} <span className="text-red-600">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Nhập tiêu đề slider"
                />
            </div>

            {/* Subtitle */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.subtitle}
                </label>
                <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Nhập phụ đề"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.description}
                </label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Nhập mô tả"
                />
            </div>

            {/* Link */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.link}
                </label>
                <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="https://..."
                />
            </div>

            {/* Button Text */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.buttonText}
                </label>
                <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    placeholder="Xem thêm"
                />
            </div>

            {/* Display Order & Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Display Order */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {VI_LABELS.sliders.displayOrder}
                    </label>
                    <input
                        type="number"
                        min="0"
                        value={formData.display_order}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                </div>

                {/* Status */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {VI_LABELS.sliders.status}
                    </label>
                    <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as SliderStatus })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    >
                        <option value={SliderStatus.ACTIVE}>{VI_LABELS.sliders.active}</option>
                        <option value={SliderStatus.INACTIVE}>{VI_LABELS.sliders.inactive}</option>
                    </select>
                </div>
            </div>

            {/* Start Date & End Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Start Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {VI_LABELS.sliders.startDate}
                    </label>
                    <input
                        type="date"
                        value={formData.start_date ? formData.start_date.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                </div>

                {/* End Date */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        {VI_LABELS.sliders.endDate}
                    </label>
                    <input
                        type="date"
                        value={formData.end_date ? formData.end_date.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                </div>
            </div>

            {/* Image Upload Placeholder */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {VI_LABELS.sliders.image}
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Tích hợp với Media Library (sẽ bổ sung sau)
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Hiện tại có thể nhập ID ảnh từ bảng media
                    </p>
                    <input
                        type="text"
                        value={formData.image_id}
                        onChange={(e) => setFormData({ ...formData, image_id: e.target.value })}
                        className="mt-4 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                        placeholder="UUID ảnh"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-6 border-t">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isPending}
                >
                    {VI_LABELS.actions.cancel}
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isPending ? 'Đang lưu...' : VI_LABELS.actions.save}
                </button>
            </div>
        </form>
    )
}
