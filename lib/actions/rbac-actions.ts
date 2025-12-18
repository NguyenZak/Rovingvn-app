"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

/**
 * Repair RBAC System
 * 1. Ensures 'admin' role exists
 * 2. Ensures default permissions exist (view_tours, etc.)
 * 3. Assigns all permissions to 'admin' role
 * 4. Assigns 'admin' role to current user
 */
export async function repairRBACSystem() {
    try {
        // Check for service role key
        if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
            console.error('CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing');
            return {
                success: false,
                error: 'Configuration Error: SUPABASE_SERVICE_ROLE_KEY is not configured in .env.local. This is required to bypass RLS for admin setup.'
            };
        }

        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false, error: 'Not authenticated' };
        }

        // USE ADMIN CLIENT TO BYPASS RLS
        const adminClient = createAdminClient();
        console.log('Using admin client to bypass RLS');

        // 1. Ensure Admin Role Exists
        const { data: existingRole, error: fetchRoleError } = await adminClient
            .from('roles')
            .select('id, name')
            .eq('name', 'admin')
            .maybeSingle();

        let adminRole = existingRole;

        if (fetchRoleError) {
            console.error('Error fetching admin role:', fetchRoleError);
            return { success: false, error: `Database error fetching admin role: ${fetchRoleError.message}` };
        }

        if (!adminRole) {
            console.log('Creating admin role...');
            const { data: newRole, error: createRoleError } = await adminClient
                .from('roles')
                .insert({ name: 'admin', description: 'Full system access' })
                .select('id, name')
                .single();

            if (createRoleError) {
                console.error('Error creating admin role:', createRoleError);
                return { success: false, error: `Failed to create admin role: ${createRoleError.message}` };
            }
            adminRole = newRole;
            console.log('✓ Admin role created');
        } else {
            console.log('✓ Admin role exists');
        }

        // 2. Ensure Critical Permissions Exist
        console.log('Ensuring permissions exist...');
        const defaultPermissions = [
            // Tours
            { name: 'view_tours', resource: 'tours', action: 'read', description: 'View tours' },
            { name: 'manage_tours', resource: 'tours', action: 'manage', description: 'Full tour management' },
            { name: 'create_tours', resource: 'tours', action: 'create', description: 'Create new tours' },
            { name: 'edit_tours', resource: 'tours', action: 'update', description: 'Edit existing tours' },
            { name: 'delete_tours', resource: 'tours', action: 'delete', description: 'Delete tours' },
            { name: 'publish_tours', resource: 'tours', action: 'publish', description: 'Publish/unpublish tours' },
            // Users
            { name: 'view_users', resource: 'users', action: 'read', description: 'View user list' },
            { name: 'manage_users', resource: 'users', action: 'manage', description: 'Create, edit, delete users' },
            // Settings
            { name: 'view_settings', resource: 'settings', action: 'read', description: 'View settings' },
            { name: 'manage_settings', resource: 'settings', action: 'manage', description: 'Manage site settings' },
        ];

        const { error: permError } = await adminClient
            .from('permissions')
            .upsert(defaultPermissions, { onConflict: 'name' });

        if (permError) {
            console.error('Error ensuring permissions:', permError);
            return { success: false, error: `Failed to create permissions: ${permError.message}` };
        }
        console.log(`✓ ${defaultPermissions.length} permissions ensured`);

        // 3. Get All Permissions and Assign to Admin Role
        const { data: allPermissions, error: permFetchError } = await adminClient
            .from('permissions')
            .select('id');

        if (permFetchError) {
            console.error('Error fetching permissions:', permFetchError);
            return { success: false, error: `Failed to fetch permissions: ${permFetchError.message}` };
        }

        if (!allPermissions || allPermissions.length === 0) {
            return { success: false, error: 'No permissions found in database' };
        }

        console.log(`Assigning ${allPermissions.length} permissions to admin role...`);
        const rolePermInserts = allPermissions.map(p => ({
            role_id: adminRole.id,
            permission_id: p.id
        }));

        const { error: assignError } = await adminClient
            .from('role_permissions')
            .upsert(rolePermInserts, { onConflict: 'role_id,permission_id', ignoreDuplicates: true });

        if (assignError) {
            console.error('Error assigning permissions to role:', assignError);
            return { success: false, error: `Failed to assign permissions to admin role: ${assignError.message}` };
        }
        console.log('✓ All permissions assigned to admin role');

        // 4. Assign Admin Role to Current User
        console.log('Assigning admin role to current user...');

        // First check if already assigned
        const { data: existingUserRole } = await adminClient
            .from('user_roles')
            .select('user_id')
            .eq('user_id', user.id)
            .eq('role_id', adminRole.id)
            .maybeSingle();

        if (existingUserRole) {
            console.log('✓ User already has admin role');
        } else {
            const { error: userRoleError } = await adminClient
                .from('user_roles')
                .insert({
                    user_id: user.id,
                    role_id: adminRole.id,
                    assigned_by: user.id
                });

            if (userRoleError) {
                console.error('Error assigning admin role to user:', userRoleError);
                return {
                    success: false,
                    error: `Failed to assign admin role to user: ${userRoleError.message} (Code: ${userRoleError.code})`
                };
            }
            console.log('✓ Admin role assigned to user');
        }

        revalidatePath('/admin/debug-permissions');
        revalidatePath('/admin');
        revalidatePath('/admin/tours');

        return { success: true, message: 'RBAC system repaired successfully!' };
    } catch (error) {
        console.error('Unexpected error in repairRBACSystem:', error);
        return {
            success: false,
            error: `Unexpected error: ${(error as Error)?.message || JSON.stringify(error)}`
        };
    }
}

