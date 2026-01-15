'use client'

import { useState } from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteRegion } from '@/lib/actions/region-actions'

interface DeleteRegionButtonProps {
    id: string
}

export function DeleteRegionButton({ id }: DeleteRegionButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this region?')) return

        setIsDeleting(true)
        const result = await deleteRegion(id)

        if (result.success) {
            router.refresh()
        } else {
            alert('Failed to delete region: ' + result.error)
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disable:opacity-50"
            title="Delete Region"
        >
            {isDeleting ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    )
}
