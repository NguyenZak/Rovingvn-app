'use client'

import { Award, Heart, Users, Globe, Shield, Leaf, Star, TrendingUp, MapPin, Calendar } from 'lucide-react'
import Link from 'next/link'

interface AboutContent {
    hero?: {
        title?: string
        subtitle?: string
    }
    story?: {
        heading?: string
        paragraphs?: string[]
    }
    stats?: Array<{
        value: string
        label: string
        color?: 'emerald' | 'teal' | 'cyan'
    }>
    mission_vision?: {
        mission?: string
        vision?: string
    }
    values?: Array<{
        title: string
        description: string
        icon?: 'Award' | 'Star' | 'Leaf' | 'Users'
    }>
    why_choose_us?: Array<{
        title: string
        description: string
        icon?: 'Shield' | 'MapPin' | 'TrendingUp'
    }>
}

interface AboutClientProps {
    content?: AboutContent
}

export default function AboutClient({ content }: AboutClientProps) {
    // Defaults matching original hardcoded content
    const heroTitle = content?.hero?.title || "About Roving Vietnam"
    const heroSubtitle = content?.hero?.subtitle || "Crafting unforgettable journeys through the heart and soul of Vietnam"

    const storyHeading = content?.story?.heading || "Our Story"
    const storyParagraphs = content?.story?.paragraphs || [
        "Roving Vietnam was born from a deep passion for sharing the rich tapestry of Vietnamese culture, breathtaking landscapes, and warm hospitality with travelers from around the world. Our journey began with a simple belief: every traveler deserves an authentic, meaningful connection with the places they visit.",
        "What started as a small team of local guides has grown into a premier travel company, dedicated to curating exceptional experiences that go beyond the typical tourist experience. We pride ourselves on our intimate knowledge of Vietnam's hidden gems, our commitment to sustainable tourism, and our ability to create personalized journeys that resonate with each traveler's unique interests.",
        "Today, we continue to innovate and expand our offerings while staying true to our core values: showcasing the authentic Vietnam, supporting local communities, and creating memories that last a lifetime."
    ]

    const stats = content?.stats || [
        { value: "10+", label: "Years Experience", color: "emerald" },
        { value: "50K+", label: "Happy Travelers", color: "teal" },
        { value: "200+", label: "Tours Offered", color: "cyan" },
        { value: "63", label: "Destinations", color: "emerald" }
    ]

    const mission = content?.mission_vision?.mission || "To provide authentic, sustainable, and transformative travel experiences that connect people with the true essence of Vietnam while supporting local communities and preserving cultural heritage for future generations."
    const vision = content?.mission_vision?.vision || "To be recognized as the leading travel company in Vietnam, known for exceptional service, innovative itineraries, and our unwavering commitment to sustainable tourism that benefits both travelers and local communities."

    const values = content?.values || [
        { title: "Excellence", description: "We strive for the highest standards in every aspect of our service, from planning to execution.", icon: "Award" },
        { title: "Authenticity", description: "We showcase the real Vietnam, connecting travelers with genuine local experiences and culture.", icon: "Star" },
        { title: "Sustainability", description: "We are committed to responsible tourism that protects the environment and benefits local communities.", icon: "Leaf" },
        { title: "Customer Focus", description: "Your satisfaction and memorable experiences are at the heart of everything we do.", icon: "Users" }
    ]

    const whyChooseUs = content?.why_choose_us || [
        { title: "Safe & Secure", description: "24/7 support and comprehensive travel insurance for complete peace of mind throughout your journey.", icon: "Shield" },
        { title: "Local Expertise", description: "Our team of experienced local guides knows Vietnam inside out, revealing hidden treasures.", icon: "MapPin" },
        { title: "Best Value", description: "Premium experiences at competitive prices with no hidden fees, ensuring exceptional value.", icon: "TrendingUp" }
    ]

    // Helper to render dynamic icons
    const renderIcon = (iconName: string, className: string) => {
        const icons: Record<string, React.ElementType> = { Award, Star, Leaf, Users, Shield, MapPin, TrendingUp, Heart, Globe }
        const IconComponent = icons[iconName] || Star
        return <IconComponent className={className} />
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-24 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
                            {heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl text-emerald-50 leading-relaxed">
                            {heroSubtitle}
                        </p>
                    </div>
                </div>
            </div>

            {/* Company Story Section */}
            <section className="py-20 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">{storyHeading}</h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-8"></div>
                        </div>

                        <div className="prose prose-lg max-w-none">
                            {storyParagraphs.map((paragraph, idx) => (
                                <p key={idx} className="text-lg text-slate-600 leading-relaxed mb-6">
                                    {paragraph}
                                </p>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center transform hover:scale-105 transition-transform duration-300">
                                <div className={`text-5xl md:text-6xl font-bold text-${stat.color || 'emerald'}-600 mb-2`}>{stat.value}</div>
                                <div className="text-slate-600 font-semibold">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision Section */}
            <section className="py-20 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Mission */}
                        <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-3xl flex items-center justify-center mb-6">
                                <Heart className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-6">Our Mission</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {mission}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white rounded-3xl p-10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-3xl flex items-center justify-center mb-6">
                                <Globe className="w-10 h-10 text-white" />
                            </div>
                            <h3 className="text-3xl font-bold text-slate-800 mb-6">Our Vision</h3>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                {vision}
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core Values Section */}
            <section className="py-20 md:py-24 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Our Core Values</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-8"></div>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
                        {values.map((item, idx) => {
                            // Determine gradient colors based on index or randomness for variety, 
                            // or verify if we want them consistent. Original had different colors.
                            // For simplicity, let's rotate through a few presets if not specified,
                            // or just use one standard. The original code had specific colors per item.
                            // I'll keep it simple or match close to original if possible.
                            const gradients = [
                                "from-amber-400 to-orange-500",
                                "from-emerald-400 to-teal-500",
                                "from-green-400 to-emerald-600",
                                "from-violet-400 to-purple-500"
                            ]
                            const gradientClass = gradients[idx % gradients.length]

                            return (
                                <div key={idx} className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                                    <div className={`w-16 h-16 bg-gradient-to-br ${gradientClass} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                        {renderIcon(item.icon || 'Star', "w-8 h-8 text-white")}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* Why Choose Us Section */}
            <section className="py-20 md:py-24">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6">Why Choose Roving Vietnam</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto mb-8"></div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        {whyChooseUs.map((item, idx) => {
                            const colors = [
                                { bg: "from-emerald-100 to-teal-100", text: "emerald-600" },
                                { bg: "from-teal-100 to-cyan-100", text: "teal-600" },
                                { bg: "from-cyan-100 to-blue-100", text: "cyan-600" }
                            ]
                            const color = colors[idx % colors.length]
                            return (
                                <div key={idx} className="text-center">
                                    <div className={`w-24 h-24 bg-gradient-to-br ${color.bg} rounded-full flex items-center justify-center mx-auto mb-6`}>
                                        {renderIcon(item.icon || 'Star', `w-12 h-12 text-${color.text}`)}
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-800 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">
                                        {item.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 md:py-24 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Explore Vietnam?</h2>
                        <p className="text-xl md:text-2xl text-emerald-50 mb-10 leading-relaxed">
                            Let us help you craft the perfect Vietnamese adventure tailored to your dreams
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link
                                href="/design-your-trip"
                                className="inline-flex items-center gap-2 bg-white text-emerald-600 font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <Calendar className="w-5 h-5" />
                                Design Your Trip
                            </Link>
                            <Link
                                href="/tours"
                                className="inline-flex items-center gap-2 bg-emerald-700/50 backdrop-blur-sm border-2 border-white text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:bg-emerald-700/70 hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                            >
                                <MapPin className="w-5 h-5" />
                                Browse Tours
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
            `}</style>
        </div>
    )
}
