
'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function upsertTour(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string | null
    const title = formData.get('title') as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Process gallery images including parsing JSON from MediaPicker
    const galleryInput = formData.get('gallery_images') as string
    let gallery_images = null

    if (galleryInput) {
        try {
            const parsed = JSON.parse(galleryInput)
            if (Array.isArray(parsed)) {
                gallery_images = parsed
            }
        } catch (e) {
            // Parsing failed, ignore
        }
    }

    // Process destination IDs
    const destIdsInput = formData.get('destination_ids') as string
    let destination_ids: string[] = []
    try {
        const parsed = JSON.parse(destIdsInput)
        if (Array.isArray(parsed)) destination_ids = parsed
    } catch (e) { }

    // Fallback: if single destination_id was somehow passed
    if (destination_ids.length === 0 && formData.get('destination_id')) {
        destination_ids.push(formData.get('destination_id') as string)
    }

    // Process price - if empty string, treat as null (Contact Us)
    const priceInput = formData.get('price') as string
    const price = priceInput === '' ? null : Number(priceInput)

    const data = {
        title,
        slug,
        // Use the first selected destination as the primary one for backward compatibility
        destination_id: destination_ids.length > 0 ? destination_ids[0] : null,
        price,
        duration: formData.get('duration'),
        description: formData.get('description'),
        highlights: (formData.get('highlights') as string)?.split('\n').filter(Boolean).map(s => s.trim()) || [],
        cover_image: formData.get('cover_image'),
        images: gallery_images, // DB column is 'images'
        status: formData.get('status'),
    }

    let error;
    let tourId = id;

    if (id) {
        const res = await supabase.from('tours').update(data).eq('id', id)
        error = res.error
    } else {
        const res = await supabase.from('tours').insert(data).select().single()
        error = res.error
        if (res.data) tourId = res.data.id
    }

    if (error) {
        console.error('Error saving tour:', error)
        return { error: error.message }
    }

    // Update tour_destinations junction table
    if (tourId) {
        if (destination_ids.length > 0) {
            // First delete existing connections
            await supabase.from('tour_destinations').delete().eq('tour_id', tourId)

            // Then insert new ones
            const insertData = destination_ids.map(destId => ({
                tour_id: tourId,
                destination_id: destId
            }))

            const { error: relError } = await supabase.from('tour_destinations').insert(insertData)
            if (relError) console.error('Error updating tour destinations:', relError)
        } else {
            // If cleared all destinations
            await supabase.from('tour_destinations').delete().eq('tour_id', tourId)
        }
    }

    revalidatePath('/tours')
    return { success: true }
}

export async function upsertDestination(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string | null
    const name = formData.get('name') as string
    const slugInput = formData.get('slug') as string
    const slug = slugInput || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    // Process gallery images
    const galleryInput = formData.get('gallery_images') as string
    let gallery_images = null

    if (galleryInput) {
        try {
            // Attempt to parse as JSON first (from new client component)
            const parsed = JSON.parse(galleryInput)
            if (Array.isArray(parsed)) {
                gallery_images = parsed
            }
        } catch (e) {
            // Parsing failed, ignore
        }

        // Fallback to legacy behavior (split by comma/newline) if strict JSON parse failed
        if (!gallery_images) {
            const images = galleryInput
                .split(/[,\n]/)
                .map(url => url.trim())
                .filter(url => url.length > 0)
            if (images.length > 0) {
                gallery_images = images
            }
        }
    }

    const data = {
        name,
        slug,
        country: formData.get('country') || 'Vietnam',
        region: formData.get('region'),
        description: formData.get('description'),
        image_url: formData.get('image_url'),
        gallery_images,
        best_time_to_visit: formData.get('best_time_to_visit') || null,
        climate_info: formData.get('climate_info') || null,
        attractions: formData.get('attractions') || null,
        seo_title: formData.get('seo_title') || null,
        seo_description: formData.get('seo_description') || null,
        status: formData.get('status') || 'draft',
    }

    let error;
    if (id) {
        const res = await supabase.from('destinations').update(data).eq('id', id)
        error = res.error
    } else {
        const res = await supabase.from('destinations').insert(data)
        error = res.error
    }

    if (error) {
        console.error('Error saving destination:', error)
        if (error.code === '23505') {
            return { error: 'Destination with this name/slug already exists.' }
        }
        return { error: error.message }
    }

    revalidatePath('/admin/destinations')
    revalidatePath('/destinations')
    return { success: true }
}

export async function upsertBlogPost(formData: FormData) {
    const supabase = await createClient()

    const id = formData.get('id') as string | null
    const title = formData.get('title') as string
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

    const data = {
        title,
        slug,
        content: formData.get('content'),
        excerpt: formData.get('excerpt'),
        cover_image: formData.get('cover_image'),
        category: formData.get('category'),
        status: formData.get('status') || 'draft'
    }

    let error;
    if (id) {
        const res = await supabase.from('blog_posts').update(data).eq('id', id)
        error = res.error
    } else {
        const res = await supabase.from('blog_posts').insert(data)
        error = res.error
    }

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    redirect('/admin/blog')
}

export async function deleteTour(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('tours').delete().eq('id', id)

    if (error) {
        console.error('Error deleting tour:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/tours')
    revalidatePath('/tours')
    return { success: true }
}

export async function deleteDestination(id: string) {
    const supabase = await createClient()

    // Check if destination has associated tours
    const { data: tours } = await supabase
        .from('tours')
        .select('id')
        .eq('destination_id', id)
        .limit(1)

    if (tours && tours.length > 0) {
        return { error: 'Cannot delete destination with associated tours. Please remove or reassign tours first.' }
    }

    const { error } = await supabase.from('destinations').delete().eq('id', id)

    if (error) {
        console.error('Error deleting destination:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/destinations')
    revalidatePath('/destinations')
    return { success: true }
}

export async function toggleDestinationStatus(id: string, currentStatus: string) {
    const supabase = await createClient()

    // Toggle logic: if published -> draft, if draft -> published
    // Or just accept newStatus as argument? Usually toggling is safer if UI knows next state.
    // Let's accept newStatus for clarity if we implement a dropdown, or just toggle.
    // Let's assume simple toggle for now or pass exact status. 
    // User requested "nút chỉnh trạng thái" (toggle button).

    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    const { error } = await supabase
        .from('destinations')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        console.error('Error updating destination status:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/destinations')
    revalidatePath('/destinations')
    return { success: true, status: newStatus }
}

export async function deleteBlogPost(id: string) {
    const supabase = await createClient()

    const { error } = await supabase.from('blog_posts').delete().eq('id', id)

    if (error) {
        console.error('Error deleting blog post:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/blog')
    revalidatePath('/blog')
    return { success: true }
}

export async function toggleTourStatus(id: string, currentStatus: string) {
    const supabase = await createClient()
    const newStatus = currentStatus === 'published' ? 'draft' : 'published'

    const { error } = await supabase
        .from('tours')
        .update({ status: newStatus })
        .eq('id', id)

    if (error) {
        console.error('Error updating tour status:', error)
        return { error: error.message }
    }

    revalidatePath('/admin/tours')
    revalidatePath('/tours')
    return { success: true, status: newStatus }
}
