
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitBooking(formData: FormData) {
    const supabase = await createClient()

    const data = {
        tour_id: formData.get('tour_id'),
        customer_name: formData.get('name'),
        customer_email: formData.get('email'),
        customer_phone: formData.get('phone'),
        people_count: Number(formData.get('people')),
        start_date: formData.get('date'),
        message: formData.get('message'),
        status: 'pending',
    }

    const { error } = await supabase.from('bookings').insert(data)

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/tours') // Optional: revalidate relevant paths
    return { success: true }
}
