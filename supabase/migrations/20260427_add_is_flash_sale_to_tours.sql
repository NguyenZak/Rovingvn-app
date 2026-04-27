-- Add is_flash_sale column to tours table
ALTER TABLE public.tours ADD COLUMN IF NOT EXISTS is_flash_sale BOOLEAN DEFAULT false;

-- Create an index for faster querying on the homepage
CREATE INDEX IF NOT EXISTS idx_tours_is_flash_sale ON public.tours(is_flash_sale);
