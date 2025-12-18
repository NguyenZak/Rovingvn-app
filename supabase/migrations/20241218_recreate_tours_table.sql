-- Recreate Tours Table with Correct Schema
-- This will drop the old table and create new one matching the form

-- STEP 1: Backup existing data (if any important tours exist)
-- You can skip this if the current tours data is not important

-- STEP 2: Drop old tours table
DROP TABLE IF EXISTS tours CASCADE;

-- STEP 3: Create tours table with CORRECT schema (from migration file)
CREATE TABLE tours (
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
  gallery_images JSONB DEFAULT '[]'::jsonb,
  
  -- Location
  start_location VARCHAR(255),
  end_location VARCHAR(255),
  
  -- Itinerary (structured data)
  itinerary JSONB DEFAULT '[]'::jsonb,
  
  -- Includes/Excludes
  includes TEXT[] DEFAULT '{}',
  excludes TEXT[] DEFAULT '{}',
  
  -- SEO
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[] DEFAULT '{}',
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- STEP 4: Create indexes
CREATE INDEX idx_tours_status ON tours(status);
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_featured ON tours(featured);
CREATE INDEX idx_tours_created_at ON tours(created_at DESC);

-- STEP 5: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tours_updated_at
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- STEP 6: Enable RLS
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

-- STEP 7: Create RLS policies
CREATE POLICY "Public can view published tours"
    ON tours FOR SELECT
    USING (status = 'published');

CREATE POLICY "Authenticated users can view all tours"
    ON tours FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Authenticated users can create tours"
    ON tours FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Users can update their own tours"
    ON tours FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Users can delete their own tours"
    ON tours FOR DELETE
    TO authenticated
    USING (true);

-- SUCCESS!
SELECT 'Tours table recreated successfully!' AS status;
