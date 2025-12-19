
-- Fix "permission denied for table users" error

-- 1. Ensure authenticated users can read user_roles (needed for is_admin check context sometimes)
GRANT SELECT ON TABLE public.user_roles TO authenticated;

-- 2. Explicitly grant access to custom_trips again
GRANT ALL ON TABLE public.custom_trips TO authenticated;
GRANT ALL ON TABLE public.custom_trips TO anon;

-- 3. Check for public.users and grant access if it exists (Safe block)
DO $$
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users') THEN
        EXECUTE 'GRANT SELECT ON TABLE public.users TO authenticated';
        EXECUTE 'GRANT SELECT ON TABLE public.users TO anon';
    END IF;
END $$;

-- 4. Re-assert SECURITY DEFINER on is_admin
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

-- 5. Reload schema
NOTIFY pgrst, 'reload schema';
