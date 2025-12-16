-- 1. Create helper function (Temporary permissive version for Dev)
-- Using 'user_uuid' to match existing function signature and avoid dependency errors
CREATE OR REPLACE FUNCTION public.is_editor_or_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
  -- Verify user exists in auth.users
  RETURN EXISTS (SELECT 1 FROM auth.users WHERE id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create Destinations Table
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

-- 3. Create Tours Table
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

-- 4. Create Tour Pricing Table for pricing tiers
CREATE TABLE IF NOT EXISTS tour_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE NOT NULL,
    tier_name VARCHAR(100) NOT NULL, -- e.g., "Standard", "Premium", "VIP"
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    max_guests INT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Helper Function for timestamp update
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 6. Triggers
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

-- 7. RLS Setup
ALTER TABLE destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tours ENABLE ROW LEVEL SECURITY;
ALTER TABLE tour_pricing ENABLE ROW LEVEL SECURITY;

-- Policies (Drop first to avoid errors if exist)
DROP POLICY IF EXISTS "Public can view published destinations" ON destinations;
CREATE POLICY "Public can view published destinations" 
    ON destinations FOR SELECT 
    USING (true); -- DEBUG: Tam thoi cho phep xem tat ca de Debug

DROP POLICY IF EXISTS "Editors can manage destinations" ON destinations;
CREATE POLICY "Editors can manage destinations" 
    ON destinations FOR ALL 
    USING (is_editor_or_admin(auth.uid())) 
    WITH CHECK (is_editor_or_admin(auth.uid()));

-- 8. Tours Policies
DROP POLICY IF EXISTS "Public can view published tours" ON tours;
CREATE POLICY "Public can view published tours" ON tours FOR SELECT USING (true); -- DEBUG: Tam thoi cho phep xem tat ca

DROP POLICY IF EXISTS "Editors can manage tours" ON tours;
CREATE POLICY "Editors can manage tours" ON tours FOR ALL USING (is_editor_or_admin(auth.uid()));

-- 9. Tour Pricing Policies
DROP POLICY IF EXISTS "Public can view tour pricing" ON tour_pricing;
CREATE POLICY "Public can view tour pricing" ON tour_pricing FOR SELECT USING (EXISTS (
    SELECT 1 FROM tours WHERE tours.id = tour_pricing.tour_id AND tours.status = 'published'
));

DROP POLICY IF EXISTS "Editors can manage tour_pricing" ON tour_pricing;
CREATE POLICY "Editors can manage tour_pricing" ON tour_pricing FOR ALL USING (is_editor_or_admin(auth.uid()));

-- 10. Tour Destinations Junction Table
CREATE TABLE IF NOT EXISTS tour_destinations (
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    PRIMARY KEY (tour_id, destination_id)
);

ALTER TABLE tour_destinations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view tour_destinations" ON tour_destinations;
CREATE POLICY "Public can view tour_destinations" ON tour_destinations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Editors can manage tour_destinations" ON tour_destinations;
CREATE POLICY "Editors can manage tour_destinations" ON tour_destinations FOR ALL USING (is_editor_or_admin(auth.uid()));

-- Migrate legacy data
INSERT INTO tour_destinations (tour_id, destination_id)
SELECT id, destination_id 
FROM tours 
WHERE destination_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Reload Schema Cache
NOTIFY pgrst, 'reload schema';
