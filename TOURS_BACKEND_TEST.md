# Test Tours Backend - Step by Step

## 🧪 Bước 1: Chạy Migration

### Option 1: Supabase Dashboard (Khuyến nghị)

1. Mở **Supabase SQL Editor**
2. Chạy file: `supabase/migrations/20241217_tours_table.sql`
3. Click **"Run"**

### Option 2: Copy SQL

```sql
-- Copy toàn bộ nội dung file migrations/20241217_tours_table.sql
-- Paste vào SQL Editor và Run
```

### ✅ Verify Migration

Sau khi chạy, check:

```sql
-- 1. Check table created
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'tours';
-- Kết quả: 1 row

-- 2. Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tours';
-- Kết quả: ~25 columns

-- 3. Check sample data
SELECT id, title, status, price_adult 
FROM tours;
-- Kết quả: 2 tours (Ha Long Bay, Sapa)

-- 4. Check RLS policies
SELECT policyname 
FROM pg_policies 
WHERE tablename = 'tours';
-- Kết quả: 5 policies
```

---

## 🧪 Bước 2: Test Server Actions

### Test trong Browser Console

1. Mở **http://localhost:3000/admin/tours**
2. F12 → Console
3. Test các actions:

#### Test 1: Get All Tours

```javascript
// Copy vào console
fetch('/api/test-tours').then(r => r.json()).then(console.log)
```

Hoặc test trực tiếp trong code:

#### Test 2: Create Test Page

Tạo file: `app/api/test-tours/route.ts`

```typescript
import { getAllTours, createTour } from '@/lib/actions/tour-actions';
import { NextResponse } from 'next/server';

export async function GET() {
  const result = await getAllTours({ limit: 10 });
  return NextResponse.json(result);
}
```

Sau đó vào: **http://localhost:3000/api/test-tours**

Kết quả mong đợi:
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "title": "Ha Long Bay Cruise - 2 Days 1 Night",
      "status": "published",
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "totalPages": 1
  }
}
```

---

## 🧪 Bước 3: Test Permissions

### Test Permission Check

```sql
-- Check your user has permissions
SELECT 
  u.email,
  r.name as role,
  (SELECT user_has_role(u.id, 'admin')) as can_manage_tours
FROM auth.users u
LEFT JOIN user_roles ur ON u.id = ur.user_id
LEFT JOIN roles r ON ur.role_id = r.id
WHERE u.email = 'YOUR_EMAIL@example.com';
```

**Kết quả mong đợi:**
- `role = admin` → `can_manage_tours = true`
- `role = editor` → `can_manage_tours = true`
- `role = viewer` → `can_manage_tours = false`

---

## 🧪 Bước 4: Manual Test CRUD

### Test Create

```typescript
// Trong console hoặc test page
const newTour = {
  title: "Test Tour",
  slug: "test-tour-" + Date.now(),
  short_description: "This is a test",
  duration_days: 3,
  price_adult: 5000000,
  status: "draft"
};

// Call action
const result = await createTour(newTour);
console.log(result);
// Expected: { success: true, data: {...} }
```

### Test Read

```typescript
const result = await getAllTours({ page: 1, limit: 20 });
console.log(result.data.length); // Should be 3 (2 sample + 1 test)
```

### Test Update

```typescript
const tourId = "YOUR_TOUR_ID";
const result = await updateTour(tourId, {
  title: "Updated Title"
});
console.log(result);
```

### Test Delete

```typescript
const tourId = "YOUR_TEST_TOUR_ID";
const result = await deleteTour(tourId);
console.log(result); // { success: true }
```

---

## 🧪 Bước 5: Test Filters & Search

```typescript
// Test search
const result1 = await getAllTours({ search: 'Ha Long' });
console.log(result1.data.length); // 1

// Test status filter
const result2 = await getAllTours({ status: 'published' });
console.log(result2.data.length); // 2

// Test pagination
const result3 = await getAllTours({ page: 2, limit: 1 });
console.log(result3.pagination);
```

---

## ✅ Checklist

Sau khi test xong, check:

- [ ] Migration chạy thành công
- [ ] Bảng `tours` có 2 sample tours
- [ ] RLS policies hoạt động
- [ ] `getAllTours()` trả về data
- [ ] `getTourById()` hoạt động
- [ ] `createTour()` tạo được tour (nếu có permission)
- [ ] `updateTour()` update được
- [ ] `deleteTour()` xóa được (admin only)
- [ ] Search filter hoạt động
- [ ] Pagination đúng

---

## 🐛 Troubleshooting

### Lỗi: "permission denied for table tours"
**Fix**: Chạy lại migration, check RLS policies

### Lỗi: "Unauthorized: create_tours permission required"
**Fix**: 
```sql
-- Assign editor/admin role
INSERT INTO user_roles (user_id, role_id)
VALUES (
  'YOUR_USER_ID',
  (SELECT id FROM roles WHERE name = 'admin')
);
```

### Lỗi: "tours table does not exist"
**Fix**: Chạy migration lại

---

## 📊 Expected Results Summary

After all tests:
- ✅ Database has `tours` table
- ✅ 2+ tours in database
- ✅ All CRUD operations work
- ✅ Permissions enforced correctly
- ✅ Ready for UI implementation

**Next:** Build ToursClient component 🎨
