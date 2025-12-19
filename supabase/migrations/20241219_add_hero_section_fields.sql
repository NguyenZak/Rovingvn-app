-- Add homepage hero section fields to site_settings
ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS hero_title TEXT,
ADD COLUMN IF NOT EXISTS hero_subtitle TEXT,
ADD COLUMN IF NOT EXISTS hero_description TEXT;

-- Add default values
UPDATE site_settings 
SET 
    hero_title = 'Why Vietnam?' WHERE hero_title IS NULL;

UPDATE site_settings 
SET 
    hero_subtitle = 'A Land of Timeless Charm' WHERE hero_subtitle IS NULL;

UPDATE site_settings 
SET 
    hero_description = 'Vietnam is a country of breathtaking natural beauty and unique heritage. From the jagged peaks of the north to the emerald waters of the south, every corner tells a story.' 
WHERE hero_description IS NULL;

-- Force schema reload
NOTIFY pgrst, 'reload schema';
