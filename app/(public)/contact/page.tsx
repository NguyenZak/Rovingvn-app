
import { getDynamicSiteConfig } from '@/lib/site-config-dynamic'
import { getPageContent } from '@/lib/actions/page-actions'
import ContactClient from './ContactClient'
import { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
    const siteConfig = await getDynamicSiteConfig()
    const { data: pageData } = await getPageContent('contact')

    return {
        title: pageData?.meta_title || pageData?.title || `Contact Us | ${siteConfig.name}`,
        description: pageData?.meta_description || `Contact ${siteConfig.name}`,
    }
}

export default async function ContactPage() {
    const siteConfig = await getDynamicSiteConfig()
    const { data: pageData } = await getPageContent('contact')

    // Merge logic: Page specific content overrides global site config
    const mergedConfig = {
        ...siteConfig,
        contact: {
            ...siteConfig.contact,
            ...(pageData?.content?.contact || {})
        },
        social: {
            ...siteConfig.social,
            ...(pageData?.content?.social || {})
        },
        // If the page content has specific sections like "workingHours", we can pass them entirely
        // For now, ContactClient expects siteConfig structure.
        // We can extend mergedConfig to include raw content if needed by Client.
        content: pageData?.content || {}
    }

    return <ContactClient siteConfig={mergedConfig} />
}
