
import { Save, User, Globe, Shield } from 'lucide-react'

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Settings</h1>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Globe size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Website Information</h2>
                        <p className="text-sm text-gray-500">Contact details displayed on the public site.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                            <input type="text" defaultValue="Roving Việt Nam" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                            <input type="email" defaultValue="hello@rovingvietnam.com" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                            <input type="tel" defaultValue="+84 90 123 4567" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                            <input type="text" defaultValue="123 Old Quarter, Hanoi, Vietnam" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2">
                        <Save size={18} /> Save Changes
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                        <Shield size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Security & Account</h2>
                        <p className="text-sm text-gray-500">Manage your admin access.</p>
                    </div>
                </div>

                <div className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6 max-w-md">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                            <input type="password" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                            <input type="password" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                            <input type="password" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none text-gray-700" />
                        </div>
                    </div>
                </div>
                <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                    <button className="bg-gray-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2">
                        <User size={18} /> Update Password
                    </button>
                </div>
            </div>
        </div>
    )
}
