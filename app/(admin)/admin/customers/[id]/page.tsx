import { createClient } from '@/lib/supabase/server'
import CustomerFormClient from './CustomerFormClient'

export default async function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()
    const isEdit = id !== 'new'

    let customer = null
    let bookings = []

    if (isEdit) {
        const { data: customerData } = await supabase
            .from('customers')
            .select('*')
            .eq('id', id)
            .single()
        customer = customerData

        const { data: bookingsData } = await supabase
            .from('bookings')
            .select(`
                *,
                tours(id, title, image_url)
            `)
            .eq('customer_id', id)
            .order('created_at', { ascending: false })
        bookings = bookingsData || []
    }

    return <CustomerFormClient customer={customer} isEdit={isEdit} bookings={bookings} />
}
