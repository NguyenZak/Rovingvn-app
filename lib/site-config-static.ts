/**
 * Site Configuration
 * Cấu hình thông tin chung của website
 * 
 * Thay đổi các thông tin này để cập nhật logo, favicon, metadata, v.v.
 */

export const siteConfig = {
    // Thông tin cơ bản
    name: "Roving Việt Nam",
    shortName: "RovingVN",
    description: "Khám phá vẻ đẹp Việt Nam cùng Roving - Trải nghiệm du lịch độc đáo và chuyên nghiệp",
    tagline: "Experience the beauty of Vietnam",

    // URL
    url: "https://rovingvn.com", // Thay đổi bằng domain thực của bạn
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://rovingvn.com",

    // Logo & Branding
    logo: {
        // Logo chính (header, navigation)
        main: "/images/logo.png",
        // Logo tối (cho dark mode)
        dark: "/images/logo-dark.png",
        // Logo nhỏ (mobile, sidebar)
        small: "/images/logo-small.png",
        // Logo văn bản
        text: "/images/logo-text.png",
    },

    // Favicon (các kích thước khác nhau)
    favicon: {
        // Favicon 16x16
        icon16: "/favicon-16x16.png",
        // Favicon 32x32
        icon32: "/favicon-32x32.png",
        // Apple Touch Icon
        appleTouchIcon: "/apple-touch-icon.png",
        // Android Chrome Icons
        android192: "/android-chrome-192x192.png",
        android512: "/android-chrome-512x512.png",
        // Favicon cũ (ICO)
        ico: "/favicon.ico",
    },

    // Open Graph Images (cho social media)
    og: {
        // Hình ảnh mặc định khi share lên Facebook, Twitter, v.v.
        defaultImage: "/images/og-image.jpg",
        // Kích thước khuyến nghị: 1200x630
        imageWidth: 1200,
        imageHeight: 630,
    },

    // Thông tin liên hệ
    contact: {
        email: "info@rovingvn.com",
        phone: "+84 123 456 789",
        address: "Hà Nội, Việt Nam",
    },

    // Social Media
    social: {
        facebook: "https://facebook.com/rovingvn",
        instagram: "https://instagram.com/rovingvn",
        twitter: "https://twitter.com/rovingvn",
        youtube: "https://youtube.com/@rovingvn",
        tiktok: "https://tiktok.com/@rovingvn",
    },

    // SEO Metadata mặc định
    metadata: {
        // Keywords chính
        keywords: [
            "du lịch việt nam",
            "tour việt nam",
            "roving vietnam",
            "travel vietnam",
            "vietnam tours",
            "khám phá việt nam",
        ],
        // Tác giả
        author: "Roving Vietnam",
        // Ngôn ngữ
        language: "vi-VN",
        // Theme color (cho mobile browsers)
        themeColor: "#10b981", // Màu xanh lá chủ đạo
        // Background color
        backgroundColor: "#ffffff",
    },

    // Business Information (Schema.org)
    business: {
        type: "TravelAgency",
        name: "Roving Việt Nam",
        legalName: "Công ty TNHH Du lịch Roving Việt Nam",
        foundingDate: "2020",
        vatId: "0123456789", // Mã số thuế
    },

    // Analytics & Tracking
    analytics: {
        googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID || "",
        facebookPixelId: process.env.NEXT_PUBLIC_FB_PIXEL_ID || "",
        googleTagManagerId: process.env.NEXT_PUBLIC_GTM_ID || "",
    },

    // Features flags
    features: {
        blog: true,
        tours: true,
        customTrips: true,
        newsletter: true,
        reviews: true,
    },
};

export type SiteConfig = typeof siteConfig;
