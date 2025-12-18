// ============================================
// Media Library Server Actions (Cloudinary)
// Upload, delete, list media files
// ============================================

'use server'

import { createClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { APIResponse } from '@/lib/types/cms'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (Cloudinary supports larger files)

/**
 * Get all media files
 */
export async function getAllMedia() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('media')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching media:', error)
        return []
    }

    return data || []
}

/**
 * Upload a file to Cloudinary
 */
/**
 * Upload a file to Cloudinary
 */
export async function uploadMedia(formData: FormData): Promise<APIResponse<{ id: string; url: string }>> {
    try {
        const supabase = await createClient()
        const user = await getUser()

        if (!user) {
            return { success: false, error: 'Chưa đăng nhập' }
        }

        const file = formData.get('file') as File
        const altText = formData.get('alt_text') as string || ''
        const folder = formData.get('folder') as string || 'roving-vietnam/media'

        if (!file) {
            return { success: false, error: 'Không có file' }
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return { success: false, error: 'Chỉ hỗ trợ JPG, PNG, WebP, GIF' }
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return { success: false, error: 'File phải nhỏ hơn 10MB' }
        }

        // Convert File to Buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Upload to Cloudinary
        const cloudinaryResult = await uploadToCloudinary(buffer, {
            folder: folder,
        })

        // Save to database
        const { data: mediaRecord, error: dbError } = await supabase
            .from('media')
            .insert({
                filename: file.name,
                url: cloudinaryResult.secure_url,
                storage_path: cloudinaryResult.public_id, // Store Cloudinary public_id
                mime_type: file.type,
                file_size: cloudinaryResult.bytes,
                alt_text: altText,
                width: cloudinaryResult.width,
                height: cloudinaryResult.height,
                uploaded_by: user.id
            })
            .select('id')
            .single()

        if (dbError) {
            // Cleanup uploaded file if DB insert fails
            await deleteFromCloudinary(cloudinaryResult.public_id)
            return { success: false, error: 'Lưu thông tin thất bại: ' + dbError.message }
        }

        revalidatePath('/admin/media')

        return {
            success: true,
            data: { id: mediaRecord.id, url: cloudinaryResult.secure_url },
            message: 'Đã tải lên thành công'
        }
    } catch (error) {
        console.error('Upload media error:', error)
        return { success: false, error: 'Có lỗi xảy ra: ' + (error as Error).message }
    }
}

/**
 * Delete a media file from Cloudinary
 */
export async function deleteMedia(mediaId: string): Promise<APIResponse> {
    try {
        const supabase = await createClient()

        // Get media record first
        const { data: media, error: fetchError } = await supabase
            .from('media')
            .select('storage_path')
            .eq('id', mediaId)
            .single()

        if (fetchError || !media) {
            return { success: false, error: 'Không tìm thấy media' }
        }

        // Delete from Cloudinary
        if (media.storage_path) {
            await deleteFromCloudinary(media.storage_path)
        }

        // Delete from database
        const { error: deleteError } = await supabase
            .from('media')
            .delete()
            .eq('id', mediaId)

        if (deleteError) {
            return { success: false, error: deleteError.message }
        }

        revalidatePath('/admin/media')

        return {
            success: true,
            message: 'Đã xoá thành công'
        }
    } catch (error) {
        console.error('Delete media error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Update media alt text
 */
export async function updateMediaAltText(mediaId: string, altText: string): Promise<APIResponse> {
    try {
        const supabase = await createClient()

        const { error } = await supabase
            .from('media')
            .update({ alt_text: altText })
            .eq('id', mediaId)

        if (error) {
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/media')

        return {
            success: true,
            message: 'Đã cập nhật thành công'
        }
    } catch (error) {
        console.error('Update media error:', error)
        return { success: false, error: 'Có lỗi xảy ra' }
    }
}

/**
 * Get media by ID
 */
export async function getMediaById(mediaId: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('media')
        .select('*')
        .eq('id', mediaId)
        .single()

    if (error) {
        console.error('Error fetching media:', error)
        return null
    }

    return data
}
