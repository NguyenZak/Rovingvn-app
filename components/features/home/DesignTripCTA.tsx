
import Link from 'next/link'
import { Sparkles, ArrowRight } from 'lucide-react'

export function DesignTripCTA() {
    return (
        <section className="py-20 md:py-24 bg-emerald-900 relative overflow-hidden">
            {/* Background Decor */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839556828-568ebbd75736?q=80&w=2000')] bg-cover bg-center opacity-10 mix-blend-overlay" />
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2" />

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 bg-emerald-800/50 backdrop-blur text-emerald-100 px-4 py-2 rounded-full mb-6 border border-emerald-700/50">
                    <Sparkles size={16} className="text-yellow-400" />
                    <span className="text-sm font-semibold tracking-wider uppercase">Tailor-Made Journeys</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Create Your Own Vietnam Adventure</h2>
                <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-10">
                    Not finding the perfect tour? Design a trip that matches your exact interests, pace, and schedule.
                </p>

                <Link
                    href="/design-your-trip"
                    className="inline-flex items-center gap-3 bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl shadow-emerald-900/20 group"
                >
                    Start Designing Now
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>
        </section>
    )
}
