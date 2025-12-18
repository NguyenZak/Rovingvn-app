-- Site Settings Table
-- Lưu trữ tất cả thông tin cấu hình website

CREATE TABLE IF NOT EXISTS site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Basic Info
  site_name VARCHAR(255) NOT NULL DEFAULT 'Roving Việt Nam',
  site_short_name VARCHAR(50) DEFAULT 'RovingVN',
  site_description TEXT,
  site_tagline VARCHAR(255),
  site_url VARCHAR(500),
  
  -- Logo & Branding
  logo_main TEXT, -- URL to main logo
  logo_dark TEXT, -- URL to dark mode logo
  logo_small TEXT, -- URL to small logo
  logo_text TEXT, -- URL to text logo
  
  -- Favicon
  favicon_ico TEXT,
  favicon_16 TEXT,
  favicon_32 TEXT,
  favicon_180 TEXT, -- Apple touch icon
  favicon_192 TEXT, -- Android chrome 192
  favicon_512 TEXT, -- Android chrome 512
  
  -- Open Graph
  og_image TEXT, -- Social share image
  og_image_width INTEGER DEFAULT 1200,
  og_image_height INTEGER DEFAULT 630,
  
  -- Contact Information
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  contact_address TEXT,
  
  -- Social Media Links
  social_facebook VARCHAR(500),
  social_instagram VARCHAR(500),
  social_twitter VARCHAR(500),
  social_youtube VARCHAR(500),
  social_tiktok VARCHAR(500),
  
  -- SEO
  meta_keywords TEXT[], -- Array of keywords
  meta_author VARCHAR(255),
  meta_language VARCHAR(10) DEFAULT 'vi-VN',
  
  -- Theme
  theme_color VARCHAR(7) DEFAULT '#10b981', -- Hex color
  background_color VARCHAR(7) DEFAULT '#ffffff',
  
  -- Business Info
  business_type VARCHAR(100) DEFAULT 'TravelAgency',
  business_legal_name VARCHAR(255),
  business_founding_date VARCHAR(4), -- Year
  business_vat_id VARCHAR(50),
  
  -- Analytics
  google_analytics_id VARCHAR(50),
  facebook_pixel_id VARCHAR(50),
  google_tag_manager_id VARCHAR(50),
  google_site_verification VARCHAR(100),
  
  -- Features (JSON for flexibility)
  features JSONB DEFAULT '{"blog": true, "tours": true, "customTrips": true, "newsletter": true, "reviews": true}'::jsonb,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by UUID REFERENCES auth.users(id)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_site_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON site_settings
  FOR EACH ROW
  EXECUTE FUNCTION update_site_settings_updated_at();

-- RLS Policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Everyone can read site settings (public info)
CREATE POLICY "Site settings are viewable by everyone"
  ON site_settings FOR SELECT
  USING (true);

-- Only admins can update
CREATE POLICY "Only admins can update site settings"
  ON site_settings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Only admins can insert (should only have 1 row)
CREATE POLICY "Only admins can insert site settings"
  ON site_settings FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM auth.users
      WHERE auth.users.id = auth.uid()
      AND auth.users.raw_user_meta_data->>'role' = 'admin'
    )
  );

-- Insert default settings (only if empty)
INSERT INTO site_settings (
  site_name,
  site_short_name,
  site_description,
  site_tagline,
  site_url,
  contact_email,
  contact_phone,
  contact_address,
  social_facebook,
  social_instagram,
  meta_keywords,
  meta_author,
  business_legal_name
)
SELECT
  'Roving Việt Nam',
  'RovingVN',
  'Khám phá vẻ đẹp Việt Nam cùng Roving - Trải nghiệm du lịch độc đáo và chuyên nghiệp',
  'Experience the beauty of Vietnam',
  'https://rovingvn.com',
  'info@rovingvn.com',
  '+84 123 456 789',
  'Hà Nội, Việt Nam',
  'https://facebook.com/rovingvn',
  'https://instagram.com/rovingvn',
  ARRAY['du lịch việt nam', 'tour việt nam', 'roving vietnam', 'travel vietnam', 'vietnam tours', 'khám phá việt nam'],
  'Roving Vietnam',
  'Công ty TNHH Du lịch Roving Việt Nam'
WHERE NOT EXISTS (SELECT 1 FROM site_settings);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_site_settings_updated_at ON site_settings(updated_at DESC);

-- Comment
COMMENT ON TABLE site_settings IS 'Stores all website configuration and settings';
