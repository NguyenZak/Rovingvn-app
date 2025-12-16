# Supabase CLI - Hướng dẫn Setup và Chạy Migrations

## Bước 1: Cài đặt Supabase CLI

```bash
# Đã chạy lệnh này:
npm install supabase --save-dev
```

## Bước 2: Lấy Project Reference ID

1. Mở Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn
3. Vào **Settings** → **General**
4. Copy **Reference ID** (dạng: `abcdefghijklmnop`)

## Bước 3: Link Project với Supabase

```bash
# Di chuyển vào thư mục project
cd "/Users/apple/Documents/ViZ Solutions/Roving-App"

# Link với Supabase project
npx supabase link --project-ref YOUR_PROJECT_REF_ID

# Nó sẽ hỏi database password (lấy từ Supabase Dashboard > Settings > Database)
```

## Bước 4: Tạo Migration từ Schema hiện tại

```bash
# Tạo migration file mới
npx supabase migration new create_sliders_table
```

Lệnh này sẽ tạo file:
```
supabase/migrations/20231216XXXXXX_create_sliders_table.sql
```

## Bước 5: Copy SQL vào Migration File

Sau khi file migration được tạo, copy nội dung từ `supabase/sliders-schema.sql` vào file migration mới.

**Hoặc tự động:**
```bash
# Copy sliders-schema.sql vào migration folder với timestamp
TIMESTAMP=$(date +%Y%m%d%H%M%S)
cp supabase/sliders-schema.sql "supabase/migrations/${TIMESTAMP}_create_sliders_table.sql"
```

## Bước 6: Push Migration lên Supabase

```bash
# Push tất cả migrations chưa chạy lên Supabase
npx supabase db push
```

## Bước 7: Verify Migration đã chạy

```bash
# Xem lịch sử migrations đã chạy
npx supabase migration list
```

---

## Tạo Migrations Mới trong Tương lai

```bash
# 1. Tạo migration file mới
npx supabase migration new your_migration_name

# 2. Viết SQL vào file vừa tạo
# File nằm ở: supabase/migrations/TIMESTAMP_your_migration_name.sql

# 3. Push lên Supabase
npx supabase db push
```

---

## Troubleshooting

### Lỗi "Project not linked"
→ Chạy lại `npx supabase link --project-ref YOUR_REF_ID`

### Lỗi "Invalid database password"
→ Lấy password từ: Supabase Dashboard > Settings > Database > Password

### Lỗi "Migration already exists"
→ Migration đã chạy rồi, check bằng `npx supabase migration list`

### Rollback migration (nếu cần)
```bash
# Xem history
npx supabase migration list

# Tạo migration mới để revert changes
npx supabase migration new revert_sliders_table
# Viết SQL DROP TABLE trong file này
```

---

## Cấu trúc Folder sau khi setup

```
roving-app/
├── supabase/
│   ├── migrations/
│   │   └── 20231216XXXXXX_create_sliders_table.sql ✅
│   ├── schema.sql (CMS tables - có thể migrate sau)
│   ├── sliders-schema.sql (source file)
│   └── ...
├── package.json
└── .env.local
```

---

## Script Tự động (Optional)

Tạo file `package.json` scripts:

```json
{
  "scripts": {
    "db:push": "supabase db push",
    "db:new": "supabase migration new",
    "db:list": "supabase migration list",
    "db:reset": "supabase db reset"
  }
}
```

Sau đó chỉ cần:
```bash
npm run db:push
```

---

## Next Steps

1. ✅ Chạy `npx supabase link` để link project
2. ✅ Copy `sliders-schema.sql` vào migrations folder
3. ✅ Chạy `npx supabase db push` để apply migration
4. ✅ Truy cập `/admin/sliders` để test

Bạn muốn tôi tạo sẵn migration file không?
