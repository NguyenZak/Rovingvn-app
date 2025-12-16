
'use client'

import { Mail } from 'lucide-react'

export function Newsletter() {
    return (
        <section className="py-24 bg-emerald-900 text-white relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-800 text-emerald-300 mb-6">
                    <Mail size={32} />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Travel Inspiration</h2>
                <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">
                    Subscribe to our newsletter for the latest travel tips, hidden gems, and exclusive deals delivered straight to your inbox.
                </p>

                <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
                    <input
                        type="email"
                        placeholder="Your email address"
                        className="flex-grow px-6 py-3 rounded-xl bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-400 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                    >
                        Subscribe
                    </button>
                </form>
                <p className="text-emerald-200/60 text-sm mt-4">
                    No spam, we promise. Unsubscribe at any time.
                </p>
            </div>
        </section>
    )
}
