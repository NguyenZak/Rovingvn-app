
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { uploadToCloudinary, deleteFromCloudinary } from '@/lib/cloudinary'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Get user from session
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const formData = await request.formData()
        const file = formData.get('file') as File
        const altText = formData.get('alt_text') as string || ''
        const folder = formData.get('folder') as string || 'roving-vietnam/media'

        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file provided' },
                { status: 400 }
            )
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: 'Invalid file type. Only JPG, PNG, WebP, GIF allowed.' },
                { status: 400 }
            )
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { success: false, error: 'File size exceeds 10MB limit.' },
                { status: 400 }
            )
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
                storage_path: cloudinaryResult.public_id,
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
            console.error('Database insert error:', dbError)
            return NextResponse.json(
                { success: false, error: 'Failed to save media record: ' + dbError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: { id: mediaRecord.id, url: cloudinaryResult.secure_url },
            message: 'Upload successful'
        })

    } catch (error) {
        console.error('Upload API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error'),
                debug: `CloudName=${!!process.env.CLOUDINARY_CLOUD_NAME}, Key=${!!process.env.CLOUDINARY_API_KEY}, Secret=${!!process.env.CLOUDINARY_API_SECRET}`
            },
            { status: 500 }
        )
    }
}
