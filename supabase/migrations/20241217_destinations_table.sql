-- ============================================
-- Destinations Management Database Schema
-- ============================================

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Location
  country VARCHAR(100) DEFAULT 'Vietnam',
  region VARCHAR(100), -- North, Central, South
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Media
  image_url TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Travel Info
  best_time_to_visit TEXT,
  climate TEXT,
  currency VARCHAR(10) DEFAULT 'VND',
  language VARCHAR(100) DEFAULT 'Vietnamese',
  
  -- Highlights
  highlights TEXT[] DEFAULT '{}',
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  
  -- Status
  status VARCHAR(20) DEFAULT 'published', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_destinations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER destinations_updated_at
  BEFORE UPDATE ON destinations
  FOR EACH ROW
  EXECUTE FUNCTION update_destinations_updated_at();

-- RLS Policies
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;

-- Everyone can view published
CREATE POLICY "Published destinations viewable by everyone"
  ON destinations FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated users can view all
CREATE POLICY "Authenticated users view all destinations"
  ON destinations FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Editors/Admins can manage
CREATE POLICY "Editors can insert destinations"
  ON destinations FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can update destinations"
  ON destinations FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

CREATE POLICY "Admins can delete destinations"
  ON destinations FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Seed Data
INSERT INTO destinations (
  name, slug, short_description, region, featured_image
) VALUES 
('Ha Long Bay', 'ha-long-bay', 'UNESCO World Heritage Site known for emerald waters and islands.', 'North', 'https://images.unsplash.com/photo-1528127269322-539801943592'),
('Hoi An', 'hoi-an', 'Ancient town with lanterns and tailoring.', 'Central', 'https://images.unsplash.com/photo-1552355170-c8337700279c'),
('Ho Chi Minh City', 'ho-chi-minh-city', 'Bustling metropolis in the south.', 'South', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641')
ON CONFLICT DO NOTHING;
