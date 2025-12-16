-- ============================================
-- Vietnamese CMS Database Schema
-- Created: 2025-12-16
-- Description: Complete schema for CMS with RBAC, posts, pages, SEO, media, and audit logging
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ROLES & USER MANAGEMENT
-- ============================================

-- Roles table
CREATE TABLE IF NOT EXISTS roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) UNIQUE NOT NULL CHECK (name IN ('admin', 'editor', 'viewer')),
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User roles junction table
CREATE TABLE IF NOT EXISTS user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- Index for fast user role lookups
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON user_roles(role_id);

-- ============================================
-- CATEGORIES & TAGS
-- ============================================

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for tag lookups
CREATE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);

-- ============================================
-- MEDIA LIBRARY
-- ============================================

-- Media table
CREATE TABLE IF NOT EXISTS media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename VARCHAR(255) NOT NULL,
  storage_path VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for media lookups
CREATE INDEX IF NOT EXISTS idx_media_uploaded_by ON media(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_media_created_at ON media(created_at DESC);

-- ============================================
-- POSTS MANAGEMENT
-- ============================================

-- Posts table
CREATE TABLE IF NOT EXISTS posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  excerpt TEXT,
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for posts
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_status ON posts(status);
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON posts(author_id);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at DESC);

-- Post categories junction table
CREATE TABLE IF NOT EXISTS post_categories (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, category_id)
);

-- Indexes for post categories
CREATE INDEX IF NOT EXISTS idx_post_categories_post_id ON post_categories(post_id);
CREATE INDEX IF NOT EXISTS idx_post_categories_category_id ON post_categories(category_id);

-- Post tags junction table
CREATE TABLE IF NOT EXISTS post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (post_id, tag_id)
);

-- Indexes for post tags
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON post_tags(post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON post_tags(tag_id);

-- ============================================
-- PAGES MANAGEMENT
-- ============================================

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT,
  template VARCHAR(50), -- 'about', 'policy', 'contact', 'custom'
  featured_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for pages
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_template ON pages(template);

-- ============================================
-- SEO METADATA
-- ============================================

-- SEO metadata table
CREATE TABLE IF NOT EXISTS seo_metadata (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_type VARCHAR(20) NOT NULL CHECK (object_type IN ('post', 'page')),
  object_id UUID NOT NULL,
  meta_title VARCHAR(255),
  meta_description TEXT,
  canonical_url VARCHAR(500),
  og_title VARCHAR(255),
  og_description TEXT,
  og_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  noindex BOOLEAN DEFAULT FALSE,
  nofollow BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(object_type, object_id)
);

-- Indexes for SEO metadata
CREATE INDEX IF NOT EXISTS idx_seo_metadata_object ON seo_metadata(object_type, object_id);

-- ============================================
-- AUDIT LOGGING
-- ============================================

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255), -- Store email for reference even if user deleted
  action VARCHAR(50) NOT NULL CHECK (action IN ('create', 'update', 'delete', 'login', 'logout', 'publish', 'unpublish')),
  object_type VARCHAR(50), -- 'post', 'page', 'media', 'user', 'category', 'tag'
  object_id UUID,
  object_name VARCHAR(255), -- Store name for reference
  before_data JSONB,
  after_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for audit logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_object_type ON audit_logs(object_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_object ON audit_logs(object_type, object_id);

-- ============================================
-- INITIAL DATA
-- ============================================

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Toàn quyền quản trị hệ thống'),
  ('editor', 'Tạo và chỉnh sửa nội dung'),
  ('viewer', 'Chỉ xem nội dung')
ON CONFLICT (name) DO NOTHING;

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Điểm đến', 'diem-den', 'Các bài viết về điểm đến du lịch'),
  ('Kinh nghiệm', 'kinh-nghiem', 'Chia sẻ kinh nghiệm du lịch'),
  ('Ẩm thực', 'am-thuc', 'Khám phá ẩm thực Việt Nam'),
  ('Văn hóa', 'van-hoa', 'Văn hóa và lịch sử Việt Nam')
ON CONFLICT (slug) DO NOTHING;

-- Insert default tags
INSERT INTO tags (name, slug) VALUES
  ('Miền Bắc', 'mien-bac'),
  ('Miền Trung', 'mien-trung'),
  ('Miền Nam', 'mien-nam'),
  ('Du lịch bụi', 'du-lich-bui'),
  ('Du lịch cao cấp', 'du-lich-cao-cap')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE roles IS 'Định nghĩa các vai trò trong hệ thống';
COMMENT ON TABLE user_roles IS 'Gán vai trò cho người dùng';
COMMENT ON TABLE categories IS 'Danh mục bài viết';
COMMENT ON TABLE tags IS 'Thẻ (tags) cho bài viết';
COMMENT ON TABLE media IS 'Thư viện media (ảnh, video)';
COMMENT ON TABLE posts IS 'Bài viết blog';
COMMENT ON TABLE pages IS 'Trang tĩnh (About, Policy, v.v.)';
COMMENT ON TABLE seo_metadata IS 'Metadata SEO cho posts và pages';
COMMENT ON TABLE audit_logs IS 'Lịch sử thao tác trong hệ thống';
