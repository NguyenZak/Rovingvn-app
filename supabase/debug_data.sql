-- Check PUBLISHED destinations
SELECT count(*) as published_destinations FROM destinations WHERE status = 'published';
SELECT id, name, status FROM destinations WHERE status = 'published' LIMIT 5;

-- Check PUBLISHED tours
SELECT count(*) as published_tours FROM tours WHERE status = 'published';
SELECT id, title, status FROM tours WHERE status = 'published' LIMIT 5;
