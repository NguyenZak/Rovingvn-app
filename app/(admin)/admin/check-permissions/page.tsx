import { createClient } from '@/lib/supabase/server';
import { hasPermission } from '@/lib/rbac/permissions';
import Link from 'next/link';

export default async function QuickCheckPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return <div className="p-8">Chưa đăng nhập</div>;
    }

    // Check all critical permissions
    const permissions = {
        'view_tours': await hasPermission('view_tours'),
        'manage_tours': await hasPermission('manage_tours'),
        'view_bookings': await hasPermission('view_bookings'),
        'manage_bookings': await hasPermission('manage_bookings'),
        'view_destinations': await hasPermission('view_destinations'),
        'manage_destinations': await hasPermission('manage_destinations'),
        'manage_blog': await hasPermission('manage_blog'),
        'view_dashboard': await hasPermission('view_dashboard'),
    };

    // Get user roles directly
    const { data: userRoles } = await supabase
        .from('user_roles')
        .select('roles(name)')
        .eq('user_id', user.id);

    // Count permissions for admin role
    const { data: adminRole } = await supabase
        .from('roles')
        .select('id')
        .eq('name', 'admin')
        .single();

    const { count: adminPermCount } = adminRole ? await supabase
        .from('role_permissions')
        .select('*', { count: 'exact', head: true })
        .eq('role_id', adminRole.id) : { count: 0 };

    const hasAnyPermission = Object.values(permissions).some(p => p === true);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold">🔍 Permission Check</h1>

                {/* Status Alert */}
                <div className={`p-6 rounded-lg border-2 ${hasAnyPermission ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                    <h2 className="text-xl font-bold mb-2">
                        {hasAnyPermission ? '✅ Có Permissions' : '❌ KHÔNG CÓ Permissions'}
                    </h2>
                    <p className="text-sm">
                        User: <strong>{user.email}</strong>
                    </p>
                </div>

                {/* User Roles */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Roles của bạn:</h3>
                    {userRoles && userRoles.length > 0 ? (
                        <div className="space-y-2">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            {userRoles.map((ur: any, i: number) => (
                                <div key={i} className="px-4 py-2 bg-blue-50 rounded">
                                    <strong>{ur.roles?.name || 'Unknown'}</strong>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-red-600 font-bold">⚠️ KHÔNG CÓ ROLE NÀO!</div>
                    )}
                </div>

                {/* Admin Role Info */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Admin Role Status:</h3>
                    <div className="space-y-2">
                        <div>Admin role tồn tại: <strong className={adminRole ? 'text-green-600' : 'text-red-600'}>{adminRole ? '✓ Có' : '✗ Không'}</strong></div>
                        <div>Permissions của admin role: <strong className={adminPermCount && adminPermCount > 0 ? 'text-green-600' : 'text-red-600'}>{adminPermCount || 0}</strong></div>
                    </div>
                </div>

                {/* Permission Checks */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">Permission Checks:</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.entries(permissions).map(([perm, has]) => (
                            <div key={perm} className={`p-3 rounded ${has ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">{has ? '✓' : '✗'}</span>
                                    <span className="font-mono text-sm">{perm}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Fix Button */}
                {!hasAnyPermission && (
                    <div className="bg-yellow-50 border-2 border-yellow-400 p-6 rounded-lg">
                        <h3 className="font-bold text-lg mb-4">🔧 Cần Fix Permissions?</h3>
                        <p className="mb-4">Bấm nút dưới để tự động gán FULL quyền:</p>
                        <Link
                            href="/api/make-superadmin"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                        >
                            🚀 Fix Permissions Ngay
                        </Link>
                        <p className="mt-4 text-sm text-gray-600">
                            Sau khi click, refresh lại trang này để kiểm tra
                        </p>
                    </div>
                )}

                {/* Test Links */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="font-bold text-lg mb-4">🧪 Test Access:</h3>
                    <div className="space-y-2">
                        <Link href="/admin/tours" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                            → /admin/tours
                        </Link>
                        <Link href="/admin/destinations" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                            → /admin/destinations
                        </Link>
                        <Link href="/admin/bookings" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                            → /admin/bookings
                        </Link>
                        <Link href="/admin/blog" className="block px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded">
                            → /admin/blog
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
