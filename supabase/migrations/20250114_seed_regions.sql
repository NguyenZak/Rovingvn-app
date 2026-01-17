-- Seed data for regions (restoring original content)
INSERT INTO regions (name, slug, description, details, image_url, color, link, display_order)
VALUES 
(
    'Northern Vietnam',
    'northern-vietnam',
    'Hanoi, Sapa, Ha Long Bay', 
    'Majestic mountains, rice terraces, and the capital''s ancient charm.', 
    'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200', 
    'from-emerald-900', 
    '/regions/northern-vietnam',
    1
),
(
    'Central Vietnam',
    'central-vietnam',
    'Hue, Da Nang, Hoi An', 
    'Heritage sites, stunning caves, and beautiful beaches.', 
    'https://images.unsplash.com/photo-1565063670637-238478d15443?q=80&w=1200', 
    'from-amber-900', 
    '/regions/central-vietnam',
    2
),
(
    'Southern Vietnam',
    'southern-vietnam',
    'Ho Chi Minh City, Mekong Delta', 
    'Vibrant city life, floating markets, and tropical islands.', 
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200', 
    'from-blue-900', 
    '/regions/southern-vietnam',
    3
);
