# Hướng Dẫn: Thêm CMS Settings vào Admin Panel

## ✨ Tính năng mới

Đã thêm trang **"Cấu hình Website"** vào Admin Panel để quản lý tất cả thông tin website từ giao diện CMS thay vì phải sửa code.

## 📋 Các bước cài đặt

### Bước 1: Chạy migration để tạo bảng `site_settings`

```bash
# Option 1: Sử dụng Supabase SQL Editor (Khuyến nghị)
# 1. Mở Supabase Dashboard: https://supabase.com/dashboard
# 2. Chọn project của bạn
# 3. Vào SQL Editor
# 4. Copy nội dung file: supabase/migrations/20241217_site_settings.sql
# 5. Paste và Run

# Option 2: Sử dụng Supabase CLI (nếu đã cài đặt)
supabase db push
```

### Bước 2: Kiểm tra bảng đã tạo thành công

```sql
-- Chạy câu lệnh này trong SQL Editor để kiểm tra
SELECT * FROM site_settings;
```

Nếu thành công, bạn sẽ thấy 1 row với dữ liệu mặc định.

### Bước 3: Truy cập trang Settings

1. Đăng nhập vào Admin Panel: `http://localhost:3000/admin`
2. Click vào menu **"Settings"** (biểu tượng⚙️)
3. Bạn sẽ thấy form đầy đủ để sửa thông tin

## 🎯 Tính năng

### 1. Thông tin cơ bản
- ✅ Tên website
- ✅ Tên ngắn gọn (short name)
- ✅ Mô tả SEO
- ✅ Tagline/Slogan
- ✅ URL website

### 2. Thông tin liên hệ
- ✅ Email
- ✅ Số điện thoại
- ✅ Địa chỉ

### 3. Mạng xã hội
- ✅ Facebook
- ✅ Instagram
- ✅ Twitter/X
- ✅ YouTube
- ✅ TikTok

### 4. Cài đặt SEO
- ✅ Keywords (từ khóa)
- ✅ Tác giả
- ✅ Ngôn ngữ (vi-VN, en-US)
- ✅ Theme color

### 5. Analytics & Tracking
- ✅ Google Analytics ID
- ✅ Facebook Pixel ID
- ✅ Google Tag Manager ID
- ✅ Google Site Verification

### 6. Thông tin doanh nghiệp
- ✅ Tên pháp lý công ty
- ✅ Mã số thuế
- ✅ Năm thành lập
- ✅ Loại hình doanh nghiệp

## 📁 Files đã tạo

| File | Mô tả |
|------|-------|
| `supabase/migrations/20241217_site_settings.sql` | Migration tạo bảng site_settings |
| `lib/actions/site-settings.ts` | Server actions CRUD cho settings |
| `lib/site-config-dynamic.ts` | Load config từ database |
| `lib/site-config-static.ts` | Config mặc định (fallback) |
| `app/(admin)/admin/settings/page.tsx` | Settings page (server component) |
| `app/(admin)/admin/settings/SiteSettingsClient.tsx` | Settings form (client component) |

## 🔄 Workflow

```
User điền form trong Admin Panel
          ↓
Click "Lưu tất cả"
          ↓
updateSiteSettings() action
          ↓
Lưu vào bảng site_settings
          ↓
revalidatePath("/") - refresh cache
          ↓
Website tự động cập nhật metadata
```

## 🎨 Logo & Favicon (Sắp tới)

Hiện tại chưa có UI upload logo/favicon. Bạn vẫn cần upload thủ công vào `public/images/`.

**TODO (Phase 2)**:
- [ ] Thêm Cloudinary upload cho logo
- [ ] Thêm Cloudinary upload cho favicon
- [ ] Preview logo/favicon trong settings
- [ ] Crop & resize tự động

## 🧪 Testing

### Test 1: Lưu thông tin cơ bản

```typescript
1. Vào /admin/settings
2. Sửa "Tên Website" thành "Test Website"
3. Click "Lưu tất cả"
4. Kiểm tra database:
   SELECT site_name FROM site_settings;
   // Kết quả: "Test Website"
```

### Test 2: Metadata tự động cập nhật

```typescript
1. Sửa "Mô tả" trong settings
2. Lưu
3. View source trang chủ (Ctrl+U)
4. Tìm <meta name="description">
   // Kết quả: Mô tả mới hiển thị
```

### Test 3: Social Media links

```typescript
1. Cập nhật link Facebook
2. Lưu
3. Check footer hoặc header (nếu có sử dụng siteConfig.social.facebook)
   // Link mới hiển thị
```

## ⚠️ Lưu ý quan trọng

### 1. **Chỉ có 1 row trong bảng `site_settings`**
   - Bảng này chỉ nên có 1 record duy nhất
   - Khi update, sẽ update row đó thay vì insert mới

### 2. **Permissions**
   - Chỉ admin mới sửa được settings
   - Public users có thể đọc (để hiển thị metadata)

### 3. **Cache**
   - Settings được cache để tăng performance
   - Sau khi update, system tự động revalidate cache

### 4. **Fallback**
   - Nếu database không có dữ liệu, system dùng giá trị default từ `site-config-static.ts`

## 🐛 Troubleshooting

### Lỗi: "site_settings table does not exist"
**Giải pháp**: Chạy lại migration (Bước 1)

### Lỗi: "Unauthorized"
**Giải pháp**: Đảm bảo user đã login và có role='admin'

### Settings không lưu được
**Giải pháp**: 
1. Check browser console (F12)
2. Check Supabase logs
3. Verify RLS policies đã enable

### Metadata không cập nhật
**Giải pháp**:
1. Hard refresh (Ctrl+Shift+R)
2. Check cache đã revalidate chưa
3. Restart dev server

## 🚀 Next Steps

Sau khi chạy migration thành công:

1. ✅ Truy cập `/admin/settings`
2. ✅ Điền đầy đủ thông tin website
3. ✅ Click "Lưu tất cả"
4. ✅ Kiểm tra metadata trên trang chủ
5. ✅ Test social sharing (Facebook Debugger)

## 📞 Support

Nếu gặp vấn đề:
1. Check console logs (browser & terminal)
2. Verify Supabase connection
3. Check RLS policies trong Supabase Dashboard

---

**🎉 Hoàn thành!** Giờ bạn có thể quản lý tất cả thông tin website từ Admin Panel.
