
import Link from 'next/link'
import { MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-white">
                            <MapPin className="text-emerald-500" />
                            <span className="text-xl font-bold">Roving Việt Nam</span>
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            Curating authentic Vietnamese experiences. We connect you with the hidden gems, local culture, and breathtaking landscapes of Vietnam.
                        </p>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Discover</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/tours" className="hover:text-emerald-400 transition-colors">All Tours</Link></li>
                            <li><Link href="/destinations" className="hover:text-emerald-400 transition-colors">Destinations</Link></li>
                            <li><Link href="/blog" className="hover:text-emerald-400 transition-colors">Travel Guide</Link></li>
                            <li><Link href="/about" className="hover:text-emerald-400 transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Support</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/contact" className="hover:text-emerald-400 transition-colors">Contact Us</Link></li>
                            <li><Link href="/faq" className="hover:text-emerald-400 transition-colors">FAQs</Link></li>
                            <li><Link href="/terms" className="hover:text-emerald-400 transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-emerald-400 transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 hover:text-white transition-all">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-all">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="p-2 bg-gray-800 rounded-full hover:bg-sky-500 hover:text-white transition-all">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Roving Việt Nam. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