/**
 * Deprecated: Use repairRBACSystem instead
 */
export async function seedAdminPermissions() {
    return repairRBACSystem();
}

export interface Role {
    id: string
    name: string
    description: string
}

export interface Permission {
    id: string
    name: string
    description: string
    resource: string
    action: string
}

export interface UserWithRoles {
    id: string
    email: string
    created_at: string
    roles: Role[]
}

/**
 * Assign a role to a user
 */
export async function assignRole(userId: string, roleId: string) {
    try {
        const adminClient = createAdminClient()

        // check if already assigned
        const { data: existing } = await adminClient
            .from('user_roles')
            .select('*')
            .eq('user_id', userId)
            .eq('role_id', roleId)
            .single()

        if (existing) {
            return { success: true, message: 'Role already assigned' }
        }

        // Get current user for assigned_by
        const supabase = await createClient()
        const { data: { user } } = await supabase.auth.getUser()

        const { error } = await adminClient
            .from('user_roles')
            .insert({
                user_id: userId,
                role_id: roleId,
                assigned_by: user?.id
            })

        if (error) {
            console.error('Error assigning role:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error in assignRole:', error)
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Remove a role from a user
 */
export async function removeRole(userId: string, roleId: string) {
    try {
        const adminClient = createAdminClient()

        const { error } = await adminClient
            .from('user_roles')
            .delete()
            .eq('user_id', userId)
            .eq('role_id', roleId)

        if (error) {
            console.error('Error removing role:', error)
            return { success: false, error: error.message }
        }

        revalidatePath('/admin/users')
        return { success: true }
    } catch (error) {
        console.error('Error in removeRole:', error)
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Get all users with their roles
 */
export async function getAllUsersWithRoles(): Promise<{ success: boolean; data?: UserWithRoles[]; error?: string }> {
    try {
        const adminClient = createAdminClient()

        // Get profiles from our public.profiles orauth.users?
        // Usually we shouldn't access auth.users directly unless we are in an admin function using service key.
        // Let's assume we map from auth.users using adminClient listUsers or similar, 
        // BUT Supabase JS admin client 'auth.admin.listUsers()' is the way to go for auth users.
        // However, 'createAdminClient' here returns a supabase client with service role key.

        const { data: { users }, error: usersError } = await adminClient.auth.admin.listUsers()

        if (usersError) throw usersError

        if (!users) return { success: true, data: [] }

        // Get all user roles
        const { data: userRoles, error: rolesError } = await adminClient
            .from('user_roles')
            .select('user_id, roles(id, name, description)')

        if (rolesError) throw rolesError

        // Map users to UserWithRoles
        const mappedUsers: UserWithRoles[] = users.map(u => {
            const userRoleEntries = userRoles?.filter(ur => ur.user_id === u.id) || []
            const roles = userRoleEntries.map(ur => {
                const r = ur.roles as unknown;
                return Array.isArray(r) ? r[0] : r;
            }).filter(Boolean) as Role[]

            return {
                id: u.id,
                email: u.email || '',
                created_at: u.created_at,
                roles
            }
        })

        return { success: true, data: mappedUsers }
    } catch (error) {
        console.error('Error fetching users:', error)
        return { success: false, error: (error as Error).message }
    }
}

/**
 * Get all available roles
 */
export async function getAllRoles() {
    try {
        const supabase = await createClient()
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('name')

        if (error) throw error
        return { success: true, data }
    } catch (error) {
        return { success: false, error: (error as Error).message }
    }
}
