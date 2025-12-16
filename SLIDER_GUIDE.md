# Quản lý Sliders - Hướng dẫn Triển khai

## ✅ Tính năng đã được triển khai

### 1. Database Schema
**File**: `supabase/sliders-schema.sql`

Bảng `sliders` với các trường:
- `title` - Tiêu đề (bắt buộc)
- `subtitle` - Phụ đề
- `description` - Mô tả
- `image_id` - Liên kết đến bảng media
- `link` - URL liên kết
- `button_text` - Văn bản nút CTA
- `display_order` - Thứ tự hiển thị (số càng nhỏ càng ưu tiên)
- `status` - Trạng thái (active/inactive)
- `start_date` - Ngày bắt đầu hiển thị (tùy chọn)
- `end_date` - Ngày kết thúc hiển thị (tùy chọn)

**Bảo mật:**
- Row Level Security (RLS) enabled
- Public có thể xem sliders active
- Editor/Admin có thể thêm/sửa
- Chỉ Admin có thể xoá
- Auto audit logging

### 2. TypeScript Types
**File**: `lib/types/cms.ts`

Đã thêm:
- `SliderStatus` enum (ACTIVE, INACTIVE)
- `Slider` type
- `SliderInsert` & `SliderUpdate` types
- `SliderFormData` interface
- `SliderFilters` interface

### 3. Server Actions
**File**: `app/(admin)/admin/sliders/actions.ts`

Functions:
- `getAllSliders()` - Lấy tất cả sliders
- `getSliderById(id)` - Lấy slider theo ID
- `createSlider(formData)` - Tạo slider mới
- `updateSlider(sliderId, formData)` - Sửa slider
- `deleteSlider(sliderId)` - Xoá slider
- `updateSliderStatus(sliderId, status)` - Đổi trạng thái
- `reorderSliders(sliderIds[])` - Sắp xếp lại thứ tự

### 4. Admin Pages

#### Listing Page
**File**: `app/(admin)/admin/sliders/page.tsx`
- Grid view với thumbnail
- Stats cards (tổng/hoạt động/ẩn)
- Badges hiển thị order và status
- Quick actions (sửa/xoá)

#### Create Page
**File**: `app/(admin)/admin/sliders/create/page.tsx`
- Form tạo slider mới

#### Edit Page
**File**: `app/(admin)/admin/sliders/[id]/edit/page.tsx`
- Load dữ liệu slider hiện tại
- Form chỉnh sửa

### 5. Form Component
**File**: `components/features/cms/SliderForm.tsx`

Tính năng:
- Tất cả các trường input
- Validation
- Loading states
- Error handling
- Vietnamese labels
- Responsive layout

## 🚀 Cách Sử dụng

### Bước 1: Chạy Database Migration

```bash
# Chạy SQL script trong Supabase Dashboard
# hoặc dùng psql:
psql -h YOUR_HOST -U postgres -d postgres -f supabase/sliders-schema.sql
```

### Bước 2: Truy cập Admin Panel

```
http://localhost:3000/admin/sliders
```

### Bước 3: Tạo Slider

1. Click "Tạo slider mới"
2. Điền thông tin:
   - Tiêu đề (bắt buộc)
   - Phụ đề, mô tả
   - Link & button text
   - Display order (0 = hiện đầu tiên)
   - Status (active/inactive)
   - Start/end date (tùy chọn)
3. Click "Lưu"

### Bước 4: Hiển thị Sliders trên Frontend

```typescript
// Example: Homepage slider component
import { createClient } from '@/lib/supabase/server'

export default async function HomeSlider() {
  const supabase = await createClient()
  
  const { data: sliders } = await supabase
    .from('sliders')
    .select('*, image:image_id(url, filename)')
    .eq('status', 'active')
    .order('display_order', { ascending: true })
  
  return (
    <div className="slider">
      {sliders?.map(slider => (
        <div key={slider.id} className="slide">
          <img src={slider.image?.url} alt={slider.title} />
          <h2>{slider.title}</h2>
          <p>{slider.subtitle}</p>
          {slider.link && slider.button_text && (
            <a href={slider.link}>{slider.button_text}</a>
          )}
        </div>
      ))}
    </div>
  )
}
```

## 📋 Routes

- `/admin/sliders` - Danh sách sliders
- `/admin/sliders/create` - Tạo slider mới
- `/admin/sliders/[id]/edit` - Sửa slider

## 🔒 Permissions

- **Viewer**: Không thể truy cập
- **Editor**: Xem, tạo, sửa
- **Admin**: Full access (bao gồm xoá)

## ⚙️ Tính năng Nâng cao

### Scheduled Sliders
Sử dụng `start_date` và `end_date` để lên lịch hiển thị:

```typescript
const now = new Date().toISOString()

const { data: activeSliders } = await supabase
  .from('sliders')
  .select('*')
  .eq('status', 'active')
  .or(`start_date.is.null,start_date.lte.${now}`)
  .or(`end_date.is.null,end_date.gte.${now}`)
  .order('display_order')
```

### Reordering
Kéo thả sliders để sắp xếp lại (có thể dùng `dnd-kit` hoặc `react-beautiful-dnd`):

```typescript
const handleReorder = async (reorderedIds: string[]) => {
  await reorderSliders(reorderedIds)
}
```

## 🐛 Troubleshooting

### Lỗi "sliders table does not exist"
→ Chạy lại `sliders-schema.sql`

### Không thấy sliders trên frontend
→ Check `status = 'active'` và `display_order`

### Ảnh không hiển thị
→ Verify `image_id` tồn tại trong bảng `media`

## 📸 Screenshots

Slider listing page sẽ hiển thị:
- Grid 3 cột (desktop)
- Thumbnail ảnh
- Order badge (#1, #2, #3...)
- Status badge (Hoạt động/Ẩn)
- Quick actions

## ✨ Next Steps (Optional)

### Tích hợp Media Library
Thay thế input UUID bằng media picker component

### Drag & Drop Reordering
Sử dụng `@dnd-kit/sortable` để kéo thả sắp xếp

### Animation Options
Thêm fields: `animation_type`, `duration`, `autoplay`

### A/B Testing
Thêm fields: `variant`, `click_count`, `impression_count`

---

## 📝 Tóm tắt Files đã tạo

```
supabase/
└── sliders-schema.sql ✅

lib/
├── types/cms.ts (updated) ✅
└── constants/vi.ts (ready for update)

app/(admin)/admin/sliders/
├── actions.ts ✅
├── page.tsx ✅
├── create/page.tsx ✅
└── [id]/edit/page.tsx ✅

components/features/cms/
└── SliderForm.tsx ✅
```

**Tổng cộng**: 1 SQL file + 6 TypeScript files

Slider management hoàn chỉnh & production-ready! 🎉
