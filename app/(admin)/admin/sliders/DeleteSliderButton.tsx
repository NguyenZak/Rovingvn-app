'use client'

import { useState } from 'react'
import { deleteSlider } from './actions'
import { Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface DeleteSliderButtonProps {
    sliderId: string
    sliderTitle: string
}

export function DeleteSliderButton({ sliderId, sliderTitle }: DeleteSliderButtonProps) {
    const [deleting, setDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm(`Bạn có chắc muốn xóa slider "${sliderTitle}"?`)) {
            return
        }

        setDeleting(true)
        try {
            const result = await deleteSlider(sliderId)

            if (result.success) {
                router.refresh()
            } else {
                alert(result.error || 'Có lỗi xảy ra khi xóa slider')
            }
        } catch (error) {
            alert('Có lỗi xảy ra khi xóa slider')
        } finally {
            setDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 px-3 py-2 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Trash2 className="w-4 h-4" />
            {deleting ? 'Đang xóa...' : 'Xoá'}
        </button>
    )
}
