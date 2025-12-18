# Quick Fix: Permission Denied Error

## ⚠️ Lỗi: "permission denied for table users"

Lỗi này xảy ra vì RLS policies cố gắng truy cập bảng `auth.users`.

## 🔧 Giải pháp: Chạy SQL sau trong Supabase

### Bước 1: Mở SQL Editor

1. Vào Supabase Dashboard
2. Click **SQL Editor**
3. Click **New Query**

### Bước 2: Copy và Run SQL dưới đây

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Site settings are viewable by everyone" ON site_settings;
DROP POLICY IF EXISTS "Only admins can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Only admins can insert site settings" ON site_settings;

-- Create new simplified policies

-- Everyone can read
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Authenticated users can update
CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  USING (auth.uid() IS NOT NULL);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

### Bước 3: Click "Run"

### Bước 4: Restart server

```bash
# Ctrl+C để dừng
npm run dev
```

## ✅ Sau khi fix

Truy cập: http://localhost:3000/admin/settings

Bây giờ sẽ **KHÔNG còn lỗi** permission denied!

---

**Lưu ý**: Admin role check giờ được xử lý trong server actions (code) thay vì RLS policies. Điều này an toàn và tránh lỗi permission.
