/**
 * Site Settings Page - Server Component
 * Load settings from database and pass to client component
 */

import { getSiteSettings } from "@/lib/actions/site-settings";
import { SiteSettingsClient } from "./SiteSettingsClient";

export const metadata = {
    title: "Cấu hình Website | Admin",
    description: "Quản lý thông tin chung của website",
};

export const dynamic = 'force-dynamic';

export default async function AdminSettingsPage() {
    const settings = await getSiteSettings();

    return <SiteSettingsClient initialSettings={settings} />;
}
