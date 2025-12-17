# 🚀 Hướng Dẫn Deploy Lên Vercel

## Bước 1: Push Code Lên Git Repository (Nếu chưa)

Nếu bạn chưa push code lên GitHub/GitLab/Bitbucket:

```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

## Bước 2: Import Project Vào Vercel

1. Truy cập: https://vercel.com/new
2. Đăng nhập với GitHub/GitLab/Bitbucket
3. Chọn repository: **Web Du Lịch/Rovingvn-app**
4. Click **Import**

## Bước 3: Cấu Hình Environment Variables

Trong trang cấu hình Vercel, scroll xuống phần **Environment Variables** và thêm các biến sau:

### Supabase Variables

```
NEXT_PUBLIC_SUPABASE_URL
```
**Value:**
```
https://gkrjyvknosfecknvyhny.supabase.co
```

---

```
NEXT_PUBLIC_SUPABASE_ANON_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrcmp5dmtub3NmZWNrbnZ5aG55Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU3OTc5MzYsImV4cCI6MjA4MTM3MzkzNn0.vRCgv08FCg3eRVfYmsmvJHxwyAYLplvUAO3I0DWDeGQ
```

---

```
SUPABASE_SERVICE_ROLE_KEY
```
**Value:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdrcmp5dmtub3NmZWNrbnZ5aG55Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NTc5NzkzNiwiZXhwIjoyMDgxMzczOTM2fQ.OopMhNMsBrZkTkdstOl7Oa_mn-yhUCNazYVQ74GZsCY
```

### Cloudinary Variables

```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
```
**Value:**
```
eurosecuriy
```

---

```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
```
**Value:**
```
roving
```

---

```
CLOUDINARY_CLOUD_NAME
```
**Value:**
```
eurosecuriy
```

---

```
CLOUDINARY_API_KEY
```
**Value:**
```
913444274961142
```

---

```
CLOUDINARY_API_SECRET
```
**Value:**
```
x9n53GUxTEavCILRKKG9cnBRhH0
```

### App URL

```
NEXT_PUBLIC_APP_URL
```
**Value:** (Sẽ cập nhật sau khi deploy xong, tạm thời để)
```
https://your-app.vercel.app
```

## Bước 4: Deploy

1. Sau khi thêm tất cả environment variables
2. Click **Deploy**
3. Đợi Vercel build (khoảng 2-3 phút)

## Bước 5: Cập Nhật App URL

1. Sau khi deploy xong, copy URL của app (vd: `https://rovingvn-app.vercel.app`)
2. Vào **Settings** → **Environment Variables**
3. Tìm `NEXT_PUBLIC_APP_URL`
4. Cập nhật giá trị với URL thực tế
5. Click **Save**
6. Redeploy (vào tab **Deployments** → Click **...** → **Redeploy**)

## Bước 6: Cập Nhật Supabase URLs (Quan trọng!)

Vào Supabase Dashboard:
1. https://supabase.com/dashboard/project/gkrjyvknosfecknvyhny/settings/auth
2. Thêm Vercel URL vào **Site URL** và **Redirect URLs**:
   - Site URL: `https://your-app.vercel.app`
   - Redirect URLs: 
     - `https://your-app.vercel.app/**`
     - `http://localhost:3000/**`

## ✅ Hoàn Tất!

Website của bạn đã live trên Vercel! 🎉

### Kiểm tra:
- ✅ Trang chủ hoạt động
- ✅ Login/Authentication hoạt động
- ✅ Admin panel có thể truy cập
- ✅ Upload ảnh hoạt động

### Lưu ý:
- File `.env.local` không được commit vào Git (đã có trong .gitignore)
- Environment variables được quản lý trên Vercel Dashboard
- Mỗi lần thay đổi env vars, cần redeploy
