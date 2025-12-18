-- ============================================
-- EMERGENCY FIX: Assign All Permissions to Admin Role
-- ============================================
-- This migration ensures the admin role has ALL permissions
-- Run this if the repair button is not working

-- Step 1: Verify admin role exists
DO $$
DECLARE
    admin_role_id UUID;
BEGIN
    SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
    
    IF admin_role_id IS NULL THEN
        RAISE NOTICE 'Admin role not found, creating...';
        INSERT INTO roles (name, description) 
        VALUES ('admin', 'Full system access')
        RETURNING id INTO admin_role_id;
        RAISE NOTICE 'Admin role created with id: %', admin_role_id;
    ELSE
        RAISE NOTICE 'Admin role exists with id: %', admin_role_id;
    END IF;
END $$;

-- Step 2: Assign ALL permissions to admin role
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
    (SELECT id FROM roles WHERE name = 'admin'),
    p.id
FROM permissions p
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Step 3: Verify the assignment
DO $$
DECLARE
    total_perms INT;
    admin_perms INT;
BEGIN
    SELECT COUNT(*) INTO total_perms FROM permissions;
    SELECT COUNT(*) INTO admin_perms 
    FROM role_permissions 
    WHERE role_id = (SELECT id FROM roles WHERE name = 'admin');
    
    RAISE NOTICE 'Total permissions in system: %', total_perms;
    RAISE NOTICE 'Permissions assigned to admin: %', admin_perms;
    
    IF admin_perms = total_perms THEN
        RAISE NOTICE '✓ SUCCESS: Admin role has all permissions!';
    ELSE
        RAISE WARNING '✗ WARNING: Admin role only has % out of % permissions!', admin_perms, total_perms;
    END IF;
END $$;

-- Step 4: Show current admin users (for verification)
DO $$
DECLARE
    admin_user RECORD;
BEGIN
    RAISE NOTICE 'Current admin users:';
    FOR admin_user IN 
        SELECT u.email, ur.user_id
        FROM user_roles ur
        JOIN auth.users u ON ur.user_id = u.id
        WHERE ur.role_id = (SELECT id FROM roles WHERE name = 'admin')
    LOOP
        RAISE NOTICE '  - % (ID: %)', admin_user.email, admin_user.user_id;
    END LOOP;
END $$;
