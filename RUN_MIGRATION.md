# 🚀 Chạy Migration Site Settings

## ⚠️ Lỗi: "Could not find the table 'public.site_settings'"

Lỗi này xảy ra vì bạn chưa chạy migration để tạo bảng `site_settings` trong Supabase.

---

## 📋 Các Bước Chạy Migration

### **Bước 1: Mở Supabase Dashboard**

1. Truy cập: https://supabase.com/dashboard
2. Đăng nhập
3. Chọn project của bạn

### **Bước 2: Vào SQL Editor**

1. Từ sidebar bên trái, click **"SQL Editor"**
2. Click **"New Query"**

### **Bước 3: Copy Migration SQL**

File migration nằm ở:
```
supabase/migrations/20241217_site_settings.sql
```

**Hoặc copy trực tiếp SQL dưới đây:**

```sql
-- Site Settings Table
CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  site_name VARCHAR(255) NOT NULL DEFAULT 'Roving Việt Nam',
  site_short_name VARCHAR(50) DEFAULT 'RovingVN',
  site_description TEXT,
  site_tagline VARCHAR(255),
  site_url VARCHAR(500),
  
  -- Logo & Branding
  logo_main TEXT,
  logo_dark TEXT,
  logo_small TEXT,
  logo_text TEXT,
  
  -- Favicon
  favicon_ico TEXT,
  favicon_16 TEXT,
  favicon_32 TEXT,
  favicon_180 TEXT,
  favicon_192 TEXT,
  favicon_512 TEXT,
  
  -- Open Graph
  og_image TEXT,
  og_image_width INTEGER DEFAULT 1200,
  og_image_height INTEGER DEFAULT 630,
  
  -- Contact Information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  
  -- Social Media Links
  social_facebook VARCHAR(500),
  social_instagram VARCHAR(500),
  social_twitter VARCHAR(500),
  social_youtube VARCHAR(500),
  social_tiktok VARCHAR(500),
  
  -- SEO
  meta_keywords TEXT[],
  meta_author VARCHAR(255),
  meta_language VARCHAR(10) DEFAULT 'vi-VN',
  
  -- Theme
  theme_color VARCHAR(7) DEFAULT '#10b981',
  background_color VARCHAR(7) DEFAULT '#ffffff',
  
  -- Business Info
  business_type VARCHAR(100) DEFAULT 'TravelAgency',
  business_legal_name VARCHAR(255),
  business_founding_date VARCHAR(4),
  business_vat_id VARCHAR(50),
  
  -- Analytics
  google_analytics_id VARCHAR(50),
  facebook_pixel_id VARCHAR(50),
  google_tag_manager_id VARCHAR(50),
  google_site_verification VARCHAR(100),
  
  -- Features
  features JSONB DEFAULT '{"blog": true, "tours": true, "customTrips": true, "newsletter": true, "reviews": true}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can insert
CREATE POLICY "Only admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default settings
INSERT INTO site_settings (
  site_name,
  site_short_name,
  site_description,
  site_tagline,
  site_url,
  contact_email,
  contact_phone,
  contact_address,
  social_facebook,
  social_instagram,
  meta_keywords,
  meta_author,
  business_legal_name
)
SELECT
  'Roving Việt Nam',
  'RovingVN',
  'Khám phá vẻ đẹp Việt Nam cùng Roving - Trải nghiệm du lịch độc đáo và chuyên nghiệp',
  'Experience the beauty of Vietnam',
  'https://rovingvn.com',
  'info@rovingvn.com',
  '+84 123 456 789',
  'Hà Nội, Việt Nam',
  'https://facebook.com/rovingvn',
  'https://instagram.com/rovingvn',
  ARRAY['du lịch việt nam', 'tour việt nam', 'roving vietnam', 'travel vietnam', 'vietnam tours', 'khám phá việt nam'],
  'Roving Vietnam',
  'Công ty TNHH Du lịch Roving Việt Nam'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Create index
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);

-- Comment
COMMENT ON TABLE site_settings IS 'Stores all website configuration and settings';
```

### **Bước 4: Paste và Run**

1. Paste SQL vào editor
2. Click **"Run"** (hoặc Ctrl/Cmd + Enter)
3. Đợi vài giây

### **Bước 5: Kiểm Tra Kết Quả**

Chạy query này để kiểm tra:

```sql
SELECT * FROM site_settings;
```

**Kết quả mong đợi**: Bạn sẽ thấy 1 row với dữ liệu mặc định

---

## ✅ Sau Khi Chạy Migration Thành Công

1. **Restart dev server** (quan trọng!):
   ```bash
   # Dừng server (Ctrl+C)
   # Chạy lại:
   npm run dev
   ```

2. **Truy cập Settings page**:
   ```
   http://localhost:3000/admin/settings
   ```

3. **Kiểm tra**:
   - Form hiển thị đầy đủ
   - Có dữ liệu mặc định
   - Click "Lưu tất cả" để test

---

## 🐛 Nếu Vẫn Lỗi

### Lỗi: "relation does not exist"
**Giải pháp**: Schema chưa đồng bộ, chạy lại migration

### Lỗi: "permission denied"
**Giải pháp**: 
- Check user có role `admin` không
- Verify RLS policies đã enable

### Lỗi: "duplicate key value"
**Giải pháp**: Bảng đã có data, skip phần INSERT:
```sql
-- Chỉ chạy phần CREATE TABLE và POLICIES
-- Bỏ qua phần INSERT
```

---

## 📞 Quick Commands

```sql
-- Xem table đã tạo chưa
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'site_settings';

-- Xem cấu trúc bảng
\d site_settings

-- Xem data
SELECT * FROM site_settings;

-- Xóa bảng (nếu cần reset)
DROP TABLE IF EXISTS site_settings CASCADE;
```

---

## 🎯 Video Hướng Dẫn (Text)

1. 🌐 Mở Supabase Dashboard
2. 📝 Click "SQL Editor" → "New Query"
3. 📋 Copy toàn bộ SQL từ file migration
4. 📌 Paste vào editor
5. ▶️ Click "Run"
6. ✅ Kiểm tra kết quả
7. 🔄 Restart `npm run dev`
8. 🎉 Vào `/admin/settings` để test!

---

**Sau khi hoàn thành, bạn sẽ thấy trang Settings đẹp với form đầy đủ!** 🚀
