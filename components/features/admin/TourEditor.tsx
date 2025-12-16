import { createClient } from '@/lib/supabase/server'
import TourForm from './TourForm'

export default async function TourEditor({ params }: { params: Promise<{ id?: string }> }) {
    const supabase = await createClient()
    const { id } = await params
    const isEdit = !!id

    let tour = null
    let relatedDestinationIds: string[] = []

    if (isEdit && id) {
        const { data } = await supabase.from('tours').select('*').eq('id', id).single()
        tour = data

        const { data: relData } = await supabase
            .from('tour_destinations')
            .select('destination_id')
            .eq('tour_id', id)

        if (relData) {
            relatedDestinationIds = relData.map(r => r.destination_id)
        }
    }

    const { data: destinations } = await supabase.from('destinations').select('*').order('name')

    return <TourForm tour={tour} destinations={destinations || []} relatedDestinationIds={relatedDestinationIds} />
}
