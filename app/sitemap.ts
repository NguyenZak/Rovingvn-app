/**
 * Sitemap Generator
 * Tạo sitemap.xml động cho SEO
 * 
 * File này sẽ tự động generate sitemap dựa trên các routes trong app
 */

import { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = siteConfig.siteUrl;

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/tours`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.9,
        },
        {
            url: `${baseUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: "daily" as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.7,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: "monthly" as const,
            priority: 0.6,
        },
    ];

    // TODO: Fetch dynamic pages from database
    // Example: Tours, Blog posts, etc.
    // const tours = await getTours();
    // const dynamicTourPages = tours.map((tour) => ({
    //   url: `${baseUrl}/tours/${tour.slug}`,
    //   lastModified: tour.updatedAt,
    //   changeFrequency: "weekly" as const,
    //   priority: 0.8,
    // }));

    return [
        ...staticPages,
        // ...dynamicTourPages,
    ];
}
