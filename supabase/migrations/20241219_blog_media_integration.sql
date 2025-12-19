-- Add media library integration to blog_posts table
-- This adds cover_image_id and thumbnail_id foreign keys to the media table
-- Keeps featured_image URL as fallback for backward compatibility

-- Add foreign key columns
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS cover_image_id UUID REFERENCES media(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS thumbnail_id UUID REFERENCES media(id) ON DELETE SET NULL;

-- Rename featured_image to cover_image for consistency (optional, keeps old column as fallback)
-- We'll keep both for now to avoid breaking changes
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS cover_image TEXT;

-- Copy data from featured_image to cover_image if it exists
UPDATE blog_posts 
SET cover_image = featured_image 
WHERE cover_image IS NULL AND featured_image IS NOT NULL;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blog_cover_image ON blog_posts(cover_image_id);
CREATE INDEX IF NOT EXISTS idx_blog_thumbnail ON blog_posts(thumbnail_id);

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name IN ('cover_image_id', 'thumbnail_id', 'cover_image', 'featured_image')
ORDER BY ordinal_position;
