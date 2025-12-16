-- ============================================
-- Row Level Security (RLS) Policies
-- Vietnamese CMS
-- ============================================

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to get current user's role
CREATE OR REPLACE FUNCTION public.get_user_role(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT r.name
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_uuid
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name = 'admin'
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Function to check if user is editor or admin
CREATE OR REPLACE FUNCTION public.is_editor_or_admin(user_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_uuid AND r.name IN ('admin', 'editor')
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================

ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ROLES TABLE POLICIES
-- ============================================

-- Everyone can view roles
CREATE POLICY "roles_select_policy" ON roles
  FOR SELECT
  USING (true);

-- Only admins can insert/update/delete roles
CREATE POLICY "roles_insert_policy" ON roles
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "roles_update_policy" ON roles
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "roles_delete_policy" ON roles
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- USER_ROLES TABLE POLICIES
-- ============================================

-- Users can view their own roles, admins can view all
CREATE POLICY "user_roles_select_policy" ON user_roles
  FOR SELECT
  USING (auth.uid() = user_id OR is_admin(auth.uid()));

-- Only admins can assign roles
CREATE POLICY "user_roles_insert_policy" ON user_roles
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "user_roles_update_policy" ON user_roles
  FOR UPDATE
  USING (is_admin(auth.uid()));

CREATE POLICY "user_roles_delete_policy" ON user_roles
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- CATEGORIES TABLE POLICIES
-- ============================================

-- Everyone can view categories
CREATE POLICY "categories_select_policy" ON categories
  FOR SELECT
  USING (true);

-- Editors and admins can create/update/delete categories
CREATE POLICY "categories_insert_policy" ON categories
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "categories_update_policy" ON categories
  FOR UPDATE
  USING (is_editor_or_admin(auth.uid()));

CREATE POLICY "categories_delete_policy" ON categories
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- TAGS TABLE POLICIES
-- ============================================

-- Everyone can view tags
CREATE POLICY "tags_select_policy" ON tags
  FOR SELECT
  USING (true);

-- Editors and admins can create/update/delete tags
CREATE POLICY "tags_insert_policy" ON tags
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "tags_update_policy" ON tags
  FOR UPDATE
  USING (is_editor_or_admin(auth.uid()));

CREATE POLICY "tags_delete_policy" ON tags
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- MEDIA TABLE POLICIES
-- ============================================

-- Everyone can view media
CREATE POLICY "media_select_policy" ON media
  FOR SELECT
  USING (true);

-- Editors and admins can upload media
CREATE POLICY "media_insert_policy" ON media
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

-- Users can update their own media, admins can update all
CREATE POLICY "media_update_policy" ON media
  FOR UPDATE
  USING (uploaded_by = auth.uid() OR is_admin(auth.uid()));

-- Users can delete their own media, admins can delete all
CREATE POLICY "media_delete_policy" ON media
  FOR DELETE
  USING (uploaded_by = auth.uid() OR is_admin(auth.uid()));

-- ============================================
-- POSTS TABLE POLICIES
-- ============================================

-- Everyone can view published posts, editors can view all
CREATE POLICY "posts_select_policy" ON posts
  FOR SELECT
  USING (
    status = 'published' OR
    is_editor_or_admin(auth.uid())
  );

-- Editors and admins can create posts
CREATE POLICY "posts_insert_policy" ON posts
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

-- Authors can update their own posts, admins can update all
CREATE POLICY "posts_update_policy" ON posts
  FOR UPDATE
  USING (
    author_id = auth.uid() OR
    is_admin(auth.uid())
  );

-- Only admins can delete posts
CREATE POLICY "posts_delete_policy" ON posts
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- POST_CATEGORIES & POST_TAGS POLICIES
-- ============================================

-- Everyone can view
CREATE POLICY "post_categories_select_policy" ON post_categories
  FOR SELECT
  USING (true);

CREATE POLICY "post_tags_select_policy" ON post_tags
  FOR SELECT
  USING (true);

-- Editors and admins can manage
CREATE POLICY "post_categories_insert_policy" ON post_categories
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "post_categories_delete_policy" ON post_categories
  FOR DELETE
  USING (is_editor_or_admin(auth.uid()));

CREATE POLICY "post_tags_insert_policy" ON post_tags
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "post_tags_delete_policy" ON post_tags
  FOR DELETE
  USING (is_editor_or_admin(auth.uid()));

-- ============================================
-- PAGES TABLE POLICIES
-- ============================================

-- Everyone can view published pages, editors can view all
CREATE POLICY "pages_select_policy" ON pages
  FOR SELECT
  USING (
    status = 'published' OR
    is_editor_or_admin(auth.uid())
  );

-- Editors and admins can create/update pages
CREATE POLICY "pages_insert_policy" ON pages
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "pages_update_policy" ON pages
  FOR UPDATE
  USING (is_editor_or_admin(auth.uid()));

-- Only admins can delete pages
CREATE POLICY "pages_delete_policy" ON pages
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- SEO_METADATA TABLE POLICIES
-- ============================================

-- Everyone can view SEO metadata
CREATE POLICY "seo_metadata_select_policy" ON seo_metadata
  FOR SELECT
  USING (true);

-- Editors and admins can manage SEO metadata
CREATE POLICY "seo_metadata_insert_policy" ON seo_metadata
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "seo_metadata_update_policy" ON seo_metadata
  FOR UPDATE
  USING (is_editor_or_admin(auth.uid()));

CREATE POLICY "seo_metadata_delete_policy" ON seo_metadata
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- AUDIT_LOGS TABLE POLICIES
-- ============================================

-- Only admins can view audit logs
CREATE POLICY "audit_logs_select_policy" ON audit_logs
  FOR SELECT
  USING (is_admin(auth.uid()));

-- System can insert audit logs (via triggers)
CREATE POLICY "audit_logs_insert_policy" ON audit_logs
  FOR INSERT
  WITH CHECK (true);

-- No one can update or delete audit logs (immutable)
CREATE POLICY "audit_logs_no_update_policy" ON audit_logs
  FOR UPDATE
  USING (false);

CREATE POLICY "audit_logs_no_delete_policy" ON audit_logs
  FOR DELETE
  USING (false);

-- ============================================
-- GRANTS
-- ============================================

-- Grant usage on helper functions
GRANT EXECUTE ON FUNCTION public.get_user_role(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_editor_or_admin(UUID) TO authenticated;
