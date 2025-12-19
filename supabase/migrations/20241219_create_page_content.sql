-- Create page_content table for editable static pages
-- This allows admin to edit About, Contact, and other static pages from CMS

CREATE TABLE IF NOT EXISTS page_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(100) UNIQUE NOT NULL, -- 'about', 'contact', etc.
    title VARCHAR(255) NOT NULL,
    
    -- Content stored as JSONB for flexibility
    -- Each page can have different sections/fields
    content JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- SEO
    meta_title VARCHAR(255),
    meta_description TEXT,
    
    -- Metadata
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_page_content_slug ON page_content(slug);

-- Enable RLS
ALTER TABLE page_content ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Anyone can view page content
CREATE POLICY "Anyone can view page content"
    ON page_content
    FOR SELECT
    USING (true);

-- Only admins can update page content
CREATE POLICY "Admins can update page content"
    ON page_content
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_page_content_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER page_content_updated_at
    BEFORE UPDATE ON page_content
    FOR EACH ROW
    EXECUTE FUNCTION update_page_content_updated_at();

-- Seed data for About page
INSERT INTO page_content (slug, title, content, meta_title, meta_description) VALUES (
    'about',
    'About Us',
    '{
        "hero": {
            "title": "About Roving Vietnam",
            "subtitle": "Your trusted partner in discovering the beauty of Vietnam"
        },
        "mission": {
            "title": "Our Mission",
            "content": "We are passionate about showcasing the rich culture, stunning landscapes, and warm hospitality of Vietnam to travelers from around the world."
        },
        "values": [
            {
                "title": "Authenticity",
                "description": "We provide genuine Vietnamese experiences"
            },
            {
                "title": "Quality",
                "description": "We ensure the highest standards in all our services"
            },
            {
                "title": "Sustainability",
                "description": "We promote responsible and eco-friendly tourism"
            }
        ],
        "team": {
            "title": "Our Team",
            "description": "Our team consists of experienced travel experts who are passionate about Vietnam and dedicated to creating unforgettable experiences for our guests."
        }
    }'::jsonb,
    'About Us - Roving Vietnam',
    'Learn about Roving Vietnam, your trusted partner in discovering the beauty of Vietnam'
) ON CONFLICT (slug) DO NOTHING;

-- Seed data for Contact page
INSERT INTO page_content (slug, title, content, meta_title, meta_description) VALUES (
    'contact',
    'Contact Us',
    '{
        "hero": {
            "title": "Contact Us",
            "subtitle": "We are always ready to help you plan your perfect trip"
        },
        "office": {
            "address": "123 Nguyen Hue Street, District 1, Ho Chi Minh City, Vietnam",
            "phone": "+84 123 456 789",
            "mobile": "+84 987 654 321",
            "fax": "+84 028 1234 5678",
            "email": "info@rovingvietnam.com",
            "support_email": "support@rovingvietnam.com",
            "booking_email": "booking@rovingvietnam.com"
        },
        "hours": {
            "weekday": "Monday - Friday: 8:00 - 18:00",
            "saturday": "Saturday: 9:00 - 17:00",
            "sunday": "Sunday: 9:00 - 15:00",
            "emergency": "+84 900 123 456"
        }
    }'::jsonb,
    'Contact Us - Roving Vietnam',
    'Get in touch with Roving Vietnam for your travel inquiries'
) ON CONFLICT (slug) DO NOTHING;

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify table was created
SELECT * FROM page_content ORDER BY slug;
