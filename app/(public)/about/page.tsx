import { getPageContent } from '@/lib/actions/page-actions'
import AboutClient from './AboutClient'
import { Metadata } from 'next'

export const revalidate = 3600 // Revalidate every hour

export async function generateMetadata(): Promise<Metadata> {
    const { data: pageData } = await getPageContent('about')

    return {
        title: pageData?.meta_title || 'About Us | Roving Vietnam Travel',
        description: pageData?.meta_description || 'Learn about our journey, mission, and the passionate team behind Roving Vietnam Travel.',
    }
}

export default async function AboutPage() {
    const { data: pageData } = await getPageContent('about')

    return <AboutClient content={pageData?.content} />
}
