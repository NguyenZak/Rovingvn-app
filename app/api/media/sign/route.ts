
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()

        // Get user from session to ensure only authenticated users can sign uploads
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            )
        }

        const body = await request.json()
        const folder = body.folder || 'roving-vietnam/media'

        // Timestamp must be in seconds
        const timestamp = Math.round((new Date).getTime() / 1000)

        // Generate signature
        const signature = cloudinary.utils.api_sign_request(
            {
                timestamp: timestamp,
                folder: folder,
            },
            process.env.CLOUDINARY_API_SECRET!
        )

        return NextResponse.json({
            success: true,
            data: {
                timestamp,
                signature,
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                folder
            }
        })

    } catch (error) {
        console.error('Sign API error:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to generate signature' },
            { status: 500 }
        )
    }
}
