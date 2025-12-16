
'use client'

import { useState } from 'react'
import { submitBooking } from '@/app/actions'
import { Check, MapPin, Calendar, Users, Briefcase, ChevronRight, ChevronLeft, Loader2, Send } from 'lucide-react'

const DESTINATIONS = [
    // North
    { id: 'hanoi', name: 'Ha Noi', region: 'North', image: 'https://images.unsplash.com/photo-1599839556828-568ebbd75736?q=80&w=400' },
    { id: 'halong', name: 'Ha Long Bay', region: 'North', image: 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=400' },
    { id: 'sapa', name: 'Sapa', region: 'North', image: 'https://images.unsplash.com/photo-1531742617789-545233157e10?q=80&w=400' },
    { id: 'ninhbinh', name: 'Ninh Binh', region: 'North', image: 'https://images.unsplash.com/photo-1596627885741-285627efc687?q=80&w=400' },
    // Central
    { id: 'hue', name: 'Hue', region: 'Central', image: 'https://images.unsplash.com/photo-1583597380961-460d36c28f32?q=80&w=400' },
    { id: 'danang', name: 'Da Nang', region: 'Central', image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400' },
    { id: 'hoian', name: 'Hoi An', region: 'Central', image: 'https://images.unsplash.com/photo-1565063670637-238478d15443?q=80&w=400' },
    // South
    { id: 'hcmc', name: 'Ho Chi Minh City', region: 'South', image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=400' },
    { id: 'mekong', name: 'Mekong Delta', region: 'South', image: 'https://images.unsplash.com/photo-1627393167123-238478d15443?q=80&w=400' },
    { id: 'phuquoc', name: 'Phu Quoc', region: 'South', image: 'https://images.unsplash.com/photo-1540202404-a67b36c4b2b2?q=80&w=400' },
]

const STYLES = [
    { id: 'cultural', name: 'Cultural Exploration', icon: Briefcase },
    { id: 'adventure', name: 'Adventure & Nature', icon: MapPin },
    { id: 'leisure', name: 'Relaxation & Beach', icon: Calendar },
    { id: 'food', name: 'Culinary Journey', icon: Users },
]

export function CustomTripBuilder() {
    const [step, setStep] = useState(1)
    const [selectedDestinations, setSelectedDestinations] = useState<string[]>([])
    const [duration, setDuration] = useState('7')
    const [travelDate, setTravelDate] = useState('')
    const [selectedStyles, setSelectedStyles] = useState<string[]>([])
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', people: '2', notes: '' })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const toggleDestination = (id: string) => {
        setSelectedDestinations(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        )
    }

    const toggleStyle = (id: string) => {
        setSelectedStyles(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        )
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        const form = new FormData()
        form.append('name', formData.name)
        form.append('email', formData.email)
        form.append('phone', formData.phone)
        form.append('people', formData.people)
        form.append('date', travelDate) // Note: submitBooking might generally ignore this if not mapped, but we'll put it in notes

        // Construct rich notes
        const destNames = DESTINATIONS.filter(d => selectedDestinations.includes(d.id)).map(d => d.name).join(', ')
        const styleNames = STYLES.filter(s => selectedStyles.includes(s.id)).map(s => s.name).join(', ')
        const richNotes = `
      [CUSTOM TRIP INQUIRY]
      Destinations: ${destNames}
      Duration: ${duration} days
      Approx Date: ${travelDate}
      Styles: ${styleNames}
      User Notes: ${formData.notes}
    `
        form.append('message', richNotes)

        const result = await submitBooking(form)

        setLoading(false)
        if (result.success) {
            setSuccess(true)
        } else {
            setError(result.error || 'Failed to submit inquiry')
        }
    }

    if (success) {
        return (
            <div className="max-w-2xl mx-auto text-center py-20 px-4">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Send size={40} />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Request Received!</h2>
                <p className="text-gray-600 text-lg mb-8">
                    We have received your custom trip details. Our travel experts will craft a personalized itinerary for you and contact you shortly.
                </p>
                <button
                    onClick={() => window.location.href = '/'}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                    Return Home
                </button>
            </div>
        )
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-12">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-12 relative">
                <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10" />
                {[1, 2, 3, 4].map((s) => (
                    <div
                        key={s}
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${step >= s ? 'bg-emerald-600 text-white' : 'bg-white border-2 border-gray-200 text-gray-500'
                            }`}
                    >
                        {s}
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10 min-h-[400px]">
                {/* Step 1: Destinations */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Where would you like to go?</h2>
                        <p className="text-gray-700 mb-8 font-medium">Select the destinations you are interested in visiting.</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[500px] overflow-y-auto p-1">
                            {DESTINATIONS.map((dest) => (
                                <div
                                    key={dest.id}
                                    onClick={() => toggleDestination(dest.id)}
                                    className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all ${selectedDestinations.includes(dest.id)
                                        ? 'border-emerald-500 scale-95 opacity-100'
                                        : 'border-transparent hover:scale-105 opacity-90 hover:opacity-100'
                                        }`}
                                >
                                    <div className="aspect-square bg-gray-100">
                                        <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute bottom-3 left-3 text-white">
                                        <span className="text-xs uppercase text-gray-100 font-medium">{dest.region}</span>
                                        <h3 className="font-bold">{dest.name}</h3>
                                    </div>
                                    {selectedDestinations.includes(dest.id) && (
                                        <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-1">
                                            <Check size={16} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {selectedDestinations.length === 0 && (
                            <p className="text-red-500 text-sm mt-4 text-center">Please select at least one destination.</p>
                        )}
                    </div>
                )}

                {/* Step 2: Details */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">When and How Long?</h2>
                        <p className="text-gray-700 mb-8 font-medium">Help us plan the perfect timeline for your trip.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Duration (Days)</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[5, 7, 10, 14, 21].map((d) => (
                                        <button
                                            key={d}
                                            onClick={() => setDuration(d.toString())}
                                            className={`py-3 rounded-xl border font-medium transition-all ${duration === d.toString()
                                                ? 'bg-emerald-600 text-white border-emerald-600'
                                                : 'bg-white border-gray-200 hover:border-emerald-500 text-gray-600'
                                                }`}
                                        >
                                            {d} Days
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-4">
                                    <input
                                        type="range"
                                        min="3"
                                        max="30"
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full accent-emerald-600"
                                    />
                                    <div className="text-center mt-2 font-bold text-emerald-600">{duration} Days</div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Approximate Start Date</label>
                                <input
                                    type="date"
                                    value={travelDate}
                                    onChange={(e) => setTravelDate(e.target.value)}
                                    className="w-full px-4 py-3 font-medium text-gray-600 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="mt-10">
                            <h3 className="font-bold text-lg mb-4 text-gray-900">Travel Style</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => toggleStyle(style.id)}
                                        className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${selectedStyles.includes(style.id)
                                            ? 'bg-emerald-50 border-emerald-500 text-emerald-700'
                                            : 'bg-white border-gray-200 hover:border-emerald-300 text-gray-600'
                                            }`}
                                    >
                                        <style.icon size={24} />
                                        <span className="text-sm font-medium">{style.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: Contact Info (Review included implicitly) */}
                {step === 3 && (
                    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">Final Details</h2>
                        <p className="text-gray-700 mb-8 font-medium">How can we reach you with your custom itinerary?</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                <input
                                    value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required className="w-full px-4 py-3 font-medium text-gray-600 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="John Doe"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <input
                                    value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    type="email" required className="w-full px-4 py-3 font-medium text-gray-600 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="john@example.com"
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone / WhatsApp</label>
                                <input
                                    value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    type="tel" required className="w-full px-4 py-3 font-medium text-gray-600 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="+84 ..."
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                                <input
                                    value={formData.people} onChange={(e) => setFormData({ ...formData, people: e.target.value })}
                                    type="number" min="1" required className="w-full px-4 py-3 font-medium text-gray-600 rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                />
                            </div>
                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                                <textarea
                                    value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows={4} className="w-full px-4 py-3 text-gray-600 font-medium rounded-xl border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none" placeholder="Special requirements, specific hotels, dietary restrictions..."
                                />
                            </div>
                        </div>

                        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
                    </div>
                )}

                {/* Step 4: Summary before submit (or simpler, just submit at step 3) */}
                {/* Let's keep it 3 steps for simplicity: Select -> Details -> Contact & Submit */}

                <div className="mt-12 flex justify-between pt-6 border-t border-gray-100">
                    {step > 1 ? (
                        <button
                            onClick={() => setStep(s => s - 1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 font-medium px-4 py-2"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>
                    ) : <div />}

                    {step < 3 ? (
                        <button
                            onClick={() => {
                                if (step === 1 && selectedDestinations.length === 0) return // Validate step 1
                                setStep(s => s + 1)
                            }}
                            disabled={step === 1 && selectedDestinations.length === 0}
                            className="bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next Step <ChevronRight size={20} />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !formData.name || !formData.email || !formData.phone}
                            className="bg-emerald-600 text-white px-10 py-3 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-200 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                            Submit Request
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
