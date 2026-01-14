import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

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

        const body = await request.json()

        // Validate required fields
        const {
            public_id,
            secure_url,
            filename,
            mime_type,
            bytes,
            width,
            height,
            alt_text
        } = body

        if (!public_id || !secure_url) {
            return NextResponse.json(
                { success: false, error: 'Missing required metadata' },
                { status: 400 }
            )
        }

        // Save to database
        const { data: mediaRecord, error: dbError } = await supabase
            .from('media')
            .insert({
                filename: filename || 'unknown',
                url: secure_url,
                storage_path: public_id,
                mime_type: mime_type,
                file_size: bytes,
                alt_text: alt_text || '',
                width: width,
                height: height,
                uploaded_by: user.id
            })
            .select('id')
            .single()

        if (dbError) {
            console.error('Database insert error:', dbError)
            // Attempt to cleanup the orphaned file in Cloudinary if DB fails
            // This is best effort
            try {
                await cloudinary.uploader.destroy(public_id)
            } catch (e) {
                console.error('Failed to cleanup Cloudinary file:', e)
            }

            return NextResponse.json(
                { success: false, error: 'Failed to save media record: ' + dbError.message },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            data: { id: mediaRecord.id, url: secure_url },
            message: 'Saved successful'
        })

    } catch (error) {
        console.error('Save Metadata API error:', error)
        return NextResponse.json(
            {
                success: false,
                error: 'Save failed: ' + (error instanceof Error ? error.message : 'Unknown error')
            },
            { status: 500 }
        )
    }
}
