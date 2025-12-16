
'use client'

import { useState } from 'react'
import { submitBooking } from '@/app/actions'
import { Calendar, Users, Loader2, CheckCircle } from 'lucide-react'

export function BookingForm({ tourId }: { tourId: string }) {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)
        formData.append('tour_id', tourId)

        const result = await submitBooking(formData)

        setLoading(false)
        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Something went wrong')
        }
    }

    if (success) {
        return (
            <div className="bg-emerald-50 p-8 rounded-2xl text-center border border-emerald-100">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Received!</h3>
                <p className="text-gray-600">
                    Thank you for your interest. Our team will contact you shortly to confirm details.
                </p>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 md:p-8 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Book This Tour</h3>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input required name="name" type="text" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input required name="email" type="email" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input required name="phone" type="tel" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Calendar size={14} /> Date</label>
                        <input required name="date" type="date" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1"><Users size={14} /> People</label>
                        <input required name="people" type="number" min="1" defaultValue="2" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                    <textarea name="message" rows={3} className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"></textarea>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-emerald-600 text-white font-bold py-3 rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading && <Loader2 size={18} className="animate-spin" />}
                    {loading ? 'Submitting...' : 'Send Inquiry'}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                    No payment required now. We will confirm availability first.
                </p>
            </div>
        </form>
    )
}
