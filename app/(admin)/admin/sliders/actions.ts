// ============================================
// Slider Management Server Actions
// Full CRUD operations for slider management
// ============================================

'use server'

import { createClient } from '@/lib/supabase/server'
import { requireEditor, getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { SliderFormData, SliderInsert, SliderUpdate, APIResponse, Slider } from '@/lib/types/cms'

/**
 * Get all sliders
 */
export async function getAllSliders(): Promise<Slider[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sliders')
        .select(`
      *,
      image:image_id(id, url, filename)
    `)
        .order('display_order', { ascending: true })

    if (error) {
        console.error('Error fetching sliders:', error)
        return []
    }

    return (data as unknown as Slider[]) || []
}

/**
 * Get single slider by ID
 */
export async function getSliderById(id: string): Promise<Slider | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('sliders')
        .select(`
      *,
      image:image_id(id, url, filename)
    `)
        .eq('id', id)
        .single()

    if (error) {
        console.error('Error fetching slider:', error)
        return null
    }

    return data as unknown as Slider
}

/**
 * Create a new slider
 */
export async function createSlider(formData: SliderFormData): Promise<APIResponse<{ id: string }>> {
    try {
        await requireEditor()
        const supabase = await createClient()
        const user = await getUser()

        if (!user) {
            return { success: false, error: 'Chưa đăng nhập' }
        }

        const sliderData: SliderInsert = {
            title: formData.title,
            subtitle: formData.subtitle || null,
            description: formData.description || null,
            image_id: formData.image_id || null,
            link: formData.link || null,
            button_text: formData.button_text || null,
            display_order: formData.display_order,
            status: formData.status,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null,
            created_by: user.id
        }

        const { data: slider, error } = await supabase
            .from('sliders')
            .insert(sliderData)
            .select('id')
            .single()

        if (error || !slider) {
            return { success: false, error: error?.message || 'Không thể tạo slider' }
        }

        revalidatePath('/admin/sliders')
        return {
            success: true,
            data: { id: slider.id },
            message: 'Đã tạo slider thành công'
        }
    } catch (error) {
        console.error('Create slider error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Update existing slider
 */
export async function updateSlider(
    sliderId: string,
    formData: SliderFormData
): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const sliderData: SliderUpdate = {
            title: formData.title,
            subtitle: formData.subtitle || null,
            description: formData.description || null,
            image_id: formData.image_id || null,
            link: formData.link || null,
            button_text: formData.button_text || null,
            display_order: formData.display_order,
            status: formData.status,
            start_date: formData.start_date || null,
            end_date: formData.end_date || null
        }

        const { error } = await supabase
            .from('sliders')
            .update(sliderData)
            .eq('id', sliderId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/sliders')
        revalidatePath(`/admin/sliders/${sliderId}/edit`)

        return {
            success: true,
            message: 'Đã cập nhật slider thành công'
        }
    } catch (error) {
        console.error('Update slider error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Delete slider
 */
export async function deleteSlider(sliderId: string): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const { error } = await supabase
            .from('sliders')
            .delete()
            .eq('id', sliderId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/sliders')
        return {
            success: true,
            message: 'Đã xoá slider thành công'
        }
    } catch (error) {
        console.error('Delete slider error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Update slider status (activate/deactivate)
 */
export async function updateSliderStatus(
    sliderId: string,
    status: 'active' | 'inactive'
): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        const { error } = await supabase
            .from('sliders')
            .update({ status })
            .eq('id', sliderId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/sliders')

        return {
            success: true,
            message: status === 'active' ? 'Đã kích hoạt slider' : 'Đã ẩn slider'
        }
    } catch (error) {
        console.error('Update slider status error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Reorder sliders
 */
export async function reorderSliders(
    sliderIds: string[]
): Promise<APIResponse> {
    try {
        await requireEditor()
        const supabase = await createClient()

        // Update display_order for each slider
        const updates = sliderIds.map((id, index) =>
            supabase
                .from('sliders')
                .update({ display_order: index })
                .eq('id', id)
        )

        await Promise.all(updates)

        revalidatePath('/admin/sliders')

        return {
            success: true,
            message: 'Đã cập nhật thứ tự slider'
        }
    } catch (error) {
        console.error('Reorder sliders error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}
