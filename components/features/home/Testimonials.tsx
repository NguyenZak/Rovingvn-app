
'use client'

import { Star, Quote } from 'lucide-react'

const REVIEWS = [
    {
        name: 'Sarah Johnson',
        country: 'USA',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
        text: 'The best travel experience of my life! The guides were incredibly knowledgeable and the itinerary was perfect. Vietnam is beautiful.',
        rating: 5
    },
    {
        name: 'Michael Chen',
        country: 'Singapore',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
        text: 'Very professional service. They handled our complex family group booking with ease. Highly recommended for anyone visiting Vietnam.',
        rating: 5
    },
    {
        name: 'Emma Watson',
        country: 'UK',
        image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200',
        text: 'We found hidden gems that weren\'t in any guidebook. The local homestay experience in Sapa was the highlight of our trip.',
        rating: 5
    }
]

export function Testimonials() {
    return (
        <section className="py-20 md:py-24 bg-emerald-900 text-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
                    <p className="text-emerald-100/80 text-lg">Don't just take our word for it. Read reviews from our happy customers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {REVIEWS.map((review, i) => (
                        <div key={i} className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors">
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>

                            <Quote className="text-emerald-400 mb-4 opacity-50" size={32} />

                            <p className="text-lg leading-relaxed mb-6 italic text-emerald-50">"{review.text}"</p>

                            <div className="flex items-center gap-4">
                                <img src={review.image} alt={review.name} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-400" />
                                <div>
                                    <h4 className="font-bold">{review.name}</h4>
                                    <p className="text-sm text-emerald-200">{review.country}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
