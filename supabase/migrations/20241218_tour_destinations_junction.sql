-- ============================================
-- Tour-Destinations Junction Table Migration
-- Creates many-to-many relationship between tours and destinations
-- ============================================

-- Step 1: Create the junction table
CREATE TABLE IF NOT EXISTS tour_destinations (
  tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES destinations(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Composite primary key
  PRIMARY KEY (tour_id, destination_id)
);

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tour_destinations_tour_id ON tour_destinations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_destinations_destination_id ON tour_destinations(destination_id);

-- Step 3: Migrate existing data from tours.destination_id to junction table
-- Only migrate if destination_id column exists and is not null
DO $$
BEGIN
  -- Check if the destination_id column exists in tours table
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = 'tours'
    AND column_name = 'destination_id'
  ) THEN
    -- Migrate existing data
    INSERT INTO tour_destinations (tour_id, destination_id)
    SELECT id, destination_id
    FROM tours
    WHERE destination_id IS NOT NULL
    ON CONFLICT DO NOTHING;
    
    RAISE NOTICE 'Migrated existing tour-destination relationships';
  ELSE
    RAISE NOTICE 'Column destination_id does not exist in tours table, skipping migration';
  END IF;
END $$;

-- Step 4: Drop the old destination_id column from tours table
-- Note: This is a breaking change, but data is preserved in junction table
ALTER TABLE tours DROP COLUMN IF EXISTS destination_id;

-- Step 5: Enable RLS on junction table
ALTER TABLE tour_destinations ENABLE ROW LEVEL SECURITY;

-- Step 6: Create RLS policies for junction table
-- Everyone can view tour-destination relationships for published tours
CREATE POLICY "Anyone can view tour destinations"
  ON tour_destinations FOR SELECT
  USING (true);

-- Authenticated users with edit permissions can manage relationships
CREATE POLICY "Editors can insert tour destinations"
  ON tour_destinations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

CREATE POLICY "Editors can delete tour destinations"
  ON tour_destinations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Success message
SELECT 'Tour-Destinations junction table created successfully!' AS status;
