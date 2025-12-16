// ============================================
// Edit Slider Page
// ============================================

import { requireEditor } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { getSliderById } from '../../actions'
import SliderForm from '@/components/features/cms/SliderForm'

interface EditSliderPageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditSliderPage({ params }: EditSliderPageProps) {
    await requireEditor()

    const { id } = await params
    const slider = await getSliderById(id)

    if (!slider) {
        notFound()
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa slider</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Cập nhật thông tin slider
                </p>
            </div>

            <SliderForm slider={slider} />
        </div>
    )
}
