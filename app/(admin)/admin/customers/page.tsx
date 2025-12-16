import { createClient } from '@/lib/supabase/server'
import CustomersClient from './CustomersClient'

export const revalidate = 0

export default async function AdminCustomersPage() {
    const supabase = await createClient()

    // Get customers with booking count
    const { data: customers } = await supabase
        .from('customers')
        .select(`
            *,
            bookings:bookings(count)
        `)
        .order('created_at', { ascending: false })

    // Transform data to include booking count
    const customersWithCount = customers?.map(customer => ({
        ...customer,
        booking_count: (customer as any).bookings?.[0]?.count || 0
    })) || []

    return <CustomersClient customers={customersWithCount} />
}
