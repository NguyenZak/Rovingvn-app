
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateBookingStatus(id: string, status: 'confirmed' | 'cancelled' | 'pending') {
    const supabase = await createClient()
    await supabase.from('bookings').update({ status }).eq('id', id)
    revalidatePath('/admin/bookings')
}
