import { createAdminClient } from '@/lib/supabase/admin';
/* eslint-disable */
import { createClient } from '@/lib/supabase/server';
import { NextRequest, NextResponse } from 'next/server';

/**
 * COMPLETE PERMISSION SEEDER
 * Creates ALL necessary permissions for the CMS system
 */
const ALL_PERMISSIONS = [
    // Dashboard
    { name: 'view_dashboard', resource: 'dashboard', action: 'read', description: 'View dashboard' },

    // Tours
    { name: 'view_tours', resource: 'tours', action: 'read', description: 'View tours' },
    { name: 'create_tours', resource: 'tours', action: 'create', description: 'Create new tours' },
    { name: 'edit_tours', resource: 'tours', action: 'update', description: 'Edit existing tours' },
    { name: 'delete_tours', resource: 'tours', action: 'delete', description: 'Delete tours' },
    { name: 'publish_tours', resource: 'tours', action: 'publish', description: 'Publish/unpublish tours' },
    { name: 'manage_tours', resource: 'tours', action: 'manage', description: 'Full tour management' },

    // Destinations (currently shares tour permissions)
    { name: 'view_destinations', resource: 'destinations', action: 'read', description: 'View destinations' },
    { name: 'create_destinations', resource: 'destinations', action: 'create', description: 'Create destinations' },
    { name: 'edit_destinations', resource: 'destinations', action: 'update', description: 'Edit destinations' },
    { name: 'delete_destinations', resource: 'destinations', action: 'delete', description: 'Delete destinations' },
    { name: 'manage_destinations', resource: 'destinations', action: 'manage', description: 'Full destination management' },

    // Bookings
    { name: 'view_bookings', resource: 'bookings', action: 'read', description: 'View bookings' },
    { name: 'create_bookings', resource: 'bookings', action: 'create', description: 'Create bookings' },
    { name: 'edit_bookings', resource: 'bookings', action: 'update', description: 'Edit bookings' },
    { name: 'delete_bookings', resource: 'bookings', action: 'delete', description: 'Delete bookings' },
    { name: 'manage_bookings', resource: 'bookings', action: 'manage', description: 'Full booking management' },

    // Blog
    { name: 'view_posts', resource: 'blog', action: 'read', description: 'View blog posts' },
    { name: 'create_posts', resource: 'blog', action: 'create', description: 'Create blog posts' },
    { name: 'edit_posts', resource: 'blog', action: 'update', description: 'Edit blog posts' },
    { name: 'delete_posts', resource: 'blog', action: 'delete', description: 'Delete blog posts' },
    { name: 'publish_posts', resource: 'blog', action: 'publish', description: 'Publish blog posts' },
    { name: 'manage_blog', resource: 'blog', action: 'manage', description: 'Full blog management' },

    // Media
    { name: 'view_media', resource: 'media', action: 'read', description: 'View media library' },
    { name: 'upload_media', resource: 'media', action: 'create', description: 'Upload files' },
    { name: 'delete_media', resource: 'media', action: 'delete', description: 'Delete files' },
    { name: 'manage_media', resource: 'media', action: 'manage', description: 'Manage media library' },

    // Users
    { name: 'view_users', resource: 'users', action: 'read', description: 'View user list' },
    { name: 'create_users', resource: 'users', action: 'create', description: 'Create users' },
    { name: 'edit_users', resource: 'users', action: 'update', description: 'Edit users' },
    { name: 'delete_users', resource: 'users', action: 'delete', description: 'Delete users' },
    { name: 'manage_users', resource: 'users', action: 'manage', description: 'Create, edit, delete users' },
    { name: 'assign_roles', resource: 'users', action: 'assign_roles', description: 'Assign roles to users' },

    // Customers
    { name: 'view_customers', resource: 'customers', action: 'read', description: 'View customers' },
    { name: 'manage_customers', resource: 'customers', action: 'manage', description: 'Manage customer data' },

    // Settings
    { name: 'view_settings', resource: 'settings', action: 'read', description: 'View settings' },
    { name: 'manage_settings', resource: 'settings', action: 'manage', description: 'Manage site settings' },

    // Roles
    { name: 'view_roles', resource: 'roles', action: 'read', description: 'View roles' },
    { name: 'manage_roles', resource: 'roles', action: 'manage', description: 'Manage roles and permissions' },

    // Analytics
    { name: 'view_analytics', resource: 'analytics', action: 'read', description: 'View analytics dashboard' },
    { name: 'export_analytics', resource: 'analytics', action: 'export', description: 'Export analytics data' },
];

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({
                success: false,
                error: 'Bạn chưa đăng nhập'
            }, { status: 401 });
        }

        const adminClient = createAdminClient();

        // STEP 1: Ensure permissions exist
        const { error: permError } = await adminClient
            .from('permissions')
            .upsert(ALL_PERMISSIONS, { onConflict: 'name' });

        if (permError) {
            return NextResponse.json({
                success: false,
                error: `Failed to create permissions: ${permError.message}`
            }, { status: 500 });
        }

        // STEP 2: Get admin role
        let { data: adminRole } = await adminClient
            .from('roles')
            .select('id')
            .eq('name', 'admin')
            .maybeSingle();

        if (!adminRole) {
            const { data: newRole, error } = await adminClient
                .from('roles')
                .insert({ name: 'admin', description: 'Super Admin - Full Access' })
                .select('id')
                .single();

            if (error) {
                return NextResponse.json({
                    success: false,
                    error: `Failed to create admin role: ${error.message}`
                }, { status: 500 });
            }
            adminRole = newRole;
        }

        // STEP 3: Get ALL permissions from DB
        const { data: allPerms } = await adminClient
            .from('permissions')
            .select('id, name');

        if (!allPerms || allPerms.length === 0) {
            return NextResponse.json({
                success: false,
                error: 'No permissions found after seeding'
            }, { status: 500 });
        }

        // STEP 4: Delete old role_permissions for admin (clean slate)
        await adminClient
            .from('role_permissions')
            .delete()
            .eq('role_id', adminRole.id);

        // STEP 5: Assign ALL permissions to admin
        const rolePerms = allPerms.map(p => ({
            role_id: adminRole.id,
            permission_id: p.id
        }));

        const { error: assignError } = await adminClient
            .from('role_permissions')
            .insert(rolePerms);

        if (assignError) {
            return NextResponse.json({
                success: false,
                error: `Failed to assign permissions: ${assignError.message}`
            }, { status: 500 });
        }

        // STEP 6: Delete old user_roles (clean)
        await adminClient
            .from('user_roles')
            .delete()
            .eq('user_id', user.id);

        // STEP 7: Assign admin role to current user
        const { error: userRoleError } = await adminClient
            .from('user_roles')
            .insert({
                user_id: user.id,
                role_id: adminRole.id
                // assigned_by removed - column doesn't exist in DB
            });

        if (userRoleError) {
            return NextResponse.json({
                success: false,
                error: `Failed to assign role: ${userRoleError.message}`
            }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: '🎉 HOÀN TẤT! Tài khoản của bạn đã có FULL QUYỀN!',
            data: {
                user: {
                    id: user.id,
                    email: user.email
                },
                permissions: {
                    seeded: ALL_PERMISSIONS.length,
                    assignedToAdmin: allPerms.length,
                    categories: {
                        tours: allPerms.filter(p => p.name.includes('tour')).length,
                        destinations: allPerms.filter(p => p.name.includes('destination')).length,
                        bookings: allPerms.filter(p => p.name.includes('booking')).length,
                        blog: allPerms.filter(p => p.name.includes('blog') || p.name.includes('post')).length,
                        dashboard: allPerms.filter(p => p.name.includes('dashboard')).length,
                        other: allPerms.filter(p => !['tour', 'destination', 'booking', 'blog', 'post', 'dashboard'].some(k => p.name.includes(k))).length
                    }
                },
                nextSteps: [
                    '✅ Refresh trình duyệt (Ctrl+R)',
                    '✅ Truy cập /admin/tours',
                    '✅ Truy cập /admin/destinations',
                    '✅ Truy cập /admin/bookings',
                    '✅ Truy cập /admin/blog',
                    '✅ Tất cả đều phải hoạt động!'
                ]
            }
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            error: `System error: ${error.message}`
        }, { status: 500 });
    }
}
