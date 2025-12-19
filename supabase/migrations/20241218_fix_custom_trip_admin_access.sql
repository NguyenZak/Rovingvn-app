
-- Fix Admin Access to custom_trips
-- The previous policy might be failing due to recursion or restricted access to user_roles

-- 1. Create a secure function to check for admin role that bypasses RLS
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop existing Admin policies on custom_trips
DROP POLICY IF EXISTS "Admins can view all custom trips" ON custom_trips;
DROP POLICY IF EXISTS "Admins can update custom trips" ON custom_trips;
DROP POLICY IF EXISTS "Admins can delete custom trips" ON custom_trips;

-- 3. Re-create strictly using the SECURITY DEFINER function
CREATE POLICY "Admins can view all custom trips"
    ON custom_trips
    FOR SELECT
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admins can update custom trips"
    ON custom_trips
    FOR UPDATE
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admins can delete custom trips"
    ON custom_trips
    FOR DELETE
    TO authenticated
    USING (is_admin());

-- 4. Notify schema reload
NOTIFY pgrst, 'reload schema';
