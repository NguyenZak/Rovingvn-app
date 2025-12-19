-- Add subject column to general_inquiries table
ALTER TABLE general_inquiries 
ADD COLUMN IF NOT EXISTS subject TEXT;

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify column was added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'general_inquiries' 
ORDER BY ordinal_position;
