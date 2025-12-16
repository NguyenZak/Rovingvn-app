
import TourEditor from '@/components/features/admin/TourEditor'

export default async function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    return <TourEditor params={{ id }} />
}
