# Hướng Dẫn Cấu Hình Thông Tin Website

## 📋 Tổng quan

File này hướng dẫn cách cập nhật logo, favicon, metadata và thông tin website cho Roving Vietnam.

## 🎨 Cấu hình thông tin website

### 1. File cấu hình chính: `lib/site-config.ts`

Đây là file trung tâm chứa tất cả thông tin về website. Bạn chỉ cần sửa file này để thay đổi:

```typescript
export const siteConfig = {
  // Tên website
  name: "Roving Việt Nam",
  shortName: "RovingVN",
  
  // Mô tả (hiển thị trên Google, Facebook khi share)
  description: "Khám phá vẻ đẹp Việt Nam cùng Roving...",
  
  // URL website
  url: "https://rovingvn.com", // ⚡ Thay đổi domain của bạn
  
  // Thông tin liên hệ
  contact: {
    email: "info@rovingvn.com", // ⚡ Email của bạn
    phone: "+84 123 456 789",   // ⚡ Số điện thoại
    address: "Hà Nội, Việt Nam",
  },
  
  // Social Media
  social: {
    facebook: "https://facebook.com/rovingvn",  // ⚡ Thay đổi
    instagram: "https://instagram.com/rovingvn", // ⚡ Thay đổi
    // ...
  },
  
  // Theme color (màu chủ đạo hiển thị trên mobile)
  metadata: {
    themeColor: "#10b981", // ⚡ Màu xanh lá, có thể đổi
  },
}
```

## 🖼️ Logo & Favicon

### Bước 1: Chuẩn bị các file hình ảnh

Bạn cần chuẩn bị các file sau và đặt vào thư mục `public/`:

#### Logo (PNG hoặc SVG)
```
public/
  ├── images/
  │   ├── logo.png          # Logo chính (kích thước khuyến nghị: 300x100px)
  │   ├── logo-dark.png     # Logo cho dark mode (tùy chọn)
  │   ├── logo-small.png    # Logo nhỏ cho mobile (100x100px)
  │   ├── logo-text.png     # Logo văn bản (tùy chọn)
  │   └── og-image.jpg      # Hình ảnh khi share lên social (1200x630px)
```

#### Favicon (ICO và PNG)
```
public/
  ├── favicon.ico              # Favicon cũ (16x16, 32x32)
  ├── favicon-16x16.png        # Favicon 16x16
  ├── favicon-32x32.png        # Favicon 32x32
  ├── apple-touch-icon.png     # Apple Touch Icon (180x180)
  ├── android-chrome-192x192.png  # Android Icon (192x192)
  └── android-chrome-512x512.png  # Android Icon (512x512)
```

### Bước 2: Tạo favicon từ logo

**Cách 1: Sử dụng công cụ online**
- Truy cập: https://realfavicongenerator.net/
- Upload logo của bạn
- Download tất cả các file favicon
- Copy vào thư mục `public/`

**Cách 2: Sử dụng Photoshop/Figma**
- Resize logo thành các kích thước: 16x16, 32x32, 180x180, 192x192, 512x512
- Export dạng PNG
- Convert favicon.ico bằng https://convertio.co/png-ico/

### Bước 3: Cập nhật đường dẫn trong `site-config.ts`

```typescript
logo: {
  main: "/images/logo.png",        // ⚡ Đường dẫn logo của bạn
  dark: "/images/logo-dark.png",
  small: "/images/logo-small.png",
  text: "/images/logo-text.png",
},

favicon: {
  icon16: "/favicon-16x16.png",
  icon32: "/favicon-32x32.png",
  appleTouchIcon: "/apple-touch-icon.png",
  android192: "/android-chrome-192x192.png",
  android512: "/android-chrome-512x512.png",
  ico: "/favicon.ico",
},
```

## 📱 Sử dụng Logo Component

### Trong Header/Navigation:

```tsx
import { Logo } from "@/components/Logo";

export function Header() {
  return (
    <header>
      <Logo variant="main" height={48} priority />
      {/* Hoặc dùng text nếu chưa có logo */}
      <LogoText />
    </header>
  );
}
```

