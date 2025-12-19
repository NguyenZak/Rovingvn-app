
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    // Get columns? (Need admin privs or use rpc usually, but let's try just getting data)
    const { data: destinations, error } = await supabase
        .from('destinations')
        .select('*')
        .ilike('name', '%Nội Bài%');

    return NextResponse.json({
        destinations,
        error
    });
}
