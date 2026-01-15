-- Add Stats columns to site_settings table
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS stat_travelers integer DEFAULT 10000,
ADD COLUMN IF NOT EXISTS stat_tours integer DEFAULT 500,
ADD COLUMN IF NOT EXISTS stat_destinations integer DEFAULT 30,
ADD COLUMN IF NOT EXISTS stat_years integer DEFAULT 10;
