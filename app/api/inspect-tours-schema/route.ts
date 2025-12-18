/* eslint-disable */
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

/**
 * Get actual schema of tours table by querying it
 */
export async function GET() {
    try {
        const adminClient = createAdminClient();

        // Query tours table with limit 1 to see structure
        const { data, error } = await adminClient
            .from('tours')
            .select('*')
            .limit(1);

        if (error) {
            return NextResponse.json({
                success: false,
                error: error.message,
                hint: 'Make sure tours table exists in database'
            }, { status: 500 });
        }

        // Get column names from returned object
        const columns = data && data.length > 0
            ? Object.keys(data[0])
            : [];

        return NextResponse.json({
            success: true,
            tableName: 'tours',
            columnNames: columns,
            columnCount: columns.length,
            sampleData: data && data.length > 0 ? data[0] : null,
            message: columns.length > 0
                ? `Found ${columns.length} columns in tours table`
                : 'No data in tours table yet'
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 });
    }
}
