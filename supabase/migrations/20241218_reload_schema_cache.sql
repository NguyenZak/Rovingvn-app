-- Reload the schema cache for PostgREST
NOTIFY pgrst, 'reload config';

-- Verify the column exists (just in case)
-- ALTER TABLE custom_trips ADD COLUMN IF NOT EXISTS additional_notes TEXT;
