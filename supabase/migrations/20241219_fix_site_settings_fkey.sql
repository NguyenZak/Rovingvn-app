-- Fix site_settings table to remove auth.users foreign key constraint
-- This prevents "permission denied for table users" error

-- Drop the foreign key constraint if it exists
DO $$ 
BEGIN
    -- Drop foreign key constraint on updated_by
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name LIKE '%site_settings%updated_by%'
        AND table_name = 'site_settings'
    ) THEN
        ALTER TABLE site_settings 
        DROP CONSTRAINT IF EXISTS site_settings_updated_by_fkey;
    END IF;
END $$;

-- Change updated_by to TEXT instead of UUID reference
ALTER TABLE site_settings 
ALTER COLUMN updated_by TYPE TEXT;

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name = 'updated_by';
