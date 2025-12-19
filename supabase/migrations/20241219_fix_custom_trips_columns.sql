-- Ensure custom_trips table has all required columns and reload schema cache
-- This fixes the "Could not find the 'additional_notes' column" error

-- First, check if the column exists and add it if missing
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custom_trips' 
        AND column_name = 'additional_notes'
    ) THEN
        ALTER TABLE custom_trips ADD COLUMN additional_notes TEXT;
    END IF;
    
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'custom_trips' 
        AND column_name = 'admin_notes'
    ) THEN
        ALTER TABLE custom_trips ADD COLUMN admin_notes TEXT;
    END IF;
END $$;

-- Force PostgREST to reload the schema cache
NOTIFY pgrst, 'reload schema';

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'custom_trips' 
ORDER BY ordinal_position;
