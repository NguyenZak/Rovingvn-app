-- Add show_in_featured column to destinations table
-- This controls which destinations appear in "Destinations Not To Miss" section

ALTER TABLE destinations 
ADD COLUMN IF NOT EXISTS show_in_featured BOOLEAN DEFAULT false;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_destinations_show_in_featured 
ON destinations(show_in_featured) 
WHERE show_in_featured = true;

-- Add comment for documentation
COMMENT ON COLUMN destinations.show_in_featured IS 'Controls whether this destination appears in the "Destinations Not To Miss" section on homepage';
