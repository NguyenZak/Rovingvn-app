-- Quick fix: Add slug field and update existing regions
-- Run this in Supabase SQL Editor

-- Add slug column
ALTER TABLE regions ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Update existing regions with slugs
UPDATE regions SET slug = 'northern-vietnam' WHERE name = 'Northern Vietnam';
UPDATE regions SET slug = 'central-vietnam' WHERE name = 'Central Vietnam';
UPDATE regions SET slug = 'southern-vietnam' WHERE name = 'Southern Vietnam';

-- Make slug unique and not null
ALTER TABLE regions ADD CONSTRAINT regions_slug_unique UNIQUE (slug);
ALTER TABLE regions ALTER COLUMN slug SET NOT NULL;

-- Add index
CREATE INDEX IF NOT EXISTS idx_regions_slug ON regions(slug);

-- Update links to point to new region pages
UPDATE regions SET link = '/regions/northern-vietnam' WHERE name = 'Northern Vietnam';
UPDATE regions SET link = '/regions/central-vietnam' WHERE name = 'Central Vietnam';
UPDATE regions SET link = '/regions/southern-vietnam' WHERE name = 'Southern Vietnam';
