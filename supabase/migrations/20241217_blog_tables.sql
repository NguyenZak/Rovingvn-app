-- ============================================
-- Blog Management Database Schema
-- ============================================

-- Create blog_categories table
CREATE TABLE IF NOT EXISTS blog_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  
  -- Media
  featured_image TEXT,
  
  -- Organization
  category_id UUID REFERENCES blog_categories(id),
  tags TEXT[], -- Array of strings
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  
  -- Author
  author_id UUID REFERENCES auth.users(id),
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  views_count INTEGER DEFAULT 0
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_blog_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_category ON blog_posts(category_id);
CREATE INDEX IF NOT EXISTS idx_blog_author ON blog_posts(author_id);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_blog_posts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_blog_posts_updated_at();

-- RLS Policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_categories ENABLE ROW LEVEL SECURITY;

-- Blog Posts Policies
CREATE POLICY "Published posts are viewable by everyone"
  ON blog_posts FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can view all posts"
  ON blog_posts FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users with permission can create posts"
  ON blog_posts FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

CREATE POLICY "Users with permission can update posts"
  ON blog_posts FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

CREATE POLICY "Only admins can delete posts"
  ON blog_posts FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Categories Policies (Viewable by all, Editable by admin/editor)
CREATE POLICY "Categories viewable by everyone"
  ON blog_categories FOR SELECT
  USING (true);

CREATE POLICY "Users with permission can manage categories"
  ON blog_categories FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Seed Categories
INSERT INTO blog_categories (name, slug, description) VALUES
('Travel Guides', 'travel-guides', 'Tips and guides for traveling in Vietnam'),
('Culture', 'culture', 'Explore Vietnamese culture and traditions'),
('Food & Drink', 'food-drink', 'Vietnamese cuisine and dining recommendations'),
('News', 'news', 'Latest updates and news')
ON CONFLICT DO NOTHING;

-- Seed Sample Post
INSERT INTO blog_posts (
  title, slug, excerpt, content, category_id, status, published_at
) VALUES (
  'Top 10 Things to Do in Hanoi',
  'top-10-things-hanoi',
  'Discover the best activities and attractions in Vietnam''s capital city.',
  'Hanoi is a city of contrast... (Sample content)',
  (SELECT id FROM blog_categories WHERE slug = 'travel-guides'),
  'published',
  NOW()
) ON CONFLICT DO NOTHING;
