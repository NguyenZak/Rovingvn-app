'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertCustomer(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string | null

    const data = {
        fullname: formData.get('fullname') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        nationality: formData.get('nationality') as string,
        date_of_birth: formData.get('date_of_birth') || null,
        passport_number: formData.get('passport_number') || null,
        address: formData.get('address') || null,
        tags: formData.get('tags') || null,
        notes: formData.get('notes') || null,
    }

    let error
    if (id) {
        const res = await supabase.from('customers').update(data).eq('id', id)
        error = res.error
    } else {
        const res = await supabase.from('customers').insert(data)
        error = res.error
    }

    if (error) {
        console.error('Error saving customer:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/customers')
    redirect('/admin/customers')
}

export async function deleteCustomer(id: string) {
    const supabase = await createClient()

    // Check if customer has bookings
    const { data: bookings } = await supabase
        .from('bookings')
        .select('id')
        .eq('customer_id', id)
        .limit(1)

    if (bookings && bookings.length > 0) {
        return { error: 'Cannot delete customer with existing bookings.' }
    }

    const { error } = await supabase.from('customers').delete().eq('id', id)

    if (error) {
        console.error('Error deleting customer:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/customers')
    return { success: true }
}
