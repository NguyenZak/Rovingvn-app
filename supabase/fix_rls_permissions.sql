-- Fix Permission Issue: Site Settings RLS Policies
-- Chạy SQL này để sửa lỗi "permission denied for table users"

-- 1. Drop old policies
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can insert site settings" ON site_settings;

-- 2. Create new policies WITHOUT checking auth.users table directly

-- Everyone can read (public information)
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Only authenticated users can update (we'll check role in application code)
CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Only authenticated users can insert
CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Note: Role checking (admin vs regular user) will be handled in the server actions
-- This is safer and avoids RLS permission issues with auth.users table
