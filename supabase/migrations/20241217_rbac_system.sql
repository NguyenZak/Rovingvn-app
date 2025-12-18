-- ============================================
-- RBAC (Role-Based Access Control) Database Schema
-- ============================================

-- 1. Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  resource TEXT NOT NULL, -- 'users', 'tours', 'settings', etc.
  action TEXT NOT NULL, -- 'create', 'read', 'update', 'delete', 'manage'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create role_permissions junction table
CREATE TABLE IF NOT EXISTS role_permissions (
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  permission_id UUID REFERENCES permissions(id) ON DELETE CASCADE,
  PRIMARY KEY (role_id, permission_id)
);

-- 4. Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  assigned_by UUID REFERENCES auth.users(id),
  PRIMARY KEY (user_id, role_id)
);

-- ============================================
-- Seed Default Roles
-- ============================================

INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access - Can manage everything'),
  ('editor', 'Content management - Can create and edit tours, blog posts, bookings'),
  ('viewer', 'Read-only access - Can view data but cannot modify')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Seed Permissions
-- ============================================

-- Users & Access
INSERT INTO permissions (name, description, resource, action) VALUES
  ('manage_users', 'Create, edit, delete users', 'users', 'manage'),
  ('assign_roles', 'Assign roles to users', 'users', 'assign_roles'),
  ('view_users', 'View user list', 'users', 'read'),
  
  -- Tours
  ('manage_tours', 'Full tour management', 'tours', 'manage'),
  ('create_tours', 'Create new tours', 'tours', 'create'),
  ('edit_tours', 'Edit existing tours', 'tours', 'update'),
  ('delete_tours', 'Delete tours', 'tours', 'delete'),
  ('publish_tours', 'Publish/unpublish tours', 'tours', 'publish'),
  ('view_tours', 'View tours', 'tours', 'read'),
  
  -- Blog
  ('manage_blog', 'Full blog management', 'blog', 'manage'),
  ('create_posts', 'Create blog posts', 'blog', 'create'),
  ('edit_posts', 'Edit blog posts', 'blog', 'update'),
  ('delete_posts', 'Delete blog posts', 'blog', 'delete'),
  ('publish_posts', 'Publish blog posts', 'blog', 'publish'),
  ('view_posts', 'View blog posts', 'blog', 'read'),
  
  -- Media
  ('manage_media', 'Manage media library', 'media', 'manage'),
  ('upload_media', 'Upload files', 'media', 'create'),
  ('delete_media', 'Delete files', 'media', 'delete'),
  ('view_media', 'View media library', 'media', 'read'),
  
  -- Bookings
  ('manage_bookings', 'Full booking management', 'bookings', 'manage'),
  ('create_bookings', 'Create bookings', 'bookings', 'create'),
  ('edit_bookings', 'Edit bookings', 'bookings', 'update'),
  ('delete_bookings', 'Delete bookings', 'bookings', 'delete'),
  ('view_bookings', 'View bookings', 'bookings', 'read'),
  
  -- Settings
  ('manage_settings', 'Manage site settings', 'settings', 'manage'),
  ('view_settings', 'View settings', 'settings', 'read'),
  
  -- Roles
  ('manage_roles', 'Manage roles and permissions', 'roles', 'manage'),
  ('view_roles', 'View roles', 'roles', 'read'),
  
  -- Analytics
  ('view_analytics', 'View analytics dashboard', 'analytics', 'read'),
  ('export_analytics', 'Export analytics data', 'analytics', 'export'),
  
  -- Customers
  ('manage_customers', 'Manage customer data', 'customers', 'manage'),
  ('view_customers', 'View customers', 'customers', 'read')
ON CONFLICT (name) DO NOTHING;

-- ============================================
-- Assign Permissions to Roles
-- ============================================

-- Admin: All permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'admin'),
  id
FROM permissions
ON CONFLICT DO NOTHING;

-- Editor: Content management permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'editor'),
  id
