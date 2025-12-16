
import { Map, CalendarCheck, Camera, HeartHandshake } from 'lucide-react'

const STEPS = [
    {
        icon: Map,
        title: 'Choose Destination',
        description: 'Browse our curated tours or tell us where you want to go.'
    },
    {
        icon: CalendarCheck,
        title: 'Book Your Trip',
        description: 'Customize your itinerary with our experts and secure your spot.'
    },
    {
        icon: HeartHandshake,
        title: 'We Handle Details',
        description: 'From visas to transfers, we take care of everything for you.'
    },
    {
        icon: Camera,
        title: 'Enjoy Your Journey',
        description: 'Immerse yourself in the experience while we support you 24/7.'
    }
]

export function HowItWorks() {
    return (
        <section className="py-20 md:py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
                    <p className="text-gray-600 text-lg">Your dream vacation is just a few steps away.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {STEPS.map((step, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-emerald-200/50 group-hover:shadow-xl">
                                <step.icon size={32} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                            <p className="text-gray-500 leading-relaxed">{step.description}</p>

                            {index < STEPS.length - 1 && (
                                <div className="hidden lg:block absolute transform translate-x-32 translate-y-8 text-gray-200">
                                    {/* Could add an arrow or line here if position relative was on parent */}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
