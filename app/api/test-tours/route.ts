import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Test simple tours query
        const { data: tours, error } = await supabase
            .from('tours')
            .select('*')
            .eq('status', 'published')
            .limit(10)

        return NextResponse.json({
            success: !error,
            count: tours?.length || 0,
            error: error?.message || null,
            tours: tours || []
        })
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}
