
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'destinations';

SELECT id, name, featured_image, gallery_images
FROM destinations
WHERE name ILIKE '%Noi Bai%' OR name ILIKE '%Nội Bài%';