### Các variant của Logo:

```tsx
// Logo chính
<Logo variant="main" height={48} />

// Logo dark mode
<Logo variant="dark" height={48} />

// Logo nhỏ (mobile)
<Logo variant="small" height={32} />

// Logo không clickable
<Logo variant="main" clickable={false} />

// Logo với class tùy chỉnh
<Logo variant="main" className="my-custom-class" />
```

## 🔍 SEO & Metadata

### Sử dụng metadata động cho từng trang

```tsx
// app/tours/page.tsx
import { generateMetadata } from "@/lib/metadata";

export const metadata = generateMetadata({
  title: "Tours du lịch",
  description: "Khám phá các tour du lịch hấp dẫn",
  url: "https://rovingvn.com/tours",
  keywords: ["tour việt nam", "du lịch", "roving"],
});

export default function ToursPage() {
  return <div>Tours...</div>;
}
```

### Metadata cho Blog Posts

```tsx
export const metadata = generateMetadata({
  title: "Tiêu đề bài viết",
  description: "Mô tả ngắn gọn",
  type: "article",
  publishedTime: "2024-01-01T00:00:00Z",
  image: "/images/blog/article-image.jpg",
});
```

## 🌐 PWA - Progressive Web App

File `public/manifest.json` đã được tạo sẵn. Cập nhật thông tin:

```json
{
  "name": "Roving Việt Nam",
  "short_name": "RovingVN",
  "description": "Mô tả app",
  "theme_color": "#10b981",  // ⚡ Màu chủ đạo
}
```

## 🔧 Environment Variables

Thêm vào `.env.local`:

```bash
# Site URL (production)
NEXT_PUBLIC_SITE_URL=https://rovingvn.com

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID=

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=

# Google Site Verification (cho Search Console)
NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=
```

## 📊 Structured Data (JSON-LD)

Structured data đã được thêm tự động vào `layout.tsx`. Google sẽ hiểu website của bạn tốt hơn.

### Kiểm tra structured data:
1. Truy cập: https://search.google.com/test/rich-results
2. Nhập URL website của bạn
3. Xem kết quả

## ✅ Checklist

- [ ] Cập nhật `name`, `description` trong `site-config.ts`
- [ ] Thay đổi `url`, `contact`, `social` với thông tin của bạn
- [ ] Tải logo lên `public/images/`
- [ ] Tạo các favicon và đặt vào `public/`
- [ ] Cập nhật đường dẫn logo/favicon trong `site-config.ts`
- [ ] Thêm `NEXT_PUBLIC_SITE_URL` vào `.env.local`
- [ ] Kiểm tra logo hiển thị đúng trên website
- [ ] Test manifest.json: mở DevTools → Application → Manifest
- [ ] Test SEO: Google Rich Results Test
- [ ] Test Open Graph: Facebook Sharing Debugger

## 🎨 Thiết kế Logo

### Yêu cầu kỹ thuật:
- **Format**: PNG với nền trong suốt hoặc SVG
- **Màu sắc**: Sử dụng màu chủ đạo #10b981 hoặc màu brand của bạn
- **Kích thước**:
  - Logo chính: 300x100px (tỷ lệ 3:1)
  - Logo nhỏ: 100x100px (vuông)
  - Logo text: 400x100px

### Tools thiết kế logo miễn phí:
- Canva: https://www.canva.com/
- Looka: https://looka.com/
- Hatchful: https://www.shopify.com/tools/logo-maker

## 📞 Hỗ trợ

Nếu gặp vấn đề, kiểm tra:
1. Console trong DevTools (F12) xem có lỗi không
2. File paths có đúng không (case-sensitive!)
3. Images có tồn tại trong `public/` không

---

**Lưu ý**: Sau khi thay đổi logo/favicon, có thể cần clear cache trình duyệt (Ctrl+Shift+R) để thấy thay đổi.
