-- Add destination_id to tours table
-- This creates a relationship between tours and destinations

-- Step 1: Add destination_id column
ALTER TABLE tours ADD COLUMN IF NOT EXISTS destination_id UUID REFERENCES destinations(id) ON DELETE SET NULL;

-- Step 2: Create index for performance
CREATE INDEX IF NOT EXISTS idx_tours_destination_id ON tours(destination_id);

-- Step 3: Update existing tours with sample destinations (optional)
-- Match Ha Long Bay tour with Ha Long Bay destination
UPDATE tours 
SET destination_id = (SELECT id FROM destinations WHERE slug = 'ha-long-bay' LIMIT 1)
WHERE slug = 'ha-long-bay-cruise-2d1n' AND destination_id IS NULL;

-- Match Sapa tour with a sample destination (you can adjust this)
-- If you don't have a Sapa destination, this will just leave it NULL
UPDATE tours 
SET destination_id = (SELECT id FROM destinations WHERE slug = 'sapa' LIMIT 1)
WHERE slug = 'sapa-trekking-3d2n' AND destination_id IS NULL;

-- Success message
SELECT 'Tours table updated with destination_id column!' AS status;
