/**
 * Metadata Generator
 * Tạo metadata động cho từng trang
 */

import { Metadata, Viewport } from "next";
import { siteConfig } from "./site-config";

interface MetadataProps {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    keywords?: string[];
    type?: "website" | "article";
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    noIndex?: boolean;
}

/**
 * Generate metadata for a page
 * Sử dụng trong page.tsx hoặc layout.tsx
 * 
 * @example
 * export const metadata = generateMetadata({
 *   title: "Trang chủ",
 *   description: "Khám phá tour du lịch",
 * });
 */
export function generateMetadata(props: MetadataProps = {}): Metadata {
    const {
        title,
        description = siteConfig.description,
        image = `${siteConfig.siteUrl}${siteConfig.og.defaultImage}`,
        url = siteConfig.siteUrl,
        keywords = siteConfig.metadata.keywords,
        type = "website",
        author = siteConfig.metadata.author,
        publishedTime,
        modifiedTime,
        noIndex = false,
    } = props;

    // Tạo title đầy đủ
    const fullTitle = title
        ? `${title} | ${siteConfig.name}`
        : `${siteConfig.name} - ${siteConfig.tagline}`;

    const metadata: Metadata = {
        // Basic metadata
        title: fullTitle,
        description,
        keywords: keywords.join(", "),
        authors: [{ name: author }],

        // Application name
        applicationName: siteConfig.name,

        // Generator
        generator: "Next.js",

        // Referrer
        referrer: "origin-when-cross-origin",



        // Robots
        robots: noIndex
            ? {
                index: false,
                follow: false,
            }
            : {
                index: true,
                follow: true,
                googleBot: {
                    index: true,
                    follow: true,
                    "max-video-preview": -1,
                    "max-image-preview": "large",
                    "max-snippet": -1,
                },
            },

        // Icons
        icons: {
            icon: [
                {
                    url: siteConfig.favicon.icon16,
                    sizes: "16x16",
                    type: "image/png",
                },
                {
                    url: siteConfig.favicon.icon32,
                    sizes: "32x32",
                    type: "image/png",
                },
                {
                    url: siteConfig.favicon.ico,
                    sizes: "any",
                },
            ],
            apple: [
                {
                    url: siteConfig.favicon.appleTouchIcon,
                    sizes: "180x180",
                    type: "image/png",
                },
            ],
            other: [
                {
                    rel: "android-chrome-192x192",
                    url: siteConfig.favicon.android192,
                },
                {
                    rel: "android-chrome-512x512",
                    url: siteConfig.favicon.android512,
                },
            ],
        },

        // Manifest
        manifest: "/manifest.json",

        // Open Graph
        openGraph: {
            type,
            locale: "vi_VN",
            url,
            title: fullTitle,
            description,
            siteName: siteConfig.name,
            images: [
                {
                    url: image,
                    width: siteConfig.og.imageWidth,
                    height: siteConfig.og.imageHeight,
                    alt: title || siteConfig.name,
                },
            ],
            ...(publishedTime && { publishedTime }),
            ...(modifiedTime && { modifiedTime }),
        },

        // Twitter
        twitter: {
            card: "summary_large_image",
            title: fullTitle,
            description,
            images: [image],
            creator: "@rovingvn",
            site: "@rovingvn",
        },

        // Verification (Google, Bing, etc.)
        verification: {
            google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
            // yandex: "",
            // bing: "",
        },

        // Other metadata
        other: {
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": siteConfig.shortName,
            "format-detection": "telephone=no",
        },
    };

    return metadata;
}

export function generateViewport(): Viewport {
    return {
        themeColor: siteConfig.metadata.themeColor,
        colorScheme: "light",
        width: "device-width",
        initialScale: 1,
        maximumScale: 5,
    };
}

/**
 * Generate JSON-LD schema for SEO
 * Thêm structured data cho Google
 */
export function generateJsonLd(type: "organization" | "website" | "breadcrumb", data?: Record<string, unknown> | unknown[]) {
    const baseUrl = siteConfig.siteUrl;

    switch (type) {
        case "organization":
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: siteConfig.business.name,
                legalName: siteConfig.business.legalName,
                url: baseUrl,
                logo: `${baseUrl}${siteConfig.logo.main}`,
                foundingDate: siteConfig.business.foundingDate,
                contactPoint: {
                    "@type": "ContactPoint",
                    email: siteConfig.contact.email,
                    telephone: siteConfig.contact.phone,
                    contactType: "Customer Service",
                },
                sameAs: Object.values(siteConfig.social),
                address: {
                    "@type": "PostalAddress",
                    addressLocality: siteConfig.contact.address,
                    addressCountry: "VN",
                },
            };

        case "website":
            return {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: siteConfig.name,
                url: baseUrl,
                description: siteConfig.description,
                publisher: {
                    "@type": "Organization",
                    name: siteConfig.business.name,
                },
            };

        case "breadcrumb":
            return {
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: data || [],
            };

        default:
            return null;
    }
}
