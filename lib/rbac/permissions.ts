/**
 * RBAC Utility Functions - FIXED VERSION
 * Uses direct database queries instead of RPC functions
 */

"use server";

import { createClient } from "@/lib/supabase/server";

export interface Role {
    id: string;
    name: string;
    description: string;
}

export interface Permission {
    id: string;
    name: string;
    description: string;
    resource: string;
    action: string;
}

/**
 * Check if current user has a specific permission
 * UPDATED: Direct query instead of RPC for reliability
 */
export async function hasPermission(permissionName: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.log('[hasPermission] No user found');
            return false;
        }

        // Direct query approach - more reliable than RPC
        const { data, error } = await supabase
            .from('user_roles')
            .select(`
                roles!inner(
                    role_permissions!inner(
                        permissions!inner(name)
                    )
                )
            `)
            .eq('user_id', user.id);

        if (error) {
            console.error('[hasPermission] Query error:', error);
            return false;
        }

        if (!data || data.length === 0) {
            console.log('[hasPermission] No roles found for user');
            return false;
        }

        // Check if permission exists in any role
        for (const userRole of data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const role = (userRole as any).roles;
            if (role && role.role_permissions) {
                for (const rolePerm of role.role_permissions) {
                    if (rolePerm.permissions && rolePerm.permissions.name === permissionName) {
                        console.log(`[hasPermission] ✓ User has permission: ${permissionName}`);
                        return true;
                    }
                }
            }
        }

        console.log(`[hasPermission] ✗ User does NOT have permission: ${permissionName}`);
        return false;

    } catch (error) {
        console.error('[hasPermission] Unexpected error:', error);
        return false;
    }
}

/**
 * Check if current user has a specific role
 */
export async function hasRole(roleName: string): Promise<boolean> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return false;

        const { data, error } = await supabase
            .from('user_roles')
            .select('roles!inner(name)')
            .eq('user_id', user.id);

        if (error || !data) return false;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return data.some((ur: any) => ur.roles?.name === roleName);
    } catch (error) {
        console.error('Error checking role:', error);
        return false;
    }
}

/**
 * Get all roles for current user
 */
export async function getUserRoles(): Promise<Role[]> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('user_roles')
            .select('roles(id, name, description)')
            .eq('user_id', user.id);

        if (error || !data) return [];

        return data
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((ur: any) => ur.roles)
            .filter(Boolean);
    } catch (error) {
        console.error('Error getting user roles:', error);
        return [];
    }
}

/**
 * Get all permissions for current user
 */
export async function getUserPermissions(): Promise<Permission[]> {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) return [];

        const { data, error } = await supabase
            .from('user_roles')
            .select(`
                roles!inner(
                    role_permissions!inner(
                        permissions(id, name, description, resource, action)
                    )
                )
            `)
            .eq('user_id', user.id);

        if (error || !data) {
            console.error('Error getting user permissions:', error);
            return [];
        }

        // Flatten and deduplicate permissions
        const permissionsMap = new Map<string, Permission>();

        for (const userRole of data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const role = (userRole as any).roles;
            if (role && role.role_permissions) {
                for (const rolePerm of role.role_permissions) {
                    const perm = rolePerm.permissions;
                    if (perm && perm.id) {
                        permissionsMap.set(perm.id, perm);
                    }
                }
            }
        }

        return Array.from(permissionsMap.values());
    } catch (error) {
        console.error('Error getting user permissions:', error);
        return [];
    }
}

/**
 * Require permission or throw error
 */
export async function requirePermission(permissionName: string): Promise<void> {
    const allowed = await hasPermission(permissionName);
    if (!allowed) {
        throw new Error(`Permission denied: ${permissionName}`);
    }
}
