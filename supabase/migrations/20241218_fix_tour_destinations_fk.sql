
-- Ensure tour_destinations table exists and has correct FKs
-- This script is idempotent-ish regarding constraints

DO $$
BEGIN
    -- 1. Create table if not exists (in case it was dropped)
    CREATE TABLE IF NOT EXISTS tour_destinations (
        tour_id UUID NOT NULL,
        destination_id UUID NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        PRIMARY KEY (tour_id, destination_id)
    );

    -- 2. Drop existing constraints if they exist to ensure we link to the CURRENT tables
    -- (If tables were recreated, old constraints might be dangling or gone)
    
    -- Link to tours
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tour_destinations_tour_id_fkey'
    ) THEN
        ALTER TABLE tour_destinations DROP CONSTRAINT tour_destinations_tour_id_fkey;
    END IF;

    -- Link to destinations
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'tour_destinations_destination_id_fkey'
    ) THEN
        ALTER TABLE tour_destinations DROP CONSTRAINT tour_destinations_destination_id_fkey;
    END IF;

    -- 3. Add foreign keys back
    ALTER TABLE tour_destinations
    ADD CONSTRAINT tour_destinations_tour_id_fkey
    FOREIGN KEY (tour_id) REFERENCES tours(id) ON DELETE CASCADE;

    ALTER TABLE tour_destinations
    ADD CONSTRAINT tour_destinations_destination_id_fkey
    FOREIGN KEY (destination_id) REFERENCES destinations(id) ON DELETE CASCADE;

END $$;

-- 4. Notify PostgREST to reload schema cache
NOTIFY pgrst, 'reload schema';
