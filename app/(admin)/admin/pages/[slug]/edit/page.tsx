import EditPageClient from './EditPageClient'

export const metadata = {
    title: 'Edit Page | Roving Admin'
}

export default async function EditPagePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    return <EditPageClient slug={slug} />
}
