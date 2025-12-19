// ============================================
// Sliders Listing Page (Server Component)
// ============================================

import { createClient } from '@/lib/supabase/server'
// import { requireEditor } from '@/lib/supabase/server'
import Link from 'next/link'
import { Slider } from '@/lib/types/cms'
import { Edit } from 'lucide-react'
import { DeleteSliderButton } from './DeleteSliderButton'

export default async function SlidersPage() {
    // await requireEditor() // Temporarily disabled for testing
    const supabase = await createClient()

    // Fetch all sliders with image
    const { data: sliders, error } = await supabase
        .from('sliders')
        .select(`
      *,
      image:image_id(id, url, filename)
    `)
        .order('display_order', { ascending: true })

    if (error) {
        console.error('Error fetching sliders:', error)
    }

    const slidersData: Slider[] = (sliders as unknown as Slider[]) || []

    // Count stats
    const totalSliders = slidersData.length
    const activeSliders = slidersData.filter(s => s.status === 'active').length
    const inactiveSliders = slidersData.filter(s => s.status === 'inactive').length

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Quản lý Sliders</h1>
                    <p className="text-sm text-gray-600 mt-1">
                        {totalSliders} sliders ({activeSliders} hoạt động, {inactiveSliders} ẩn)
                    </p>
                </div>
                <Link
                    href="/admin/sliders/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Tạo slider mới
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Tổng sliders</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{totalSliders}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Hoạt động</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">{activeSliders}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm text-gray-600">Ẩn</div>
                    <div className="text-3xl font-bold text-gray-400 mt-2">{inactiveSliders}</div>
                </div>
            </div>

            {/* Sliders Grid */}
            <div className="bg-white rounded-lg shadow p-6">
                {slidersData.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Chưa có slider nào</p>
                        <Link
                            href="/admin/sliders/create"
                            className="inline-block mt-4 text-blue-600 hover:text-blue-800"
                        >
                            Tạo slider đầu tiên →
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {slidersData.map((slider, index) => (
                            <div
                                key={slider.id}
                                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Image */}
                                <div className="relative h-48 bg-gray-100">
                                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                    {(slider as any).image?.url ? (
                                        /* eslint-disable-next-line @next/next/no-img-element */
                                        <img
                                            /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
                                            src={(slider as any).image.url}
                                            alt={slider.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            Không có ảnh
                                        </div>
                                    )}

                                    {/* Order Badge */}
                                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-medium">
                                        #{index + 1}
                                    </div>

                                    {/* Status Badge */}
                                    <div className="absolute top-2 right-2">
                                        <span
                                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${slider.status === 'active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                                }`}
                                        >
                                            {slider.status === 'active' ? 'Hoạt động' : 'Ẩn'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-semibold text-gray-900 mb-1">{slider.title}</h3>
                                    {slider.subtitle && (
                                        <p className="text-sm text-gray-600 mb-2">{slider.subtitle}</p>
                                    )}

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">
                                        <Link
                                            href={`/admin/sliders/${slider.id}/edit`}
                                            className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors flex items-center justify-center gap-1"
                                        >
                                            <Edit className="w-4 h-4" />
                                            Sửa
                                        </Link>
                                        <DeleteSliderButton
                                            sliderId={slider.id}
                                            sliderTitle={slider.title}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
