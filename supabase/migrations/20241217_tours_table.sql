-- ============================================
-- Tours Management Database Schema
-- ============================================

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- Details
  duration_days INTEGER,
  duration_nights INTEGER,
  max_participants INTEGER,
  min_participants INTEGER DEFAULT 1,
  difficulty_level VARCHAR(50), -- 'easy', 'moderate', 'challenging', 'extreme'
  
  -- Pricing
  price_adult DECIMAL(10,2),
  price_child DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'VND',
  
  -- Media
  featured_image TEXT,
  gallery_images JSONB DEFAULT '[]'::jsonb, -- Array of image URLs
  
  -- Location
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  
  -- Itinerary (structured data)
  itinerary JSONB DEFAULT '[]'::jsonb, -- [{day: 1, title: '', description: '', activities: []}]
  
  -- Includes/Excludes
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'published', 'archived'
  featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_tours_created_at ON tours(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_tours_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tours_updated_at
  BEFORE UPDATE ON tours
  FOR EACH ROW
  EXECUTE FUNCTION update_tours_updated_at();

-- RLS Policies
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- Everyone can view published tours
CREATE POLICY "Published tours are viewable by everyone"
  ON tours FOR SELECT
  USING (status = 'published' OR auth.uid() IS NOT NULL);

-- Authenticated users can view all tours
CREATE POLICY "Authenticated users can view all tours"
  ON tours FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Only users with permission can create tours
CREATE POLICY "Users with permission can create tours"
  ON tours FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Only users with permission can update tours
CREATE POLICY "Users with permission can update tours"
  ON tours FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Only admins can delete tours
CREATE POLICY "Only admins can delete tours"
  ON tours FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name = 'admin'
    )
  );

-- Seed sample data
INSERT INTO tours (
  title,
  slug,
  short_description,
  description,
  duration_days,
  duration_nights,
  price_adult,
  price_child,
  difficulty_level,
  status,
  featured,
  includes,
  excludes
) VALUES (
  'Ha Long Bay Cruise - 2 Days 1 Night',
  'ha-long-bay-cruise-2d1n',
  'Experience the stunning beauty of Ha Long Bay on a luxury cruise',
  'Explore the magnificent Ha Long Bay, a UNESCO World Heritage Site, on this unforgettable 2-day cruise. Enjoy kayaking, swimming, and visiting stunning caves.',
  2,
  1,
  3500000,
  2500000,
  'easy',
  'published',
  true,
  ARRAY['Cruise accommodation', 'All meals', 'Kayaking', 'Cave entrance fees', 'English speaking guide'],
  ARRAY['Personal expenses', 'Drinks', 'Tips', 'Travel insurance']
), (
  'Sapa Trekking Adventure - 3 Days 2 Nights',
  'sapa-trekking-3d2n',
  'Trek through rice terraces and ethnic minority villages',
  'Discover the breathtaking landscapes of Sapa with this 3-day trekking adventure. Visit local villages, meet hill tribes, and enjoy stunning mountain views.',
  3,
  2,
  4200000,
  3000000,
  'moderate',
  'published',
  true,
  ARRAY['Homestay accommodation', 'All meals', 'Trekking guide', 'Transportation', 'Entrance fees'],
  ARRAY['Personal expenses', 'Drinks', 'Tips', 'Travel insurance']
) ON CONFLICT DO NOTHING;

-- Comments
COMMENT ON TABLE tours IS 'Tours and travel packages';
COMMENT ON COLUMN tours.itinerary IS 'Day-by-day itinerary in JSON format';
COMMENT ON COLUMN tours.gallery_images IS 'Array of image URLs for tour gallery';
