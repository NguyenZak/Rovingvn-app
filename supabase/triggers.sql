-- ============================================
-- Database Triggers for Vietnamese CMS
-- Auto-generate slugs, update timestamps, audit logging
-- ============================================

-- ============================================
-- AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_categories_timestamp
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_timestamp
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_timestamp
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_seo_metadata_timestamp
  BEFORE UPDATE ON seo_metadata
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-GENERATE SLUG FUNCTION
-- ============================================

-- Function to generate slug from Vietnamese text
CREATE OR REPLACE FUNCTION public.generate_slug(text_input TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase
  slug := LOWER(text_input);
  
  -- Replace Vietnamese characters with ASCII equivalents
  slug := REPLACE(slug, 'á', 'a');
  slug := REPLACE(slug, 'à', 'a');
  slug := REPLACE(slug, 'ả', 'a');
  slug := REPLACE(slug, 'ã', 'a');
  slug := REPLACE(slug, 'ạ', 'a');
  slug := REPLACE(slug, 'ă', 'a');
  slug := REPLACE(slug, 'ắ', 'a');
  slug := REPLACE(slug, 'ằ', 'a');
  slug := REPLACE(slug, 'ẳ', 'a');
  slug := REPLACE(slug, 'ẵ', 'a');
  slug := REPLACE(slug, 'ặ', 'a');
  slug := REPLACE(slug, 'â', 'a');
  slug := REPLACE(slug, 'ấ', 'a');
  slug := REPLACE(slug, 'ầ', 'a');
  slug := REPLACE(slug, 'ẩ', 'a');
  slug := REPLACE(slug, 'ẫ', 'a');
  slug := REPLACE(slug, 'ậ', 'a');
  
  slug := REPLACE(slug, 'é', 'e');
  slug := REPLACE(slug, 'è', 'e');
  slug := REPLACE(slug, 'ẻ', 'e');
  slug := REPLACE(slug, 'ẽ', 'e');
  slug := REPLACE(slug, 'ẹ', 'e');
  slug := REPLACE(slug, 'ê', 'e');
  slug := REPLACE(slug, 'ế', 'e');
  slug := REPLACE(slug, 'ề', 'e');
  slug := REPLACE(slug, 'ể', 'e');
  slug := REPLACE(slug, 'ễ', 'e');
  slug := REPLACE(slug, 'ệ', 'e');
  
  slug := REPLACE(slug, 'í', 'i');
  slug := REPLACE(slug, 'ì', 'i');
  slug := REPLACE(slug, 'ỉ', 'i');
  slug := REPLACE(slug, 'ĩ', 'i');
  slug := REPLACE(slug, 'ị', 'i');
  
  slug := REPLACE(slug, 'ó', 'o');
  slug := REPLACE(slug, 'ò', 'o');
  slug := REPLACE(slug, 'ỏ', 'o');
  slug := REPLACE(slug, 'õ', 'o');
  slug := REPLACE(slug, 'ọ', 'o');
  slug := REPLACE(slug, 'ô', 'o');
  slug := REPLACE(slug, 'ố', 'o');
  slug := REPLACE(slug, 'ồ', 'o');
  slug := REPLACE(slug, 'ổ', 'o');
  slug := REPLACE(slug, 'ỗ', 'o');
  slug := REPLACE(slug, 'ộ', 'o');
  slug := REPLACE(slug, 'ơ', 'o');
  slug := REPLACE(slug, 'ớ', 'o');
  slug := REPLACE(slug, 'ờ', 'o');
  slug := REPLACE(slug, 'ở', 'o');
  slug := REPLACE(slug, 'ỡ', 'o');
  slug := REPLACE(slug, 'ợ', 'o');
  
  slug := REPLACE(slug, 'ú', 'u');
  slug := REPLACE(slug, 'ù', 'u');
  slug := REPLACE(slug, 'ủ', 'u');
  slug := REPLACE(slug, 'ũ', 'u');
  slug := REPLACE(slug, 'ụ', 'u');
  slug := REPLACE(slug, 'ư', 'u');
  slug := REPLACE(slug, 'ứ', 'u');
  slug := REPLACE(slug, 'ừ', 'u');
  slug := REPLACE(slug, 'ử', 'u');
  slug := REPLACE(slug, 'ữ', 'u');
  slug := REPLACE(slug, 'ự', 'u');
  
  slug := REPLACE(slug, 'ý', 'y');
  slug := REPLACE(slug, 'ỳ', 'y');
  slug := REPLACE(slug, 'ỷ', 'y');
  slug := REPLACE(slug, 'ỹ', 'y');
  slug := REPLACE(slug, 'ỵ', 'y');
  
  slug := REPLACE(slug, 'đ', 'd');
  
  -- Replace spaces and special characters with hyphens
  slug := REGEXP_REPLACE(slug, '[^a-z0-9]+', '-', 'g');
  
  -- Remove leading/trailing hyphens
  slug := TRIM(BOTH '-' FROM slug);
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- AUTO-SLUG TRIGGERS
-- ============================================

-- Trigger function for posts slug
CREATE OR REPLACE FUNCTION public.set_post_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    -- Ensure uniqueness by appending number if needed
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM posts WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for pages slug
CREATE OR REPLACE FUNCTION public.set_page_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.title);
    
    -- Ensure uniqueness
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM pages WHERE slug = NEW.slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::UUID)) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for categories slug
CREATE OR REPLACE FUNCTION public.set_category_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger function for tags slug
CREATE OR REPLACE FUNCTION public.set_tag_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.name);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply slug triggers
CREATE TRIGGER set_posts_slug_trigger
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_post_slug();

