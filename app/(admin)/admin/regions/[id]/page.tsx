import { getRegion } from '@/lib/actions/region-actions'
import { RegionForm } from './RegionForm'

interface PageProps {
    params: Promise<{
        id: string
    }>
}

export default async function EditRegionPage(props: PageProps) {
    const params = await props.params;
    const isNew = params.id === 'new'
    let region = null

    if (!isNew) {
        const { data, error } = await getRegion(params.id)
        if (error || !data) {
            return <div>Error loading region or not found.</div>
        }
        region = data
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">
                {isNew ? 'Create New Region' : `Edit Region: ${region?.name}`}
            </h1>
            <RegionForm initialData={region || undefined} />
        </div>
    )
}
