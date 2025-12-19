import Link from 'next/link'
import Image from 'next/image'
import { MapPin, Facebook, Instagram, Twitter, Mail, Phone, MessageCircle } from 'lucide-react'
import { getSiteSettings } from '@/lib/actions/site-settings'

export async function Footer() {
    const settings = await getSiteSettings()

    return (
        <footer className="bg-gray-900 text-gray-300 py-12 border-t border-gray-800">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2 text-white">
                            {settings?.logo_main ? (
                                <Image
                                    src={settings.logo_main}
                                    alt={settings.site_name || 'Logo'}
                                    width={150}
                                    height={50}
                                    className="h-8 w-auto object-contain brightness-0 invert"
                                    unoptimized
                                />
                            ) : (
                                <>
                                    <MapPin className="text-emerald-500" />
                                    <span className="text-xl font-bold">{settings?.site_name || 'Roving Việt Nam'}</span>
                                </>
                            )}
                        </Link>
                        <p className="text-sm leading-relaxed text-gray-400">
                            {settings?.site_description || 'Curating authentic Vietnamese experiences. We connect you with the hidden gems, local culture, and breathtaking landscapes of Vietnam.'}
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
                        <h3 className="text-white font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3 text-sm">
                            {settings?.contact_email && (
                                <li className="flex items-center gap-2">
                                    <Mail size={16} className="text-emerald-500 flex-shrink-0" />
                                    <a href={`mailto:${settings.contact_email}`} className="hover:text-emerald-400 transition-colors">
                                        {settings.contact_email}
                                    </a>
                                </li>
                            )}
                            {settings?.contact_phone && (
                                <li className="flex items-center gap-2">
                                    <Phone size={16} className="text-emerald-500 flex-shrink-0" />
                                    <a href={`tel:${settings.contact_phone}`} className="hover:text-emerald-400 transition-colors">
                                        {settings.contact_phone}
                                    </a>
                                </li>
                            )}
                            {settings?.contact_phone && (
                                <li className="flex items-center gap-2">
                                    <MessageCircle size={16} className="text-emerald-500 flex-shrink-0" />
                                    <a
                                        href={`https://wa.me/${settings.contact_phone.replace(/[^0-9]/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:text-emerald-400 transition-colors"
                                    >
                                        WhatsApp
                                    </a>
                                </li>
                            )}
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-semibold mb-4">Connect</h3>
                        <div className="flex gap-4">
                            {settings?.social_facebook && (
                                <a
                                    href={settings.social_facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-emerald-600 hover:text-white transition-all"
                                >
                                    <Facebook size={20} />
                                </a>
                            )}
                            {settings?.social_instagram && (
                                <a
                                    href={settings.social_instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-pink-600 hover:text-white transition-all"
                                >
                                    <Instagram size={20} />
                                </a>
                            )}
                            {settings?.social_twitter && (
                                <a
                                    href={settings.social_twitter}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2 bg-gray-800 rounded-full hover:bg-sky-500 hover:text-white transition-all"
                                >
                                    <Twitter size={20} />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Company Information */}
                {(settings?.business_legal_name || settings?.business_vat_id || settings?.contact_address) && (
                    <div className="pt-8 border-t border-gray-800">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                            {settings?.business_legal_name && (
                                <div>
                                    <span className="text-gray-500">Company:</span>{' '}
                                    <span className="text-gray-300">{settings.business_legal_name}</span>
                                </div>
                            )}
                            {settings?.business_vat_id && (
                                <div>
                                    <span className="text-gray-500">Tax ID:</span>{' '}
                                    <span className="text-gray-300">{settings.business_vat_id}</span>
                                </div>
                            )}
                            {settings?.contact_address && (
                                <div>
                                    <span className="text-gray-500">Address:</span>{' '}
                                    <span className="text-gray-300">{settings.contact_address}</span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} {settings?.site_name || 'Roving Việt Nam'}. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}
