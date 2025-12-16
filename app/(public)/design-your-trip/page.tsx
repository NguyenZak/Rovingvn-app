
import { CustomTripBuilder } from '@/components/features/custom-tour/CustomTripBuilder'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Design Your Custom Trip | Roving Vietnam',
    description: 'Create your perfect Vietnam itinerary. Select your destinations, preferences, and let our experts handle the rest.',
}

export default function DesignYourTripPage() {
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="bg-emerald-900 py-16 text-white text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Design Your Dream Trip</h1>
                <p className="text-emerald-100 text-xl max-w-2xl mx-auto px-4">
                    Tell us where you want to go and what you love to do. We'll build a unique itinerary just for you.
                </p>
            </div>

            <div className="-mt-10">
                <CustomTripBuilder />
            </div>

            <div className="container mx-auto px-4 py-16 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Why Customize With Us?</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-emerald-600 mb-2">Tailor-Made to Perfection</h4>
                        <p className="text-gray-700 text-sm">Every detail is adjusted to your pace, interests, and budget.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-emerald-600 mb-2">Local Expertise</h4>
                        <p className="text-gray-700 text-sm">Our team knows the hidden gems and best times to avoid crowds.</p>
                    </div>
                    <div className="bg-white p-6 rounded-2xl shadow-sm">
                        <h4 className="font-bold text-emerald-600 mb-2">24/7 Support</h4>
                        <p className="text-gray-700 text-sm">Travel with peace of mind knowing we are always just a call away.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
