/**
 * Dynamic Site Configuration
 * Đọc cấu hình từ database thay vì hardcode
 */

import { getSiteSettings } from "@/lib/actions/site-settings";
import { cache } from "react";

// Cache settings để tránh query nhiều lần
export const getCachedSiteSettings = cache(async () => {
    return await getSiteSettings();
});

/**
 * Get site config with fallback to defaults
 * Lấy cấu hình từ DB, nếu không có thì dùng default
 */
export async function getDynamicSiteConfig() {
    const dbSettings = await getCachedSiteSettings();

    // Default fallback values
    const defaults = {
        name: "Roving Việt Nam",
        shortName: "RovingVN",
        description: "Khám phá vẻ đẹp Việt Nam cùng Roving - Trải nghiệm du lịch độc đáo và chuyên nghiệp",
        tagline: "Experience the beauty of Vietnam",
        url: "https://rovingvn.com",
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rovingvn.com",

        logo: {
            main: "/images/logo.png",
            dark: "/images/logo-dark.png",
            small: "/images/logo-small.png",
            text: "/images/logo-text.png",
        },

        favicon: {
            icon16: "/favicon-16x16.png",
            icon32: "/favicon-32x32.png",
            appleTouchIcon: "/apple-touch-icon.png",
            android192: "/android-chrome-192x192.png",
            android512: "/android-chrome-512x512.png",
            ico: "/favicon.ico",
        },

        og: {
            defaultImage: "/images/og-image.jpg",
            imageWidth: 1200,
            imageHeight: 630,
        },

        contact: {
            email: "info@rovingvn.com",
            phone: "+84 123 456 789",
            address: "Hà Nội, Việt Nam",
        },

        social: {
            facebook: "https://facebook.com/rovingvn",
            instagram: "https://instagram.com/rovingvn",
            twitter: "https://twitter.com/rovingvn",
            youtube: "https://youtube.com/@rovingvn",
            tiktok: "https://tiktok.com/@rovingvn",
        },

        metadata: {
            keywords: [
                "du lịch việt nam",
                "tour việt nam",
                "roving vietnam",
                "travel vietnam",
                "vietnam tours",
                "khám phá việt nam",
            ],
            author: "Roving Vietnam",
            language: "vi-VN",
            themeColor: "#10b981",
            backgroundColor: "#ffffff",
        },

        business: {
            type: "TravelAgency",
            name: "Roving Việt Nam",
            legalName: "Công ty TNHH Du lịch Roving Việt Nam",
            foundingDate: "2020",
            vatId: "0123456789",
        },

        analytics: {
            googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
            facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
            googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || "",
        },

        features: {
            blog: true,
            tours: true,
            customTrips: true,
            newsletter: true,
            reviews: true,
        },
    };

    // Merge DB settings with defaults
    if (!dbSettings) {
        return defaults;
    }

    return {
        name: dbSettings.site_name || defaults.name,
        shortName: dbSettings.site_short_name || defaults.shortName,
        description: dbSettings.site_description || defaults.description,
        tagline: dbSettings.site_tagline || defaults.tagline,
        url: dbSettings.site_url || defaults.url,
        siteUrl: dbSettings.site_url || defaults.siteUrl,

        logo: {
            main: dbSettings.logo_main || defaults.logo.main,
            dark: dbSettings.logo_dark || defaults.logo.dark,
            small: dbSettings.logo_small || defaults.logo.small,
            text: dbSettings.logo_text || defaults.logo.text,
        },

        favicon: {
            icon16: dbSettings.favicon_16 || defaults.favicon.icon16,
            icon32: dbSettings.favicon_32 || defaults.favicon.icon32,
            appleTouchIcon: dbSettings.favicon_180 || defaults.favicon.appleTouchIcon,
            android192: dbSettings.favicon_192 || defaults.favicon.android192,
            android512: dbSettings.favicon_512 || defaults.favicon.android512,
            ico: dbSettings.favicon_ico || defaults.favicon.ico,
        },

        og: {
            defaultImage: dbSettings.og_image || defaults.og.defaultImage,
            imageWidth: dbSettings.og_image_width || defaults.og.imageWidth,
            imageHeight: dbSettings.og_image_height || defaults.og.imageHeight,
        },

        contact: {
            email: dbSettings.contact_email || defaults.contact.email,
            phone: dbSettings.contact_phone || defaults.contact.phone,
            address: dbSettings.contact_address || defaults.contact.address,
        },

        social: {
            facebook: dbSettings.social_facebook || defaults.social.facebook,
            instagram: dbSettings.social_instagram || defaults.social.instagram,
            twitter: dbSettings.social_twitter || defaults.social.twitter,
            youtube: dbSettings.social_youtube || defaults.social.youtube,
            tiktok: dbSettings.social_tiktok || defaults.social.tiktok,
        },

        metadata: {
            keywords: dbSettings.meta_keywords || defaults.metadata.keywords,
            author: dbSettings.meta_author || defaults.metadata.author,
            language: dbSettings.meta_language || defaults.metadata.language,
            themeColor: dbSettings.theme_color || defaults.metadata.themeColor,
            backgroundColor: dbSettings.background_color || defaults.metadata.backgroundColor,
        },

        business: {
            type: dbSettings.business_type || defaults.business.type,
            name: dbSettings.site_name || defaults.business.name,
            legalName: dbSettings.business_legal_name || defaults.business.legalName,
            foundingDate: dbSettings.business_founding_date || defaults.business.foundingDate,
            vatId: dbSettings.business_vat_id || defaults.business.vatId,
        },

        analytics: {
            googleAnalyticsId: dbSettings.google_analytics_id || defaults.analytics.googleAnalyticsId,
            facebookPixelId: dbSettings.facebook_pixel_id || defaults.analytics.facebookPixelId,
            googleTagManagerId: dbSettings.google_tag_manager_id || defaults.analytics.googleTagManagerId,
        },

        features: {
            ...defaults.features,
            ...((dbSettings.features as unknown as Record<string, boolean>) || {}),
        },
    };
}

// Export static config for backward compatibility
// This will be used as fallback when DB is not available
export { siteConfig } from "./site-config-static";
