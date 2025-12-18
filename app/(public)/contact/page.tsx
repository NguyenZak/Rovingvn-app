'use client'

import { useState } from 'react'
import { submitContactForm, type ContactFormData } from '@/lib/actions/contact-actions'
import { MapPin, Phone, Mail, Clock } from 'lucide-react'

export default function ContactPage() {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitStatus, setSubmitStatus] = useState<{
        type: 'success' | 'error' | null
        message: string
    }>({ type: null, message: '' })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        setSubmitStatus({ type: null, message: '' })

        const result = await submitContactForm(formData)

        if (result.success) {
            setSubmitStatus({ type: 'success', message: result.message })
            setFormData({ name: '', email: '', phone: '', subject: '', message: '' })
        } else {
            setSubmitStatus({ type: 'error', message: result.message })
        }

        setIsSubmitting(false)
    }

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value,
        }))
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
                <div className="container mx-auto px-4 relative z-10">
                    <h1 className="text-5xl md:text-6xl font-bold mb-4 animate-fade-in">
                        Contact Us
                    </h1>
                    <p className="text-xl md:text-2xl text-emerald-50 max-w-2xl">
                        We are always ready to help you plan your perfect trip
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {/* Contact Info Cards */}
                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-6">
                            <MapPin className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Address</h3>
                        <p className="text-slate-600 leading-relaxed">
                            123 Nguyen Hue Street<br />
                            District 1, Ho Chi Minh City<br />
                            Vietnam
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-2xl flex items-center justify-center mb-6">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Phone</h3>
                        <p className="text-slate-600 leading-relaxed">
                            Hotline: +84 123 456 789<br />
                            Mobile: +84 987 654 321<br />
                            Fax: +84 028 1234 5678
                        </p>
                    </div>

                    <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-violet-400 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                            <Mail className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-3">Email</h3>
                        <p className="text-slate-600 leading-relaxed">
                            info@rovingvietnam.com<br />
                            support@rovingvietnam.com<br />
                            booking@rovingvietnam.com
                        </p>
                    </div>
                </div>

                {/* Contact Form Section */}
                <div className="grid md:grid-cols-5 gap-12 items-start">
                    {/* Working Hours */}
                    <div className="md:col-span-2">
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 sticky top-8">
                            <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                                <Clock className="w-8 h-8 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Working Hours</h3>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                    <span className="font-semibold text-slate-700">Monday - Friday</span>
                                    <span className="text-slate-600">8:00 - 18:00</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                    <span className="font-semibold text-slate-700">Saturday</span>
                                    <span className="text-slate-600">9:00 - 17:00</span>
                                </div>
                                <div className="flex justify-between items-center py-3 border-b border-emerald-200">
                                    <span className="font-semibold text-slate-700">Sunday</span>
                                    <span className="text-slate-600">9:00 - 15:00</span>
                                </div>
                            </div>

                            <div className="mt-8 p-6 bg-white rounded-xl border-2 border-emerald-200">
                                <h4 className="font-bold text-slate-800 mb-2">Emergency Support</h4>
                                <p className="text-slate-600 text-sm mb-3">
                                    We provide 24/7 support service for emergency cases during your trip
                                </p>
                                <p className="font-bold text-emerald-600 text-lg">
                                    +84 900 123 456
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-3">
                        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
                            <h2 className="text-3xl font-bold text-slate-800 mb-2">Send us a Message</h2>
                            <p className="text-slate-600 mb-8">
                                Fill in the information below and we will get back to you as soon as possible
                            </p>

                            {submitStatus.type && (
                                <div
                                    className={`mb-6 p-4 rounded-xl ${submitStatus.type === 'success'
                                        ? 'bg-emerald-50 text-emerald-800 border-2 border-emerald-200'
                                        : 'bg-red-50 text-red-800 border-2 border-red-200'
                                        }`}
                                >
                                    {submitStatus.message}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                            placeholder="email@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            id="phone"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                            placeholder="+84 123 456 789"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none"
                                            placeholder="Tour consultation request"
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={6}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all outline-none resize-none"
                                        placeholder="Enter your message here..."
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center justify-center">
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Sending...
                                        </span>
                                    ) : (
                                        'Send Message'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-16">
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="aspect-[21/9] bg-gradient-to-br from-slate-100 to-slate-200 relative">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.3193499856583!2d106.69831731533443!3d10.782682792320164!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f4b3330bcc7%3A0xb9f9c09775db96c7!2zTmd1eeG7hW4gSHXhu4csIFF1YW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5o!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                className="absolute inset-0"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

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
