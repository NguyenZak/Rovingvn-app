'use client'

import { useState, useTransition } from 'react'
import { Mail, Check, AlertCircle } from 'lucide-react'
import { subscribeToNewsletter } from '@/lib/actions/newsletter-actions'

export function Newsletter() {
    const [isPending, startTransition] = useTransition()
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = (formData: FormData) => {
        setStatus('idle')
        setMessage('')

        startTransition(async () => {
            const result = await subscribeToNewsletter(formData)

            if (result.success) {
                setStatus('success')
                setMessage(result.message)
                // Reset form
                const form = document.getElementById('newsletter-form') as HTMLFormElement
                if (form) form.reset()
            } else {
                setStatus('error')
                setMessage(result.message)
            }

            // Clear success/error message after 5 seconds
            setTimeout(() => {
                setMessage('')
                setStatus('idle')
            }, 5000)
        })
    }

    return (
        <section className="py-20 bg-[#004D40] relative overflow-hidden">
            {/* Background Pattern - subtle dots */}
            <div className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
                    backgroundSize: '30px 30px'
                }}
            />

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-2xl mx-auto text-center text-white">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <Mail className="w-8 h-8 text-emerald-300" />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Get Travel Inspiration
                    </h2>

                    <p className="text-emerald-50/80 text-lg mb-8 leading-relaxed">
                        Subscribe to our newsletter for the latest travel tips, hidden gems, and exclusive deals delivered straight to your inbox.
                    </p>

                    <form
                        id="newsletter-form"
                        action={handleSubmit}
                        className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto mb-4"
                    >
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email address"
                            required
                            className="flex-1 px-6 py-3.5 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full"
                        />
                        <button
                            type="submit"
                            disabled={isPending}
                            className="bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed whitespace-nowrap"
                        >
                            {isPending ? 'Subscribing...' : 'Subscribe'}
                        </button>
                    </form>

                    {/* Status Messages */}
                    {message && (
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm mb-4 animate-in fade-in slide-in-from-bottom-2 ${status === 'success'
                                ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30'
                                : 'bg-red-500/20 text-red-100 border border-red-500/30'
                            }`}>
                            {status === 'success' ? <Check size={16} /> : <AlertCircle size={16} />}
                            {message}
                        </div>
                    )}

                    <p className="text-emerald-50/40 text-sm">
                        No spam, we promise. Unsubscribe at any time.
                    </p>
                </div>
            </div>
        </section>
    )
}
