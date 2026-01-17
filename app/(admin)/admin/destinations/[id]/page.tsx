
import { createClient } from '@/lib/supabase/server'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { DestinationForm } from '../_components/DestinationForm'
import { getRegions } from '@/lib/actions/region-actions'

export default async function DestinationFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const isNew = id === 'new'
    let destination = null

    // Fetch regions for the form
    const regionsResult = await getRegions()
    const regions = regionsResult.data || []

    if (!isNew) {
        const supabase = await createClient()
        const { data } = await supabase.from('destinations').select('*').eq('id', id).single()
        destination = data
        if (!destination) {
            redirect('/admin/destinations')
        }
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <Link
                    href="/admin/destinations"
                    className="p-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                    <ChevronLeft size={20} className="text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {isNew ? 'Create New Destination' : 'Edit Destination'}
                    </h1>
                    <p className="text-gray-500">
                        {isNew ? 'Add a new travel destination' : 'Update destination details'}
                    </p>
                </div>
            </div>

            <DestinationForm destination={destination} isNew={isNew} regions={regions} />
        </div>
    )
}
