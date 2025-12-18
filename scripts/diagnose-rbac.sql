-- ============================================
-- RBAC DIAGNOSTIC QUERIES
-- ============================================
-- Run these queries in Supabase SQL Editor to diagnose issues

-- 1. Check if roles exist
SELECT 'Roles in system:' AS info;
SELECT * FROM roles ORDER BY name;

-- 2. Check total permissions
SELECT 'Total Permissions:' AS info;
SELECT COUNT(*) as total_permissions FROM permissions;

-- 3. Check admin role details
SELECT 'Admin Role Details:' AS info;
SELECT * FROM roles WHERE name = 'admin';

-- 4. Check permissions assigned to admin role
SELECT 'Permissions assigned to Admin Role:' AS info;
SELECT COUNT(*) as admin_permission_count
FROM role_permissions rp
WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'admin');

-- 5. List all permissions assigned to admin
SELECT 'Admin Role Permissions List:' AS info;
SELECT p.name, p.resource, p.action, p.description
FROM role_permissions rp
JOIN permissions p ON rp.permission_id = p.id
WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'admin')
ORDER BY p.resource, p.action;

-- 6. Check if view_tours permission exists
SELECT 'view_tours Permission:' AS info;
SELECT * FROM permissions WHERE name = 'view_tours';

-- 7. Check if view_tours is assigned to admin
SELECT 'view_tours assigned to admin?:' AS info;
SELECT EXISTS(
    SELECT 1 
    FROM role_permissions rp
    JOIN permissions p ON rp.permission_id = p.id
    WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'admin')
    AND p.name = 'view_tours'
) as is_assigned;

-- 8. List all users with admin role
SELECT 'Users with Admin Role:' AS info;
SELECT 
    u.id,
    u.email,
    ur.assigned_at
FROM user_roles ur
JOIN auth.users u ON ur.user_id = u.id
WHERE ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
ORDER BY ur.assigned_at DESC;

-- 9. Check current user's roles (replace YOUR_USER_ID with actual ID)
-- SELECT 'Current User Roles:' AS info;
-- SELECT r.name, r.description
-- FROM user_roles ur
-- JOIN roles r ON ur.role_id = r.id
-- WHERE ur.user_id = 'YOUR_USER_ID';

-- 10. Check current user's effective permissions (replace YOUR_USER_ID)
-- SELECT 'Current User Permissions:' AS info;
-- SELECT DISTINCT p.name, p.resource, p.action
-- FROM user_roles ur
-- JOIN role_permissions rp ON ur.role_id = rp.role_id
-- JOIN permissions p ON rp.permission_id = p.id
-- WHERE ur.user_id = 'YOUR_USER_ID'
-- ORDER BY p.resource, p.name;

-- 11. Test the user_has_permission function (replace YOUR_USER_ID)
-- SELECT user_has_permission('YOUR_USER_ID'::uuid, 'view_tours') as can_view_tours;

-- 12. Comparison: What permissions are missing from admin?
SELECT 'Permissions NOT assigned to admin:' AS info;
SELECT p.name, p.resource, p.action
FROM permissions p
WHERE p.id NOT IN (
    SELECT rp.permission_id
    FROM role_permissions rp
    WHERE rp.role_id = (SELECT id FROM roles WHERE name = 'admin')
)
ORDER BY p.resource, p.name;
