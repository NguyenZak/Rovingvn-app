import { notFound } from 'next/navigation'
import { getRegionBySlug } from '@/lib/actions/region-actions'
import { getAllDestinations } from '@/lib/actions/destination-actions'
import { RegionProvincesClient } from './RegionProvincesClient'

interface PageProps {
    params: Promise<{ slug: string }>
}

export default async function RegionPage({ params }: PageProps) {
    const { slug } = await params

    // Fetch region data
    const regionResult = await getRegionBySlug(slug)

    if (!regionResult.success || !regionResult.data) {
        notFound()
    }

    const region = regionResult.data

    // Fetch destinations for this region
    const destinationsResult = await getAllDestinations({
        region: region.name,
        status: 'published',
        limit: 100
    })

    const destinations = destinationsResult.success ? destinationsResult.data || [] : []

    return (
        <RegionProvincesClient
            region={region}
            destinations={destinations}
        />
    )
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
    const { slug } = await params
    const regionResult = await getRegionBySlug(slug)

    if (!regionResult.success || !regionResult.data) {
        return {
            title: 'Region Not Found'
        }
    }

    const region = regionResult.data

    return {
        title: `${region.name} Vietnam - Explore Provinces | Roving Việt Nam Travel`,
        description: region.description || `Discover the best destinations and provinces in ${region.name} Vietnam`,
    }
}
