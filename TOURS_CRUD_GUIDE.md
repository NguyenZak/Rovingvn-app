# Tours CRUD - Quick Start Guide

## ✅ Đã Tạo

### 1. Database
- ✅ `tours` table với đầy đủ fields
- ✅ RLS policies (RBAC integrated)
- ✅ Sample data (Ha Long Bay, Sapa tours)
- ✅ Indexes for performance

### 2. Backend
- ✅ Server actions (`lib/actions/tour-actions.ts`)
- ✅ CRUD operations với permission checks
- ✅ Pagination & filters
- ✅ Search functionality

### 3. Frontend (In Progress...)
- ✅ Server page (`app/(admin)/admin/tours/page.tsx`)
- ⏳ Client component (working now...)

---

## 🚀 Setup (chạy sau)

### Step 1: Run Migration

```bash
# Trong Supabase SQL Editor, chạy:
supabase/migrations/20241217_tours_table.sql
```

### Step 2: Test

```bash
# Server đang chạy, sau khi code xong:
http://localhost:3000/admin/tours
```

---

## 📋 Features

**List View:**
- Search tours by title
- Filter by status (draft/published/archived)
- Sort by created date, price
- Pagination (20 per page)
- Actions: Edit, Delete, Publish

**Create/Edit:**
- Rich form với tabs
- Image upload
- Itinerary builder
- SEO fields

**Permissions:**
- Admin: Full access
- Editor: Create, Edit, Publish
- Viewer: Read only

---

Đang code UI components... Sẽ hoàn thành trong vài phút! ⏳
