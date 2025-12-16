# ============================================
# Cloudinary Setup Guide
# ============================================

## Bước 1: Tạo tài khoản Cloudinary (Miễn phí)

1. Truy cập: https://cloudinary.com/users/register_free
2. Đăng ký tài khoản miễn phí
3. Sau khi đăng ký, vào Dashboard

## Bước 2: Lấy API Credentials

Trong Cloudinary Dashboard, bạn sẽ thấy:
- **Cloud Name**: tên cloud của bạn (vd: `dxyz123abc`)
- **API Key**: khóa API
- **API Secret**: secret key

## Bước 3: Thêm vào .env.local

Thêm 3 dòng này vào file `.env.local`:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

## Bước 4: Restart Dev Server

```bash
# Dừng server (Ctrl+C)
# Chạy lại
npm run dev
```

## Ưu điểm Cloudinary

✅ **Miễn phí**: 25 GB storage + 25 GB bandwidth/tháng
✅ **CDN toàn cầu**: Ảnh load nhanh
✅ **Tự động tối ưu**: WebP, compression
✅ **Resize on-the-fly**: Không cần multiple versions
✅ **AI transformations**: Crop thông minh

## Lưu ý

- Database vẫn lưu metadata trong Supabase `media` table
- Ảnh thực tế được lưu trên Cloudinary CDN
- `storage_path` lưu Cloudinary `public_id` để xoá sau này

## Test Upload

1. Vào http://localhost:3000/admin/media
2. Kéo thả ảnh hoặc click chọn file
3. Ảnh sẽ được upload lên Cloudinary
4. URL ảnh bắt đầu bằng `https://res.cloudinary.com/...`

## Troubleshooting

### Lỗi "Cloudinary Error"
→ Kiểm tra API credentials trong .env.local

### Lỗi "Configuration not found"
→ Restart dev server sau khi thêm env vars

### Ảnh không hiển thị
→ Kiểm tra Cloud Name có đúng không
