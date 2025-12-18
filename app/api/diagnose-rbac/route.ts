import { createAdminClient } from '@/lib/supabase/admin';
/* eslint-disable */
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * RBAC Diagnostic Endpoint
 * Shows detailed state of RBAC system
 * 
 * Access: GET /api/diagnose-rbac
 */
export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const adminClient = createAdminClient();

        const { data: { user } } = await supabase.auth.getUser();

        // 1. Get roles
        const { data: roles } = await adminClient.from('roles').select('*');

        // 2. Get all permissions
        const { data: permissions } = await adminClient.from('permissions').select('*');

        // 3. Get admin role details
        const { data: adminRole } = await adminClient
            .from('roles')
            .select('id, name')
            .eq('name', 'admin')
            .single();

        // 4. Get admin role permissions
        const { data: adminRolePerms, count: adminPermCount } = await adminClient
            .from('role_permissions')
            .select('permission_id, permissions(name, resource, action)', { count: 'exact' })
            .eq('role_id', adminRole?.id || '');

        // 5. Get current user roles
        const { data: userRoles } = user ? await adminClient
            .from('user_roles')
            .select('role_id, roles(name)')
            .eq('user_id', user.id) : { data: null };

        // 6. Get current user permissions
        const { data: userPerms } = user ? await adminClient
            .rpc('get_user_permissions', { user_id: user.id }) : { data: null };

        // 7. Check specific permission
        const { data: viewToursExists } = await adminClient
            .from('permissions')
            .select('id')
            .eq('name', 'view_tours')
            .single();

        const { data: adminHasViewTours } = adminRole && viewToursExists ? await adminClient
            .from('role_permissions')
            .select('permission_id')
            .eq('role_id', adminRole.id)
            .eq('permission_id', viewToursExists.id)
            .maybeSingle() : { data: null };

        // 8. Test permission function
        let canViewTours = false;
        if (user) {
            const { data } = await supabase.rpc('user_has_permission', {
                user_id: user.id,
                permission_name: 'view_tours'
            });
            canViewTours = data || false;
        }

        return NextResponse.json({
            success: true,
            user: user ? {
                id: user.id,
                email: user.email
            } : null,
            system: {
                totalRoles: roles?.length || 0,
                totalPermissions: permissions?.length || 0,
                adminRoleExists: !!adminRole,
                adminPermissionCount: adminPermCount || 0,
                viewToursExists: !!viewToursExists,
                adminHasViewTours: !!adminHasViewTours
            },
            currentUser: user ? {
                roles: userRoles,
                permissionCount: userPerms?.length || 0,
                canViewToursFunction: canViewTours
            } : null,
            diagnosis: {
                issue: adminPermCount === 0 ? 'Admin role has ZERO permissions assigned' :
                    (adminPermCount || 0) < (permissions?.length || 0) ? `Admin role missing ${(permissions?.length || 0) - (adminPermCount || 0)} permissions` :
                        !adminHasViewTours ? 'Admin role does not have view_tours permission' :
                            !canViewTours ? 'User cannot view tours (permission check failed)' :
                                'System appears healthy',
                recommendation: adminPermCount === 0 ? 'Run /api/fix-rbac to assign all permissions to admin role' :
                    !canViewTours ? 'Check user_roles table - user might not be assigned admin role' :
                        'No action needed'
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
