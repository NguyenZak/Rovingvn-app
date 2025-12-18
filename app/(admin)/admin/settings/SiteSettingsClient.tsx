/**
 * Site Settings Page - Client Component
 * Trang quản lý thông tin website trong CMS Admin
 */

"use client";

import { useState, useTransition } from "react";
import {
    Save, Globe, Image as ImageIcon, Palette, Mail, Phone, MapPin,
    Facebook, Instagram, Twitter, Youtube, Link2,
    TrendingUp, Shield, X, Check
} from "lucide-react";
import {
    updateSiteSettings,
    type SiteSettings
} from "@/lib/actions/site-settings";
import { LogoFaviconManager } from "./ImageUpload";


interface SiteSettingsClientProps {
    initialSettings: SiteSettings | null;
}

export function SiteSettingsClient({ initialSettings }: SiteSettingsClientProps) {
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form states
    const [basicInfo, setBasicInfo] = useState({
        site_name: initialSettings?.site_name || "",
        site_short_name: initialSettings?.site_short_name || "",
        site_description: initialSettings?.site_description || "",
        site_tagline: initialSettings?.site_tagline || "",
        site_url: initialSettings?.site_url || "",
    });

    const [contact, setContact] = useState({
        contact_email: initialSettings?.contact_email || "",
        contact_phone: initialSettings?.contact_phone || "",
        contact_address: initialSettings?.contact_address || "",
    });

    const [social, setSocial] = useState({
        social_facebook: initialSettings?.social_facebook || "",
        social_instagram: initialSettings?.social_instagram || "",
        social_twitter: initialSettings?.social_twitter || "",
        social_youtube: initialSettings?.social_youtube || "",
        social_tiktok: initialSettings?.social_tiktok || "",
    });

    const [seo, setSeo] = useState({
        meta_keywords: initialSettings?.meta_keywords?.join(", ") || "",
        meta_author: initialSettings?.meta_author || "",
        meta_language: initialSettings?.meta_language || "vi-VN",
        theme_color: initialSettings?.theme_color || "#10b981",
    });

    const [analytics, setAnalytics] = useState({
        google_analytics_id: initialSettings?.google_analytics_id || "",
        facebook_pixel_id: initialSettings?.facebook_pixel_id || "",
        google_tag_manager_id: initialSettings?.google_tag_manager_id || "",
        google_site_verification: initialSettings?.google_site_verification || "",
    });

    const [business, setBusiness] = useState({
        business_type: initialSettings?.business_type || "TravelAgency",
        business_legal_name: initialSettings?.business_legal_name || "",
        business_founding_date: initialSettings?.business_founding_date || "",
        business_vat_id: initialSettings?.business_vat_id || "",
    });

    const handleSaveAll = () => {
        setError(null);
        startTransition(async () => {
            const result = await updateSiteSettings({
                ...basicInfo,
                ...contact,
                ...social,
                ...seo,
                ...analytics,
                ...business,
                meta_keywords: seo.meta_keywords.split(",").map(k => k.trim()).filter(Boolean),
            });

            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 3000);
            } else {
                setError(result.error || "Failed to save settings");
            }
        });
    };

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cấu hình Website</h1>
                    <p className="text-gray-600 mt-1">Quản lý thông tin chung của website</p>
                </div>

                <button
                    onClick={handleSaveAll}
                    disabled={isPending}
                    className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Lưu tất cả
                        </>
                    )}
                </button>
            </div>

            {/* Success/Error Messages */}
            {showSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <Check size={20} className="text-green-600" />
                    Đã lưu thành công!
                </div>
            )}

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center gap-2">
                    <X size={20} className="text-red-600" />
                    {error}
                </div>
            )}

            {/* Basic Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                        <Globe size={20} className="text-emerald-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Thông tin cơ bản</h2>
                        <p className="text-sm text-gray-500">Tên website, mô tả, URL</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên Website *
                            </label>
                            <input
                                type="text"
                                value={basicInfo.site_name}
                                onChange={(e) => setBasicInfo({ ...basicInfo, site_name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Roving Việt Nam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên ngắn gọn
                            </label>
                            <input
                                type="text"
                                value={basicInfo.site_short_name}
                                onChange={(e) => setBasicInfo({ ...basicInfo, site_short_name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="RovingVN"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Mô tả (SEO Description)
                        </label>
                        <textarea
                            value={basicInfo.site_description}
                            onChange={(e) => setBasicInfo({ ...basicInfo, site_description: e.target.value })}
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="Khám phá vẻ đẹp Việt Nam cùng Roving..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Hiển thị trên Google, Facebook khi share</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tagline / Slogan
                            </label>
                            <input
                                type="text"
                                value={basicInfo.site_tagline}
                                onChange={(e) => setBasicInfo({ ...basicInfo, site_tagline: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Experience the beauty of Vietnam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL Website
                            </label>
                            <input
                                type="url"
                                value={basicInfo.site_url}
                                onChange={(e) => setBasicInfo({ ...basicInfo, site_url: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="https://rovingvn.com"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Logo & Favicon */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center">
                        <ImageIcon size={20} className="text-pink-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Logo & Favicon</h2>
                        <p className="text-sm text-gray-500">Upload logo và favicon cho website</p>
                    </div>
                </div>

                <div className="p-6">
                    <LogoFaviconManager
                        logos={{
                            main: initialSettings?.logo_main,
                            dark: initialSettings?.logo_dark,
                            small: initialSettings?.logo_small,
                            text: initialSettings?.logo_text,
                        }}
                        favicons={{
                            ico: initialSettings?.favicon_ico,
                            icon16: initialSettings?.favicon_16,
                            icon32: initialSettings?.favicon_32,
                            icon180: initialSettings?.favicon_180,
                            icon192: initialSettings?.favicon_192,
                            icon512: initialSettings?.favicon_512,
                        }}
                    />
                </div>
            </section>

            {/* Contact Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Mail size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Thông tin liên hệ</h2>
                        <p className="text-sm text-gray-500">Email, số điện thoại, địa chỉ</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Mail size={16} />
                                Email
                            </label>
                            <input
                                type="email"
                                value={contact.contact_email}
                                onChange={(e) => setContact({ ...contact, contact_email: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="info@rovingvn.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Phone size={16} />
                                Số điện thoại
                            </label>
                            <input
                                type="tel"
                                value={contact.contact_phone}
                                onChange={(e) => setContact({ ...contact, contact_phone: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="+84 123 456 789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} />
                                Địa chỉ
                            </label>
                            <input
                                type="text"
                                value={contact.contact_address}
                                onChange={(e) => setContact({ ...contact, contact_address: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Hà Nội, Việt Nam"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Social Media */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Link2 size={20} className="text-purple-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Mạng xã hội</h2>
                        <p className="text-sm text-gray-500">Link đến các trang mạng xã hội</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Facebook size={16} className="text-blue-600" />
                                Facebook
                            </label>
                            <input
                                type="url"
                                value={social.social_facebook}
                                onChange={(e) => setSocial({ ...social, social_facebook: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="https://facebook.com/rovingvn"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Instagram size={16} className="text-pink-600" />
                                Instagram
                            </label>
                            <input
                                type="url"
                                value={social.social_instagram}
                                onChange={(e) => setSocial({ ...social, social_instagram: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="https://instagram.com/rovingvn"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Twitter size={16} className="text-sky-500" />
                                Twitter / X
                            </label>
                            <input
                                type="url"
                                value={social.social_twitter}
                                onChange={(e) => setSocial({ ...social, social_twitter: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="https://twitter.com/rovingvn"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Youtube size={16} className="text-red-600" />
                                YouTube
                            </label>
                            <input
                                type="url"
                                value={social.social_youtube}
                                onChange={(e) => setSocial({ ...social, social_youtube: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="https://youtube.com/@rovingvn"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Settings */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <TrendingUp size={20} className="text-orange-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Cài đặt SEO</h2>
                        <p className="text-sm text-gray-500">Keywords, language, theme color</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Keywords (phân cách bằng dấu phẩy)
                        </label>
                        <textarea
                            value={seo.meta_keywords}
                            onChange={(e) => setSeo({ ...seo, meta_keywords: e.target.value })}
                            rows={2}
                            className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            placeholder="du lịch việt nam, tour việt nam, roving vietnam"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tác giả
                            </label>
                            <input
                                type="text"
                                value={seo.meta_author}
                                onChange={(e) => setSeo({ ...seo, meta_author: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Roving Vietnam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Ngôn ngữ
                            </label>
                            <select
                                value={seo.meta_language}
                                onChange={(e) => setSeo({ ...seo, meta_language: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="vi-VN">Tiếng Việt (vi-VN)</option>
                                <option value="en-US">English (en-US)</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                <Palette size={16} />
                                Theme Color
                            </label>
                            <div className="flex gap-2">
                                <input
                                    type="color"
                                    value={seo.theme_color}
                                    onChange={(e) => setSeo({ ...seo, theme_color: e.target.value })}
                                    className="w-12 h-10 rounded-lg border border-gray-200 cursor-pointer"
                                />
                                <input
                                    type="text"
                                    value={seo.theme_color}
                                    onChange={(e) => setSeo({ ...seo, theme_color: e.target.value })}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                    placeholder="#10b981"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Analytics */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <TrendingUp size={20} className="text-indigo-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Analytics & Tracking</h2>
                        <p className="text-sm text-gray-500">Google Analytics, Facebook Pixel, GTM</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Analytics ID
                            </label>
                            <input
                                type="text"
                                value={analytics.google_analytics_id}
                                onChange={(e) => setAnalytics({ ...analytics, google_analytics_id: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="G-XXXXXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Facebook Pixel ID
                            </label>
                            <input
                                type="text"
                                value={analytics.facebook_pixel_id}
                                onChange={(e) => setAnalytics({ ...analytics, facebook_pixel_id: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Tag Manager ID
                            </label>
                            <input
                                type="text"
                                value={analytics.google_tag_manager_id}
                                onChange={(e) => setAnalytics({ ...analytics, google_tag_manager_id: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="GTM-XXXXXXX"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Google Site Verification
                            </label>
                            <input
                                type="text"
                                value={analytics.google_site_verification}
                                onChange={(e) => setAnalytics({ ...analytics, google_site_verification: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="verification code"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Business Information */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <Shield size={20} className="text-gray-600" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">Thông tin doanh nghiệp</h2>
                        <p className="text-sm text-gray-500">Tên công ty, mã số thuế</p>
                    </div>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tên pháp lý
                            </label>
                            <input
                                type="text"
                                value={business.business_legal_name}
                                onChange={(e) => setBusiness({ ...business, business_legal_name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="Công ty TNHH Du lịch Roving Việt Nam"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mã số thuế
                            </label>
                            <input
                                type="text"
                                value={business.business_vat_id}
                                onChange={(e) => setBusiness({ ...business, business_vat_id: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="0123456789"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Năm thành lập
                            </label>
                            <input
                                type="text"
                                value={business.business_founding_date}
                                onChange={(e) => setBusiness({ ...business, business_founding_date: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                                placeholder="2020"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Loại hình
                            </label>
                            <select
                                value={business.business_type}
                                onChange={(e) => setBusiness({ ...business, business_type: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                            >
                                <option value="TravelAgency">Travel Agency</option>
                                <option value="Organization">Organization</option>
                                <option value="LocalBusiness">Local Business</option>
                            </select>
                        </div>
                    </div>
                </div>
            </section>

            {/* Save Button (Bottom) */}
            <div className="flex justify-end pt-4">
                <button
                    onClick={handleSaveAll}
                    disabled={isPending}
                    className="bg-emerald-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    {isPending ? (
                        <>
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Đang lưu...
                        </>
                    ) : (
                        <>
                            <Save size={20} />
                            Lưu tất cả thay đổi
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
