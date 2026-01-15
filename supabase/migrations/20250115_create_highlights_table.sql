-- Create highlights table
CREATE TABLE IF NOT EXISTS public.highlights (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    title text NOT NULL,
    description text,
    icon text NOT NULL, -- Lucide icon name
    color text DEFAULT 'text-emerald-500', -- Tailwind class
    bg text DEFAULT 'bg-emerald-50', -- Tailwind class
    display_order integer DEFAULT 0,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.highlights ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access"
ON public.highlights
FOR SELECT
TO public
USING (true);

CREATE POLICY "Admin full access"
ON public.highlights
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Seed initial data matching hardcoded values
INSERT INTO public.highlights (title, description, icon, color, bg, display_order)
VALUES 
    ('Culinary Delights', 'Taste the world-famous Pho, Banh Mi, and vibrant street food culture.', 'Utensils', 'text-orange-500', 'bg-orange-50', 1),
    ('Ancient History', 'Walk through thousands of years of history in hue, Hoi An, and Hanoi.', 'Building2', 'text-red-500', 'bg-red-50', 2),
    ('Natural Wonders', 'Cruise Halong Bay, trek Sapa, or relax on Phu Quoc beaches.', 'Palmtree', 'text-green-500', 'bg-green-50', 3),
    ('Local Life', 'Meet friendly locals and experience authentic village lifestyle.', 'Users', 'text-blue-500', 'bg-blue-50', 4);
