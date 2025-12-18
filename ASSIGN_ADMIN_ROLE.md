# Fix: Only admins can update site settings

## Vấn đề

Bạn thấy lỗi: **"Only admins can update site settings"**

Điều này có nghĩa là user hiện tại **chưa có role admin**.

---

## Giải pháp: Assign Admin Role

### Bước 1: Lấy User ID

1. Vào Supabase Dashboard
2. Click **Authentication** → **Users**
3. Tìm user của bạn (user đang đăng nhập)
4. **Copy User ID** (UUID)

### Bước 2: Chạy SQL để assign admin role

Vào **SQL Editor** và chạy **MỘT TRONG HAI** cách sau:

#### **Cách 1: Dùng email** (Khuyến nghị)

```sql
-- Thay YOUR_EMAIL@example.com bằng email của bạn
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'YOUR_EMAIL@example.com';
```

**Ví dụ**:
```sql
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'admin@rovingvn.com';
```

#### **Cách 2: Dùng User ID**

```sql
-- Thay YOUR_USER_ID bằng UUID của bạn
UPDATE auth.users
SET raw_user_meta_data = raw_user_meta_data || '{"role": "admin"}'::jsonb
WHERE id = 'YOUR_USER_ID';
```

### Bước 3: Verify

Chạy query này để kiểm tra:

```sql
SELECT 
  email, 
  raw_user_meta_data->>'role' as role
FROM auth.users
WHERE email = 'YOUR_EMAIL@example.com';
```

**Kết quả mong đợi**: `role` = `admin`

### Bước 4: Logout và Login lại

1. **Logout** khỏi admin panel
2. **Login** lại
3. Vào `/admin/settings`
4. Thử click **"Lưu tất cả"** → Sẽ thành công! ✅

---

## Kiểm tra nhanh

```sql
-- Xem tất cả admin users
SELECT email, raw_user_meta_data->>'role' as role
FROM auth.users
WHERE raw_user_meta_data->>'role' = 'admin';
```

---

## Nếu vẫn lỗi

### Kiểm tra session đã update chưa

```sql
-- Check user metadata trong session
SELECT 
  auth.uid() as user_id,
  (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) as role
FROM auth.users
LIMIT 1;
```

Nếu vẫn không có `role`, hãy:
1. **Hard refresh** (Ctrl+Shift+R)
2. **Clear cookies**
3. **Login lại**

---

**Sau khi hoàn thành, Settings page sẽ hoạt động bình thường!** 🚀