FROM permissions
WHERE name IN (
  'view_users',
  'create_tours', 'edit_tours', 'publish_tours', 'view_tours',
  'create_posts', 'edit_posts', 'publish_posts', 'view_posts',
  'manage_media', 'upload_media', 'view_media',
  'manage_bookings', 'create_bookings', 'edit_bookings', 'view_bookings',
  'view_customers',
  'view_settings'
)
ON CONFLICT DO NOTHING;

-- Viewer: Read-only permissions
INSERT INTO role_permissions (role_id, permission_id)
SELECT 
  (SELECT id FROM roles WHERE name = 'viewer'),
  id
FROM permissions
WHERE name IN (
  'view_users',
  'view_tours',
  'view_posts',
  'view_media',
  'view_bookings',
  'view_customers',
  'view_settings',
  'view_analytics'
)
ON CONFLICT DO NOTHING;

-- ============================================
-- RLS Policies
-- ============================================

-- Roles table
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view roles"
  ON roles FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage roles"
  ON roles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Permissions table
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view permissions"
  ON permissions FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage permissions"
  ON permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Role_permissions table
ALTER TABLE role_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view role permissions"
  ON role_permissions FOR SELECT
  USING (true);

CREATE POLICY "Only admins can manage role permissions"
  ON role_permissions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- User_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON user_roles FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Admins can view all user roles"
  ON user_roles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Only admins can assign roles"
  ON user_roles FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

CREATE POLICY "Only admins can remove roles"
  ON user_roles FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- ============================================
-- Helper Functions
-- ============================================

-- Function to check if user has specific role
CREATE OR REPLACE FUNCTION user_has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = user_id
    AND r.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has specific permission
CREATE OR REPLACE FUNCTION user_has_permission(user_id UUID, permission_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN role_permissions rp ON ur.role_id = rp.role_id
    JOIN permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = user_id
    AND p.name = permission_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user roles
CREATE OR REPLACE FUNCTION get_user_roles(user_id UUID)
RETURNS TABLE (role_name TEXT, role_description TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT r.name, r.description
  FROM user_roles ur
  JOIN roles r ON ur.role_id = r.id
  WHERE ur.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user permissions
CREATE OR REPLACE FUNCTION get_user_permissions(user_id UUID)
RETURNS TABLE (permission_name TEXT, resource TEXT, action TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT DISTINCT p.name, p.resource, p.action
  FROM user_roles ur
  JOIN role_permissions rp ON ur.role_id = rp.role_id
  JOIN permissions p ON rp.permission_id = p.id
  WHERE ur.user_id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Migrate Existing Users
-- ============================================

-- Assign admin role to users who have role='admin' in metadata
INSERT INTO user_roles (user_id, role_id, assigned_by)
SELECT 
  u.id,
  (SELECT id FROM roles WHERE name = 'admin'),
  u.id -- self-assigned for migration
FROM auth.users u
WHERE u.raw_user_meta_data->>'role' = 'admin'
ON CONFLICT DO NOTHING;

-- ============================================
-- Indexes for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX IF NOT EXISTS idx_role_permissions_permission_id ON role_permissions(permission_id);
CREATE INDEX IF NOT EXISTS idx_permissions_resource ON permissions(resource);
CREATE INDEX IF NOT EXISTS idx_permissions_action ON permissions(action);

-- ============================================
-- Comments
-- ============================================

COMMENT ON TABLE roles IS 'User roles (admin, editor, viewer)';
COMMENT ON TABLE permissions IS 'Granular permissions for actions';
COMMENT ON TABLE role_permissions IS 'Maps roles to their permissions';
COMMENT ON TABLE user_roles IS 'Maps users to their assigned roles';

COMMENT ON FUNCTION user_has_role IS 'Check if user has a specific role';
COMMENT ON FUNCTION user_has_permission IS 'Check if user has a specific permission';
COMMENT ON FUNCTION get_user_roles IS 'Get all roles for a user';
COMMENT ON FUNCTION get_user_permissions IS 'Get all permissions for a user';
