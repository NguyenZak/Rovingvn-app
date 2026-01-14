/**
 * Dynamic Metadata Generator
 * Generates metadata from database settings
 */

import { Metadata } from "next"
import { getSiteSettings } from "./actions/site-settings"

export async function generateDynamicMetadata(): Promise<Metadata> {
    const settings = await getSiteSettings()

    const siteName = settings?.site_name || "Roving Việt Nam"
    const description = settings?.site_description || "Curating authentic Vietnamese experiences"
    const siteUrl = settings?.site_url || "https://rovingvn.com"

    return {
        title: {
            default: `${siteName} - ${settings?.site_tagline || "Experience Vietnam"}`,
            template: `%s | ${siteName}`,
        },
        description,
        keywords: settings?.meta_keywords?.join(", ") || "",
        authors: [{ name: settings?.meta_author || siteName }],
        applicationName: siteName,
        generator: "Next.js",
        referrer: "origin-when-cross-origin",

        robots: {
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

        // Icons - Dynamic from database
        icons: {
            icon: [
                ...(settings?.favicon_16 ? [{
                    url: settings.favicon_16,
                    sizes: "16x16",
                    type: "image/png",
                }] : []),
                ...(settings?.favicon_32 ? [{
                    url: settings.favicon_32,
                    sizes: "32x32",
                    type: "image/png",
                }] : []),
                ...(settings?.favicon_ico ? [{
                    url: settings.favicon_ico,
                    sizes: "any",
                }] : []),
            ],
            apple: settings?.favicon_180 ? [{
                url: settings.favicon_180,
                sizes: "180x180",
                type: "image/png",
            }] : [],
            other: [
                ...(settings?.favicon_192 ? [{
                    rel: "android-chrome-192x192",
                    url: settings.favicon_192,
                }] : []),
                ...(settings?.favicon_512 ? [{
                    rel: "android-chrome-512x512",
                    url: settings.favicon_512,
                }] : []),
            ],
        },

        manifest: "/manifest.json",

        // Open Graph
        openGraph: {
            type: "website",
            locale: settings?.meta_language || "vi_VN",
            url: siteUrl,
            title: siteName,
            description,
            siteName,
            images: settings?.og_image ? [{
                url: settings.og_image,
                width: settings.og_image_width || 1200,
                height: settings.og_image_height || 630,
                alt: siteName,
            }] : [],
        },

        // Twitter
        twitter: {
            card: "summary_large_image",
            title: siteName,
            description,
            images: settings?.og_image ? [settings.og_image] : [],
            creator: settings?.social_twitter || "@rovingvn",
            site: settings?.social_twitter || "@rovingvn",
        },

        // Verification
        verification: {
            google: settings?.google_site_verification || "VPDlTwZT18QO1AOYYuR_y9C8NeEhnnG4J0fh2-3UI40",
        },

        // Other metadata
        other: {
            "mobile-web-app-capable": "yes",
            "apple-mobile-web-app-capable": "yes",
            "apple-mobile-web-app-status-bar-style": "default",
            "apple-mobile-web-app-title": settings?.site_short_name || siteName,
            "format-detection": "telephone=no",
        },
    }
}
