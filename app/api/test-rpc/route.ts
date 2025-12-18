/* eslint-disable */
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient();
        const adminClient = createAdminClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        // TEST 1: Check if RPC function exists
        const { data: rpcTest, error: rpcError } = await supabase.rpc('user_has_permission', {
            user_id: user.id,
            permission_name: 'view_tours'
        });

        // TEST 2: Manual query (bypass RPC)
        const { data: manualCheck } = await adminClient
            .from('user_roles')
            .select(`
                role_id,
                roles!inner(id, name),
                roles:roles(role_permissions!inner(permission_id, permissions!inner(name)))
            `)
            .eq('user_id', user.id);

        // TEST 3: Direct permission check via joins
        const { data: directCheck } = await adminClient.rpc('user_has_permission', {
            user_id: user.id,
            permission_name: 'view_tours'
        });

        // TEST 4: Get all user permissions manually
        const { data: allUserPerms } = await adminClient
            .from('user_roles')
            .select(`
                roles(
                    role_permissions(
                        permissions(name)
                    )
                )
            `)
            .eq('user_id', user.id);

        return NextResponse.json({
            userId: user.id,
            email: user.email,
            tests: {
                rpcFromUserClient: {
                    result: rpcTest,
                    error: rpcError?.message || null,
                    interpretation: rpcTest === true ? '✅ RPC works!' : '❌ RPC returned false/null'
                },
                rpcFromAdminClient: {
                    result: directCheck,
                    interpretation: directCheck === true ? '✅ RPC works with admin client!' : '❌ RPC failed'
                },
                manualJoinQuery: {
                    result: manualCheck,
                    hasData: manualCheck && manualCheck.length > 0
                },
                allUserPermissions: {
                    raw: allUserPerms,
                    permissionNames: extractPermissionNames(allUserPerms)
                }
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}

function extractPermissionNames(data: any): string[] {
    if (!data || !Array.length) return [];

    const perms: string[] = [];
    data.forEach((ur: any) => {
        ur.roles?.role_permissions?.forEach((rp: any) => {
            if (rp.permissions?.name) {
                perms.push(rp.permissions.name);
            }
        });
    });
    return perms;
}
