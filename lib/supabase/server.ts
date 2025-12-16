
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { UserRole } from '@/lib/types/cms'
import { redirect } from 'next/navigation'

export async function createClient() {
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, options)
                        )
                    } catch {
                        // The `setAll` method was called from a Server Component.
                        // This can be ignored if you have middleware refreshing
                        // user sessions.
                    }
                },
            },
        }
    )
}

/**
 * Get current authenticated user
 */
export async function getUser() {
    const supabase = await createClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

/**
 * Get current user's role
 */
export async function getUserRole(): Promise<UserRole | null> {
    const supabase = await createClient()
    const user = await getUser()

    if (!user) return null

    const { data, error } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id)
        .single()

    if (error || !data) return null

    // @ts-expect-error: Supabase nested select types
    return (data.roles?.name as UserRole) || null
}

/**
 * Check if current user is admin
 */
export async function isAdmin(): Promise<boolean> {
    const role = await getUserRole()
    return role === UserRole.ADMIN
}

/**
 * Check if current user is editor or admin
 */
export async function isEditorOrAdmin(): Promise<boolean> {
    const role = await getUserRole()
    return role === UserRole.ADMIN || role === UserRole.EDITOR
}

/**
 * Require admin role or redirect to unauthorized page
 */
export async function requireAdmin() {
    const admin = await isAdmin()

    if (!admin) {
        redirect('/admin/unauthorized')
    }
}

/**
 * Require editor or admin role or redirect to unauthorized page
 */
export async function requireEditor() {
    const editor = await isEditorOrAdmin()

    if (!editor) {
        redirect('/admin/unauthorized')
    }
}

/**
 * Require authentication or redirect to login
 */
export async function requireAuth() {
    const user = await getUser()

    if (!user) {
        redirect('/login')
    }

    return user
}
