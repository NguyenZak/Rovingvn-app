-- Add slug column to regions table for URL-friendly routing
ALTER TABLE regions ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;

-- Generate slugs from existing region names
UPDATE regions SET slug = LOWER(REPLACE(name, ' ', '-')) WHERE slug IS NULL;

-- Make slug NOT NULL after populating
ALTER TABLE regions ALTER COLUMN slug SET NOT NULL;

-- Add index for slug lookups
CREATE INDEX IF NOT EXISTS idx_regions_slug ON regions(slug);
