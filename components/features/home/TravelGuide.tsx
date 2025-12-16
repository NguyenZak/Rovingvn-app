
import Link from 'next/link'
import { FileText, Sun, Wallet, Bus } from 'lucide-react'

const GUIDES = [
    {
        icon: FileText,
        title: 'Visa & Entry',
        description: 'Everything you need to know about Vietnam E-Visa and entry requirements.',
        color: 'bg-blue-100 text-blue-600'
    },
    {
        icon: Sun,
        title: 'Weather & Seasons',
        description: 'Best time to visit Northern, Central, and Southern Vietnam.',
        color: 'bg-amber-100 text-amber-600'
    },
    {
        icon: Wallet,
        title: 'Currency & Tips',
        description: 'Guide to VND, ATMs, and tipping customs in Vietnam.',
        color: 'bg-green-100 text-green-600'
    },
    {
        icon: Bus,
        title: 'Getting Around',
        description: 'Moving between cities and local transport options.',
        color: 'bg-purple-100 text-purple-600'
    }
]

export function TravelGuide() {
    return (
        <section className="py-20 md:py-24 bg-white border-t border-gray-100">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-end justify-between mb-12">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Travel Guide</h2>
                        <p className="text-gray-600 text-lg">Essential information to plan your trip to Vietnam wisely.</p>
                    </div>

                    <Link href="/blog?category=guide" className="hidden md:inline-block px-6 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                        View All Guides
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {GUIDES.map((guide, i) => (
                        <div key={i} className="group p-8 rounded-3xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:border-emerald-100 transition-all duration-300">
                            <div className={`w-14 h-14 ${guide.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <guide.icon size={28} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">{guide.title}</h3>
                            <p className="text-gray-500 leading-relaxed mb-6">
                                {guide.description}
                            </p>
                            <Link href="#" className="inline-flex items-center text-sm font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                                Read More <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>
                        </div>
                    ))}
                </div>

                <div className="mt-8 md:hidden text-center">
                    <Link href="/blog?category=guide" className="inline-block px-6 py-3 rounded-xl border border-gray-200 font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:text-emerald-700 transition-colors">
                        View All Guides
                    </Link>
                </div>
            </div>
        </section>
    )
}
