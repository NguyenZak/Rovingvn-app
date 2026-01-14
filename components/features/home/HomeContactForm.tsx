
'use client'

import { useState } from 'react'
import { submitGeneralInquiry } from '@/lib/actions/general-inquiry-actions'
import { Send, CheckCircle, Loader2 } from 'lucide-react'

export function HomeContactForm() {
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        setError(null)

        const formData = new FormData(event.currentTarget)

        const result = await submitGeneralInquiry({
            name: formData.get('name') as string,
            email: formData.get('email') as string,
            phone: formData.get('phone') as string,
            number_of_people: parseInt(formData.get('people') as string) || 1,
            subject: formData.get('subject') as string || undefined,
            message: formData.get('message') as string || undefined
        })

        setLoading(false)
        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Something went wrong')
        }
    }

    if (success) {
        return (
            <section className="py-24 bg-emerald-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-lg mx-auto bg-white p-12 rounded-2xl shadow-xl border border-emerald-100">
                        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-2">Message Sent!</h3>
                        <p className="text-gray-600">
                            Thank you for contacting us. We will get back to you via WhatsApp or Email shortly.
                        </p>
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-24 bg-gradient-to-b from-slate-50 to-white relative">
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-slate-800 mb-4">Start Your Journey</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Tell us about your dream trip, and we will make it happen.
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-slate-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border-2 border-red-100">
                                    {error}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Your Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        name="name"
                                        type="text"
                                        placeholder="John Doe"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        WhatsApp Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        name="phone"
                                        type="tel"
                                        placeholder="+84 123 456 789"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Email <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        required
                                        name="email"
                                        type="email"
                                        placeholder="john@example.com"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                                        Number of People
                                    </label>
                                    <input
                                        required
                                        name="people"
                                        type="number"
                                        min="1"
                                        defaultValue="2"
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    name="subject"
                                    type="text"
                                    placeholder="Tour inquiry, booking question, etc."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                />
                            </div>

                            <div className="form-group">
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Notes / Special Requests
                                </label>
                                <textarea
                                    name="message"
                                    rows={5}
                                    placeholder="I want to visit Sapa and Halong Bay..."
                                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                                ></textarea>
                            </div>

                            <div className="text-center mt-6">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full md:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-12 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 mx-auto"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={20} className="animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            Send Inquiry
                                            <Send size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}
