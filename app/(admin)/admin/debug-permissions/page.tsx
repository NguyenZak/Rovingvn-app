import { createClient } from "@/lib/supabase/server";
import { getUserRoles, getUserPermissions, hasPermission } from "@/lib/rbac/permissions";
import { FixPermissionsButton } from "./FixPermissionsButton";

export default async function DebugPermissionsPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const roles = await getUserRoles();
    const permissions = await getUserPermissions();
    const canViewTours = await hasPermission('view_tours');

    // Deep diagnostics
    const { count: totalPermissions } = await supabase.from('permissions').select('*', { count: 'exact', head: true });
    const { data: viewToursPerm } = await supabase.from('permissions').select('id').eq('name', 'view_tours').single();
    const { data: adminRole } = await supabase.from('roles').select('id').eq('name', 'admin').single();

    // Check how many permissions the admin role has
    const { count: adminPermCount } = await supabase
        .from('role_permissions')
        .select('*', { count: 'exact', head: true })
        .eq('role_id', adminRole?.id || '');

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Debug Permissions</h1>
                <FixPermissionsButton />
            </div>

            {/* System Health */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-500">Total System Permissions</div>
                    <div className="text-2xl font-bold">{totalPermissions || 0}</div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-500">&apos;view_tours&apos; Permission</div>
                    <div className={`text-lg font-bold ${viewToursPerm ? 'text-green-600' : 'text-red-600'}`}>
                        {viewToursPerm ? 'Exists' : 'MISSING'}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-500">Admin Role</div>
                    <div className={`text-lg font-bold ${adminRole ? 'text-green-600' : 'text-red-600'}`}>
                        {adminRole ? 'Exists' : 'MISSING'}
                    </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border">
                    <div className="text-sm text-gray-500">Admin Role Permissions</div>
                    <div className={`text-2xl font-bold ${adminPermCount && adminPermCount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {adminPermCount || 0}
                    </div>
                    <div className="text-xs text-gray-400">Should be {totalPermissions}</div>
                </div>
            </div>

            {/* Check Result */}
            <div className={`p-4 rounded-lg border ${canViewTours ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                <h2 className="font-bold text-lg mb-2">Access Check</h2>
                <div className="flex items-center gap-2">
                    <span className="font-semibold">can view_tours:</span>
                    <span className="px-2 py-1 rounded bg-white font-mono text-sm border">
                        {canViewTours ? 'TRUE' : 'FALSE'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Info */}
                <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <h2 className="font-bold text-xl border-b pb-2">User Information</h2>
                    <div className="space-y-2">
                        <div>
                            <span className="text-gray-500 text-sm block">ID</span>
                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{user?.id}</code>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm block">Email</span>
                            <span className="font-medium">{user?.email}</span>
                        </div>
                        <div>
                            <span className="text-gray-500 text-sm block">Metadata</span>
                            <pre className="bg-gray-100 p-2 rounded text-xs overflow-auto mt-1">
                                {JSON.stringify(user?.user_metadata, null, 2)}
                            </pre>
                        </div>
                    </div>
                </section>

                {/* Roles */}
                <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4">
                    <h2 className="font-bold text-xl border-b pb-2">Assigned Roles</h2>
                    {roles.length > 0 ? (
                        <div className="space-y-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {roles.map((role: any) => (
                                <div key={role.id} className="p-3 bg-blue-50 text-blue-800 rounded-lg border border-blue-100">
                                    <div className="font-bold text-lg">{role.name}</div>
                                    <div className="text-sm opacity-80">{role.description}</div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                            No roles assigned to this user
                        </div>
                    )}
                </section>

                {/* Permissions */}
                <section className="bg-white p-6 rounded-xl shadow-sm border space-y-4 col-span-full">
                    <h2 className="font-bold text-xl border-b pb-2">
                        Effective Permissions
                        <span className="ml-2 text-sm font-normal text-gray-500">({permissions.length})</span>
                    </h2>

                    {permissions.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {permissions.map((perm: any) => (
                                <div key={perm.id} className="p-2 border rounded hover:bg-gray-50 text-sm">
                                    <div className="font-medium text-gray-900">{perm.name}</div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        {perm.resource} • {perm.action}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
                            No permissions found for this user
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
