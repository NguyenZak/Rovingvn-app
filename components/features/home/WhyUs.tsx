
import { Map, Users, Heart, ShieldCheck } from 'lucide-react'

const REASONS = [
    {
        icon: Map,
        title: 'Authentic Experiences',
        description: 'We go beyond the tourist traps to show you the real Vietnam.',
    },
    {
        icon: Users,
        title: 'Local Experts',
        description: 'Our guides are locals who know every corner of their homeland.',
    },
    {
        icon: Heart,
        title: 'Tailored for You',
        description: 'Every itinerary can be customized to your pace and preferences.',
    },
    {
        icon: ShieldCheck,
        title: 'Safe & Reliable',
        description: 'Your safety is our priority. We take care of every detail.',
    },
]

export function WhyUs() {
    return (
        <section className="py-24 bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-2xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Travel with Us?</h2>
                    <p className="text-gray-600 text-lg">We don't just sell tours; we craft unforgettable journeys that connect you with the heart of Vietnam.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {REASONS.map((reason, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 mb-6 group-hover:scale-110 transition-transform duration-300">
                                <reason.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{reason.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
