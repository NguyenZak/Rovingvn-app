-- Seed data for regions (restoring original content)
INSERT INTO regions (name, description, details, image_url, color, link, display_order)
VALUES 
(
    'Northern Vietnam', 
    'Hanoi, Sapa, Ha Long Bay', 
    'Majestic mountains, rice terraces, and the capital''s ancient charm.', 
    'https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=1200', 
    'from-emerald-900', 
    '/tours?region=North',
    1
),
(
    'Central Vietnam', 
    'Hue, Da Nang, Hoi An', 
    'Heritage sites, stunning caves, and beautiful beaches.', 
    'https://images.unsplash.com/photo-1565063670637-238478d15443?q=80&w=1200', 
    'from-amber-900', 
    '/tours?region=Central',
    2
),
(
    'Southern Vietnam', 
    'Ho Chi Minh City, Mekong Delta', 
    'Vibrant city life, floating markets, and tropical islands.', 
    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?q=80&w=1200', 
    'from-blue-900', 
    '/tours?region=South',
    3
);
