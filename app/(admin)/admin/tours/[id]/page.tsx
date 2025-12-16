
import TourEditor from '@/components/features/admin/TourEditor'

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params
    return <TourEditor params={resolvedParams} />
}
