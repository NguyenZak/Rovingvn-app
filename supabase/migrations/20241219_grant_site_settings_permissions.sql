-- Grant full permissions on site_settings table
-- This allows authenticated users to manage site settings

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Admins can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can manage site settings" ON site_settings;

-- Create permissive policies for authenticated users
CREATE POLICY "Authenticated users can view site settings"
    ON site_settings
    FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can insert site settings"
    ON site_settings
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Authenticated users can update site settings"
    ON site_settings
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Authenticated users can delete site settings"
    ON site_settings
    FOR DELETE
    TO authenticated
    USING (true);

-- Also allow anonymous users to view settings (for public pages)
CREATE POLICY "Anyone can view site settings"
    ON site_settings
    FOR SELECT
    TO anon
    USING (true);

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd
FROM pg_policies
WHERE tablename = 'site_settings'
ORDER BY policyname;
