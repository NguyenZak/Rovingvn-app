
-- Comprehensive fix for custom_trips permissions

-- 1. Grant usage on schema public to anon and authenticated
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;

-- 2. Grant all privileges on custom_trips to anon and authenticated
GRANT ALL ON TABLE public.custom_trips TO anon;
GRANT ALL ON TABLE public.custom_trips TO authenticated;
GRANT ALL ON TABLE public.custom_trips TO service_role;

-- 3. Ensure RLS is enabled
ALTER TABLE public.custom_trips ENABLE ROW LEVEL SECURITY;

-- 4. Re-create the INSERT policy for public
DROP POLICY IF EXISTS "Anyone can submit custom trip requests" ON public.custom_trips;

CREATE POLICY "Anyone can submit custom trip requests"
ON public.custom_trips
FOR INSERT
TO public
WITH CHECK (true);

-- 5. Notify to reload schema cache
NOTIFY pgrst, 'reload schema';
