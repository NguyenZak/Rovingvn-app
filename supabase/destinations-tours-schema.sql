-- ============================================
-- Destinations & Tours Schema
-- ============================================

-- Create destinations table
CREATE TABLE IF NOT EXISTS destinations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    country VARCHAR(100) DEFAULT 'Vietnam',
    region VARCHAR(100), -- North, Central, South
    description TEXT,
    image_url TEXT,
    gallery_images JSONB, -- Array of image URLs
    best_time_to_visit VARCHAR(255),
    climate_info TEXT,
    attractions TEXT,
    seo_title VARCHAR(255),
    seo_description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tours table
CREATE TABLE IF NOT EXISTS tours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL,
    price DECIMAL(10,2),
    duration VARCHAR(100), -- e.g., "3 days 2 nights"
    description TEXT,
    highlights TEXT[],
    itinerary JSONB, -- Array of day-by-day activities
    included TEXT[], -- What's included
    excluded TEXT[], -- What's not included
    images TEXT[], -- Array of image URLs
    cover_image TEXT,
    max_group_size INT DEFAULT 15,
    difficulty VARCHAR(50), -- easy, moderate, challenging
    tour_type VARCHAR(100), -- adventure, cultural, beach, etc.
    featured BOOLEAN DEFAULT false,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tour_pricing table for pricing tiers
CREATE TABLE IF NOT EXISTS tour_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
    tier_name VARCHAR(100) NOT NULL, -- e.g., "Standard", "Premium", "VIP"
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    max_guests INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_destinations_slug ON destinations(slug);
CREATE INDEX IF NOT EXISTS idx_destinations_status ON destinations(status);
CREATE INDEX IF NOT EXISTS idx_destinations_region ON destinations(region);
CREATE INDEX IF NOT EXISTS idx_tours_slug ON tours(slug);
CREATE INDEX IF NOT EXISTS idx_tours_status ON tours(status);
CREATE INDEX IF NOT EXISTS idx_tours_destination ON tours(destination_id);
CREATE INDEX IF NOT EXISTS idx_tours_featured ON tours(featured);

-- Create updated_at trigger function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
DROP TRIGGER IF EXISTS set_destinations_updated_at ON destinations;
CREATE TRIGGER set_destinations_updated_at
    BEFORE UPDATE ON destinations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_tours_updated_at ON tours;
CREATE TRIGGER set_tours_updated_at
    BEFORE UPDATE ON tours
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- RLS Policies for Destinations & Tours
-- ============================================

-- Enable RLS
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_pricing ENABLE ROW LEVEL SECURITY;

-- Public read access for published content
CREATE POLICY "Public can view published destinations"
    ON destinations FOR SELECT
    USING (status = 'published');

CREATE POLICY "Public can view published tours"
    ON tours FOR SELECT
    USING (status = 'published');

CREATE POLICY "Public can view tour pricing"
    ON tour_pricing FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM tours WHERE tours.id = tour_pricing.tour_id AND tours.status = 'published'
    ));

-- Editors and admins can do everything
CREATE POLICY "Editors can manage destinations"
    ON destinations FOR ALL
    USING (is_editor_or_admin(auth.uid()))
    WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "Editors can manage tours"
    ON tours FOR ALL
    USING (is_editor_or_admin(auth.uid()))
    WITH CHECK (is_editor_or_admin(auth.uid()));

CREATE POLICY "Editors can manage tour pricing"
    ON tour_pricing FOR ALL
    USING (is_editor_or_admin(auth.uid()))
    WITH CHECK (is_editor_or_admin(auth.uid()));