CREATE TRIGGER set_pages_slug_trigger
  BEFORE INSERT OR UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION set_page_slug();

CREATE TRIGGER set_categories_slug_trigger
  BEFORE INSERT OR UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION set_category_slug();

CREATE TRIGGER set_tags_slug_trigger
  BEFORE INSERT OR UPDATE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION set_tag_slug();

-- ============================================
-- AUDIT LOG TRIGGERS
-- ============================================

-- Generic audit log function
CREATE OR REPLACE FUNCTION public.audit_log()
RETURNS TRIGGER AS $$
DECLARE
  user_email_var TEXT;
  action_type TEXT;
  object_name_var TEXT;
BEGIN
  -- Determine action type
  IF TG_OP = 'INSERT' THEN
    action_type := 'create';
  ELSIF TG_OP = 'UPDATE' THEN
    action_type := 'update';
  ELSIF TG_OP = 'DELETE' THEN
    action_type := 'delete';
  END IF;
  
  -- Get user email
  SELECT email INTO user_email_var
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Get object name based on table
  IF TG_TABLE_NAME IN ('posts', 'pages', 'categories') THEN
    IF TG_OP = 'DELETE' THEN
      object_name_var := OLD.title;
    ELSE
      object_name_var := NEW.title;
    END IF;
  ELSIF TG_TABLE_NAME = 'tags' THEN
    IF TG_OP = 'DELETE' THEN
      object_name_var := OLD.name;
    ELSE
      object_name_var := NEW.name;
    END IF;
  ELSIF TG_TABLE_NAME = 'media' THEN
    IF TG_OP = 'DELETE' THEN
      object_name_var := OLD.filename;
    ELSE
      object_name_var := NEW.filename;
    END IF;
  END IF;
  
  -- Insert audit log
  INSERT INTO audit_logs (
    user_id,
    user_email,
    action,
    object_type,
    object_id,
    object_name,
    before_data,
    after_data
  ) VALUES (
    auth.uid(),
    user_email_var,
    action_type,
    TG_TABLE_NAME,
    CASE 
      WHEN TG_OP = 'DELETE' THEN OLD.id
      ELSE NEW.id
    END,
    object_name_var,
    CASE 
      WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)
      WHEN TG_OP = 'UPDATE' THEN row_to_json(OLD)
      ELSE NULL
    END,
    CASE 
      WHEN TG_OP = 'DELETE' THEN NULL
      ELSE row_to_json(NEW)
    END
  );
  
  -- Return appropriate record
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to key tables
CREATE TRIGGER audit_posts_trigger
  AFTER INSERT OR UPDATE OR DELETE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

CREATE TRIGGER audit_pages_trigger
  AFTER INSERT OR UPDATE OR DELETE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

CREATE TRIGGER audit_categories_trigger
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

CREATE TRIGGER audit_tags_trigger
  AFTER INSERT OR UPDATE OR DELETE ON tags
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

CREATE TRIGGER audit_media_trigger
  AFTER INSERT OR UPDATE OR DELETE ON media
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

-- ============================================
-- PUBLISH DATE TRIGGER
-- ============================================

-- Auto-set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.set_published_date()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status != 'published') THEN
    NEW.published_at := NOW();
  ELSIF NEW.status = 'draft' THEN
    NEW.published_at := NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_post_published_date
  BEFORE INSERT OR UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION set_published_date();

CREATE TRIGGER set_page_published_date
  BEFORE INSERT OR UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION set_published_date();
