
'use client'

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import { deleteCustomTrip } from '@/lib/actions/custom-trip-actions'

export default function DeleteCustomTripButton({ id }: { id: string }) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this specific custom trip request? This action cannot be undone.')) {
            return
        }

        setIsDeleting(true)
        try {
            const result = await deleteCustomTrip(id)
            if (!result.success) {
                alert(result.error || 'Failed to delete the trip request')
            }
        } catch {
            alert('An error occurred')
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Delete Request"
        >
            <Trash2 size={18} />
        </button>
    )
}
