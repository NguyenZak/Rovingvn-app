-- Add email column to user_roles for easier querying
-- This allows us to show user info without needing admin API

-- First, add a view to get user emails with their roles
CREATE OR REPLACE VIEW user_roles_with_emails AS
SELECT 
  ur.user_id,
  ur.role_id,
  ur.assigned_at,
  au.email,
  au.created_at as user_created_at,
  r.id as role_id_full,
  r.name as role_name,
  r.description as role_description
FROM user_roles ur
JOIN auth.users au ON ur.user_id = au.id
JOIN roles r ON ur.role_id = r.id;

-- Grant SELECT to authenticated users
GRANT SELECT ON user_roles_with_emails TO authenticated;

-- RLS policy for the view
ALTER VIEW user_roles_with_emails SET (security_invoker = on);

COMMENT ON VIEW user_roles_with_emails IS 'User roles with email addresses - avoids need for admin API';
