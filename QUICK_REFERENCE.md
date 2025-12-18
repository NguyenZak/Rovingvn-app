# Quick Reference: Site Configuration

## 📁 Files Created

| File | Purpose |
|------|---------|
| `lib/site-config.ts` | ⭐ File cấu hình chính - Sửa file này để thay đổi thông tin website |
| `lib/metadata.ts` | Generate metadata động cho SEO |
| `components/Logo.tsx` | Component hiển thị logo |
| `app/layout.tsx` | Root layout với metadata (đã cập nhật) |
| `public/manifest.json` | PWA manifest |
| `public/robots.txt` | SEO robots file |
| `SITE_CONFIG_GUIDE.md` | Hướng dẫn chi tiết |
| `components/examples/HeaderFooterExample.tsx` | Ví dụ sử dụng |

## 🎯 Quick Start (3 bước)

### 1️⃣ Cập nhật thông tin website
Mở `lib/site-config.ts` và thay đổi:

```typescript
export const siteConfig = {
  name: "Tên Website của bạn",           // ⚡ Thay đổi
  description: "Mô tả website",          // ⚡ Thay đổi
  url: "https://domain-cua-ban.com",     // ⚡ Thay đổi
  
  contact: {
    email: "email@example.com",          // ⚡ Thay đổi
    phone: "+84 xxx xxx xxx",            // ⚡ Thay đổi
    address: "Địa chỉ của bạn",          // ⚡ Thay đổi
  },
  
  social: {
    facebook: "https://facebook.com/...", // ⚡ Thay đổi
    instagram: "https://instagram.com/...",// ⚡ Thay đổi
  },
};
```

### 2️⃣ Thêm logo và favicon
```bash
# Đặt các file này vào thư mục public/
public/
  ├── images/
  │   ├── logo.png              # Logo chính
  │   ├── logo-dark.png         # Logo dark mode
  │   └── og-image.jpg          # Social share image
  ├── favicon.ico
  ├── favicon-16x16.png
  ├── favicon-32x32.png
  ├── apple-touch-icon.png
  ├── android-chrome-192x192.png
  └── android-chrome-512x512.png
```

**Tạo favicon online**: https://realfavicongenerator.net/

### 3️⃣ Sử dụng Logo trong code
```tsx
import { Logo } from "@/components/Logo";

// Trong Header/Navigation
<Logo variant="main" height={48} priority />

// Trong Footer  
<Logo variant="dark" height={48} />
```

## 🔍 SEO - Metadata cho từng trang

```tsx
// app/tours/page.tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Tours du lịch",
  description: "Khám phá các tour hấp dẫn",
  url: "https://domain.com/tours",
});
```

## 🌍 Environment Variables

Thêm vào `.env.local`:

```bash
# Site URL (production)
NEXT_PUBLIC_SITE_URL=https://domain-cua-ban.com

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

## ✅ Checklist

- [ ] Sửa `name`, `description`, `url` trong `site-config.ts`
- [ ] Cập nhật `contact` và `social` links
- [ ] Tạo và upload logo vào `public/images/`
- [ ] Tạo các favicon và đặt vào `public/`
- [ ] Thêm `NEXT_PUBLIC_SITE_URL` vào `.env.local`
- [ ] Test logo hiển thị: `npm run dev` → http://localhost:3000
- [ ] Sử dụng Logo component trong Header/Footer

## 🎨 Kích thước khuyến nghị

| File | Kích thước | Format |
|------|-----------|--------|
| logo.png | 300x100px | PNG transparent |
| logo-small.png | 100x100px | PNG transparent |
| og-image.jpg | 1200x630px | JPG |
| apple-touch-icon.png | 180x180px | PNG |
| android-chrome-512x512.png | 512x512px | PNG |

## 📚 Đọc thêm

- Chi tiết: `SITE_CONFIG_GUIDE.md`
- Ví dụ code: `components/examples/HeaderFooterExample.tsx`
- Tạo placeholder: `./create-placeholder-images.sh`

## 🆘 Troubleshooting

**Logo không hiển thị?**
- Kiểm tra file có tồn tại trong `public/images/`
- Kiểm tra đường dẫn trong `site-config.ts`
- Clear cache: Ctrl+Shift+R (Windows) hoặc Cmd+Shift+R (Mac)

**Favicon không đổi?**
- Clear browser cache
- Hard refresh (Ctrl+F5)
- Kiểm tra file `public/favicon.ico` đã thay đổi chưa

**Metadata không cập nhật trên Google?**
- Chờ vài ngày để Google crawl lại
- Sử dụng Google Search Console để request indexing
- Test: https://search.google.com/test/rich-results
