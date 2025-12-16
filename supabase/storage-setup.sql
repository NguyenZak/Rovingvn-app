-- ============================================
-- Supabase Storage Setup for Media Library
-- ============================================

-- Create storage bucket for media
INSERT INTO storage.buckets (id, name, public)
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STORAGE POLICIES
-- ============================================

-- Allow public read access to media
CREATE POLICY "media_bucket_public_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'media');

-- Allow authenticated editors and admins to upload
CREATE POLICY "media_bucket_authenticated_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated' AND
    (
      EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
        AND r.name IN ('admin', 'editor')
      )
    )
  );

-- Allow users to delete their own uploads, admins can delete all
CREATE POLICY "media_bucket_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'media' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'admin'
      )
    )
  );

-- Allow users to update their own uploads, admins can update all
CREATE POLICY "media_bucket_update_own" ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'media' AND
    (
      (storage.foldername(name))[1] = auth.uid()::text OR
      EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
        AND r.name = 'admin'
      )
    )
  );
