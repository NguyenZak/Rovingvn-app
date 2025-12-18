import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const supabase = await createClient()

        // Test query WITHOUT destination join
        const { data: tours1, error: error1 } = await supabase
            .from('tours')
            .select('*')
            .eq('status', 'published')
            .limit(5)

        // Test query WITH destination join
        const { data: tours2, error: error2 } = await supabase
            .from('tours')
            .select('*, destinations(*)')
            .eq('status', 'published')
            .limit(5)

        return NextResponse.json({
            without_join: {
                success: !error1,
                count: tours1?.length || 0,
                error: error1?.message || null,
                tours: tours1
            },
            with_join: {
                success: !error2,
                count: tours2?.length || 0,
                error: error2?.message || null,
                tours: tours2
            }
        })
    } catch (error) {
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 })
    }
}

