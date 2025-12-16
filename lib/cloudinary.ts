// ============================================
// Cloudinary Configuration and Utilities
// ============================================

import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export interface CloudinaryUploadResult {
    public_id: string
    secure_url: string
    width: number
    height: number
    format: string
    bytes: number
}

/**
 * Upload image to Cloudinary
 */
export async function uploadToCloudinary(
    file: Buffer,
    options?: {
        folder?: string
        public_id?: string
        transformation?: object
    }
): Promise<CloudinaryUploadResult> {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: options?.folder || 'roving-vietnam',
                public_id: options?.public_id,
                transformation: options?.transformation,
                resource_type: 'image',
            },
            (error, result) => {
                if (error) {
                    reject(error)
                } else if (result) {
                    resolve({
                        public_id: result.public_id,
                        secure_url: result.secure_url,
                        width: result.width,
                        height: result.height,
                        format: result.format,
                        bytes: result.bytes,
                    })
                }
            }
        )

        uploadStream.end(file)
    })
}

/**
 * Delete image from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
    try {
        const result = await cloudinary.uploader.destroy(publicId)
        return result.result === 'ok'
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return false
    }
}

/**
 * Generate optimized image URL with transformations
 */
export function getOptimizedUrl(
    publicId: string,
    options?: {
        width?: number
        height?: number
        quality?: number
        format?: string
    }
): string {
    return cloudinary.url(publicId, {
        transformation: [
            {
                width: options?.width,
                height: options?.height,
                crop: 'fill',
                gravity: 'auto',
                quality: options?.quality || 'auto',
                fetch_format: options?.format || 'auto',
            },
        ],
    })
}

/**
 * Get thumbnail URL
 */
export function getThumbnailUrl(publicId: string, size: number = 200): string {
    return getOptimizedUrl(publicId, { width: size, height: size })
}

export default cloudinary
