-- Add highlight images to site_settings
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS highlight_image_1 text DEFAULT 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=600',
ADD COLUMN IF NOT EXISTS highlight_image_2 text DEFAULT 'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=600',
ADD COLUMN IF NOT EXISTS highlight_image_3 text DEFAULT 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=600',
ADD COLUMN IF NOT EXISTS highlight_image_4 text DEFAULT 'https://images.unsplash.com/photo-1504214208698-ea1916a2195a?q=80&w=600';
