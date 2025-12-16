// ============================================
// Supabase Admin Client (Service Role)
// Use ONLY for server-side operations that need to bypass RLS
// NEVER expose to client-side code
// ============================================

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/lib/types/database.types'

/**
 * Create admin Supabase client with service role key
 * This client bypasses Row Level Security - use with caution!
 */
export function createAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase URL or Service Role Key')
    }

    return createClient<Database>(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}

/**
 * Assign role to user (admin only operation)
 */
export async function assignUserRole(userId: string, roleName: string) {
    const adminClient = createAdminClient()

    // Get role ID
    const { data: role, error: roleError } = await adminClient
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single()

    if (roleError || !role) {
        return { success: false, error: 'Role not found' }
    }

    // Assign role to user
    const { error } = await adminClient
        .from('user_roles')
        .insert({
            user_id: userId,
            role_id: role.id
        })

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}

/**
 * Remove role from user (admin only operation)
 */
export async function removeUserRole(userId: string, roleName: string) {
    const adminClient = createAdminClient()

    // Get role ID
    const { data: role, error: roleError } = await adminClient
        .from('roles')
        .select('id')
        .eq('name', roleName)
        .single()

    if (roleError || !role) {
        return { success: false, error: 'Role not found' }
    }

    // Remove role from user
    const { error } = await adminClient
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role_id', role.id)

    if (error) {
        return { success: false, error: error.message }
    }

    return { success: true }
}
