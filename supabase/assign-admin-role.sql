-- ============================================
-- Assign Admin Role to User
-- Chạy script này trong Supabase Dashboard SQL Editor
-- ============================================

-- Bước 1: Xem tất cả users
SELECT id, email, created_at FROM auth.users;

-- Bước 2: Copy user ID từ bảng trên và thay vào YOUR_USER_ID bên dưới
-- Sau đó chạy lệnh INSERT này:

-- INSERT INTO user_roles (user_id, role_id)
-- VALUES (
--   'YOUR_USER_ID',
--   (SELECT id FROM roles WHERE name = 'admin')
-- );

-- ============================================
-- Ví dụ với user cụ thể (thay ID thật):
-- ============================================
-- INSERT INTO user_roles (user_id, role_id)
-- VALUES (
--   '12345678-1234-1234-1234-123456789012',
--   (SELECT id FROM roles WHERE name = 'admin')
-- );

-- ============================================
-- Verify role đã được assign:
-- ============================================
-- SELECT 
--   u.email,
--   r.name as role
-- FROM auth.users u
-- JOIN user_roles ur ON u.id = ur.user_id
-- JOIN roles r ON ur.role_id = r.id;
