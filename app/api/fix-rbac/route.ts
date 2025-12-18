/* eslint-disable */
import { createAdminClient } from '@/lib/supabase/admin';
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Emergency RBAC Fix Endpoint
 * Forces admin role to have all permissions via direct SQL
 * 
 * Access: GET /api/fix-rbac
 */
export async function GET(request: NextRequest) {
    try {
        const adminClient = createAdminClient();

        // Step 1: Get admin role
        const { data: adminRole, error: roleError } = await adminClient
            .from('roles')
            .select('id, name')
            .eq('name', 'admin')
            .single();

        if (roleError || !adminRole) {
            return NextResponse.json({
                success: false,
                error: 'Admin role not found',
                details: roleError
            }, { status: 500 });
        }

        // Step 2: Get all permissions
        const { data: allPermissions, error: permError } = await adminClient
            .from('permissions')
            .select('id, name');

        if (permError || !allPermissions) {
            return NextResponse.json({
                success: false,
                error: 'Failed to fetch permissions',
                details: permError
            }, { status: 500 });
        }

        // Step 3: Check current assignments
        const { data: currentAssignments, error: checkError } = await adminClient
            .from('role_permissions')
            .select('permission_id')
            .eq('role_id', adminRole.id);

        const currentPermIds = new Set((currentAssignments || []).map(a => a.permission_id));

        // Step 4: Insert missing assignments
        const missingAssignments = allPermissions
            .filter(p => !currentPermIds.has(p.id))
            .map(p => ({
                role_id: adminRole.id,
                permission_id: p.id
            }));

        let insertCount = 0;
        if (missingAssignments.length > 0) {
            const { error: insertError } = await adminClient
                .from('role_permissions')
                .insert(missingAssignments);

            if (insertError) {
                return NextResponse.json({
                    success: false,
                    error: 'Failed to assign permissions',
                    details: insertError
                }, { status: 500 });
            }
            insertCount = missingAssignments.length;
        }

        // Step 5: Verify final count
        const { count: finalCount } = await adminClient
            .from('role_permissions')
            .select('*', { count: 'exact', head: true })
            .eq('role_id', adminRole.id);

        return NextResponse.json({
            success: true,
            data: {
                adminRole: adminRole.name,
                totalPermissions: allPermissions.length,
                previouslyAssigned: currentPermIds.size,
                newlyAssigned: insertCount,
                finalCount: finalCount,
                isComplete: finalCount === allPermissions.length
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
}
