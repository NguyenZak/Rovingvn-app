import { Star, Quote } from 'lucide-react'
import Image from 'next/image'
import { getPublishedTestimonials } from '@/lib/actions/testimonial-actions'

export async function Testimonials() {
    const { data: testimonials = [] } = await getPublishedTestimonials();

    if (!testimonials || testimonials.length === 0) {
        return null; // Don't render if no testimonials
    }

    return (
        <section className="py-20 md:py-24 bg-emerald-900 text-white relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-emerald-800 rounded-full blur-3xl opacity-50" />
            <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl opacity-20" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Travelers Say</h2>
                    <p className="text-emerald-100/80 text-lg">Don&apos;t just take our word for it. Read reviews from our happy customers.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((review) => (
                        <div key={review.id} className="bg-white/10 backdrop-blur-sm border border-white/10 p-8 rounded-2xl hover:bg-white/15 transition-colors">
                            <div className="flex gap-1 mb-6 text-yellow-400">
                                {[...Array(review.rating)].map((_, i) => <Star key={i} size={18} fill="currentColor" />)}
                            </div>

                            <Quote className="text-emerald-400 mb-4 opacity-50" size={32} />

                            <p className="text-lg leading-relaxed mb-6 italic text-emerald-50">&quot;{review.content}&quot;</p>

                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-400 bg-emerald-950">
                                    <Image
                                        src={review.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(review.name)}&background=random`}
                                        alt={review.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold">{review.name}</h4>
                                    <p className="text-sm text-emerald-200">{review.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
