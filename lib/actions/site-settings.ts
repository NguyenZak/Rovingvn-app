/**
 * Site Settings Actions
 * Server actions để quản lý thông tin website
 */

"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SiteSettings {
    id?: string;
    // Basic Info
    site_name: string;
    site_short_name?: string;
    site_description?: string;
    site_tagline?: string;
    site_url?: string;

    // Logo & Branding
    logo_main?: string;
    logo_dark?: string;
    logo_small?: string;
    logo_text?: string;

    // Favicon
    favicon_ico?: string;
    favicon_16?: string;
    favicon_32?: string;
    favicon_180?: string;
    favicon_192?: string;
    favicon_512?: string;

    // Open Graph
    og_image?: string;
    og_image_width?: number;
    og_image_height?: number;

    // Contact
    contact_email?: string;
    contact_phone?: string;
    contact_address?: string;

    // Social Media
    social_facebook?: string;
    social_instagram?: string;
    social_twitter?: string;
    social_youtube?: string;
    social_tiktok?: string;

    // SEO
    meta_keywords?: string[];
    meta_author?: string;
    meta_language?: string;

    // Theme
    theme_color?: string;
    background_color?: string;

    // Business
    business_type?: string;
    business_legal_name?: string;
    business_founding_date?: string;
    business_vat_id?: string;

    // Analytics
    google_analytics_id?: string;
    facebook_pixel_id?: string;
    google_tag_manager_id?: string;
    google_site_verification?: string;

    // Features
    features?: {
        blog?: boolean;
        tours?: boolean;
        customTrips?: boolean;
        newsletter?: boolean;
        reviews?: boolean;
    };

    // Metadata
    created_at?: string;
    updated_at?: string;
    updated_by?: string;
}

/**
 * Get site settings
 * Lấy thông tin cấu hình website
 */
export async function getSiteSettings(): Promise<SiteSettings | null> {
    try {
        const supabase = await createClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .limit(1)
            .single();

        if (error) {
            console.error("Error fetching site settings:", error);
            return null;
        }

        return data as SiteSettings;
    } catch (error) {
        console.error("Error in getSiteSettings:", error);
        return null;
    }
}

/**
 * Update site settings
 * Cập nhật thông tin website
 */
export async function updateSiteSettings(settings: Partial<SiteSettings>) {
    try {
        const supabase = await createClient();

        // Check if user has permission to manage settings (using RBAC)
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: "Unauthorized" };
        }

        // Check permission using RBAC system
        const { data: hasPermission } = await supabase.rpc('user_has_role', {
            p_user_id: user.id,
            p_role_name: 'admin'
        });

        if (!hasPermission) {
            return { success: false, error: "Only admins can update site settings" };
        }


        // Get current settings
        const { data: currentSettings } = await supabase
            .from("site_settings")
            .select("id")
            .limit(1)
            .single();

        let result;

        if (currentSettings) {
            // Update existing settings
            result = await supabase
                .from("site_settings")
                .update({
                    ...settings,
                    updated_by: user.id,
                })
                .eq("id", currentSettings.id)
                .select()
                .single();
        } else {
            // Insert new settings
            result = await supabase
                .from("site_settings")
                .insert({
                    ...settings,
                    updated_by: user.id,
                })
                .select()
                .single();
        }

        if (result.error) {
            console.error("Error updating site settings:", result.error);
            return { success: false, error: result.error.message };
        }

        // Revalidate all pages to update metadata
        revalidatePath("/", "layout");

        return { success: true, data: result.data };
    } catch (error) {
        console.error("Error in updateSiteSettings:", error);
        return { success: false, error: "Internal server error" };
    }
}

/**
 * Update logo
 * Cập nhật logo (sau khi upload lên Cloudinary)
 */
export async function updateLogo(type: "main" | "dark" | "small" | "text", url: string) {
    const fieldMap = {
        main: "logo_main",
        dark: "logo_dark",
        small: "logo_small",
        text: "logo_text",
    };

    return updateSiteSettings({
        [fieldMap[type]]: url,
    });
}

/**
 * Update favicon
 * Cập nhật favicon
 */
export async function updateFavicon(
    type: "ico" | "16" | "32" | "180" | "192" | "512",
    url: string
) {
    const fieldMap = {
        ico: "favicon_ico",
        "16": "favicon_16",
        "32": "favicon_32",
        "180": "favicon_180",
        "192": "favicon_192",
        "512": "favicon_512",
    };

    return updateSiteSettings({
        [fieldMap[type]]: url,
    });
}

/**
 * Update contact info
 */
export async function updateContactInfo(contact: {
    email?: string;
    phone?: string;
    address?: string;
}) {
    return updateSiteSettings({
        contact_email: contact.email,
        contact_phone: contact.phone,
        contact_address: contact.address,
    });
}

/**
 * Update social media links
 */
export async function updateSocialMedia(social: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    youtube?: string;
    tiktok?: string;
}) {
    return updateSiteSettings({
        social_facebook: social.facebook,
        social_instagram: social.instagram,
        social_twitter: social.twitter,
        social_youtube: social.youtube,
        social_tiktok: social.tiktok,
    });
}

/**
 * Update SEO settings
 */
export async function updateSEOSettings(seo: {
    keywords?: string[];
    author?: string;
    language?: string;
    themeColor?: string;
}) {
    return updateSiteSettings({
        meta_keywords: seo.keywords,
        meta_author: seo.author,
        meta_language: seo.language,
        theme_color: seo.themeColor,
    });
}

/**
 * Update analytics settings
 */
export async function updateAnalytics(analytics: {
    googleAnalyticsId?: string;
    facebookPixelId?: string;
    googleTagManagerId?: string;
    googleSiteVerification?: string;
}) {
    return updateSiteSettings({
        google_analytics_id: analytics.googleAnalyticsId,
        facebook_pixel_id: analytics.facebookPixelId,
        google_tag_manager_id: analytics.googleTagManagerId,
        google_site_verification: analytics.googleSiteVerification,
    });
}
