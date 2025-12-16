'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function upsertCustomer(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string | null
    const tags = formData.get('tags') as string
    const tagsArray = tags ? tags.split(',').map(t => t.trim()).filter(Boolean) : []

    const data = {
        fullname: formData.get('fullname'),
        email: formData.get('email'),
        phone: formData.get('phone') || null,
        nationality: formData.get('nationality') || null,
        date_of_birth: formData.get('date_of_birth') || null,
        passport_number: formData.get('passport_number') || null,
        address: formData.get('address') || null,
        tags: tagsArray,
        notes: formData.get('notes') || null,
    }

    let error;
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
    return { success: true }
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
