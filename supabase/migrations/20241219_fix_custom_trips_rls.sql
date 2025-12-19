-- Fix custom_trips RLS policies to use correct is_admin() function signature
-- The policies were calling is_admin() without parameters, but the function requires a UUID parameter

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all custom trips" ON custom_trips;
DROP POLICY IF EXISTS "Admins can update custom trips" ON custom_trips;
DROP POLICY IF EXISTS "Admins can delete custom trips" ON custom_trips;
DROP POLICY IF EXISTS "Anyone can submit custom trip requests" ON custom_trips;

-- Recreate policies with correct function signature
CREATE POLICY "Anyone can submit custom trip requests"
    ON custom_trips
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view all custom trips"
    ON custom_trips
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update custom trips"
    ON custom_trips
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete custom trips"
    ON custom_trips
    FOR DELETE
    TO authenticated
    USING (is_admin(auth.uid()));

-- Force schema reload
NOTIFY pgrst, 'reload schema';
