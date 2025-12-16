# 🚀 Quick Start - Chạy Migrations Tự Động

## ✅ Setup đã hoàn tất:
- Cài Supabase CLI
- Tạo migrations folder
- Copy sliders schema vào migrations
- Thêm npm scripts

## 📝 Các bước tiếp theo:

### 1. Link với Supabase Project
```bash
npm run db:link
# Nhập project reference ID khi được hỏi
# Nhập database password khi được hỏi
```

**Lấy thông tin:**
- **Project Ref**: Supabase Dashboard → Settings → General → Reference ID
- **DB Password**: Supabase Dashboard → Settings → Database → Database password

### 2. Push Migrations lên Supabase
```bash
npm run db:push
```

### 3. Verify migrations đã chạy
```bash
npm run db:list
```

---

## 📚 Các lệnh hữu ích:

```bash
# Tạo migration mới
npm run db:new your_migration_name

# Push tất cả migrations
npm run db:push

# Xem migrations đã chạy
npm run db:list

# Link/re-link project
npm run db:link
```

---

## ✨ Bạn đã có sẵn:

1. ✅ Migration file: `supabase/migrations/TIMESTAMP_create_sliders_table.sql`
2. ✅ NPM scripts trong package.json
3. ✅ Supabase CLI installed

**Chỉ cần chạy 2 lệnh:**
```bash
npm run db:link    # Link project (chỉ 1 lần)
npm run db:push    # Push migrations
```

Sau đó truy cập `/admin/sliders` để test! 🎉
