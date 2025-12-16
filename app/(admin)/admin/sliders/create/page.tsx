// ============================================
// Create Slider Page
// ============================================

import { requireEditor } from '@/lib/supabase/server'
import SliderForm from '@/components/features/cms/SliderForm'

export default async function CreateSliderPage() {
    await requireEditor()

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Tạo slider mới</h1>
                <p className="text-sm text-gray-600 mt-1">
                    Thêm slider mới cho trang chủ
                </p>
            </div>

            <SliderForm />
        </div>
    )
}
