-- Restore Foreign Key between bookings and tours
-- The previous 'DROP TABLE tours CASCADE' removed the FK from bookings.
-- We must re-establish it for the 'select(*, tour:tours(...))' query to work.

DO $$
BEGIN
    -- Check if constraint already exists to avoid error
    IF NOT EXISTS (
        SELECT 1
        FROM information_schema.table_constraints
        WHERE constraint_name = 'bookings_tour_id_fkey'
        AND table_name = 'bookings'
    ) THEN
        ALTER TABLE bookings
        ADD CONSTRAINT bookings_tour_id_fkey
        FOREIGN KEY (tour_id)
        REFERENCES tours(id)
        ON DELETE SET NULL;
    END IF;
END $$;

-- Verify the column type matches regular tours(id) which should be UUID
-- (Both are UUID based on previous files)
