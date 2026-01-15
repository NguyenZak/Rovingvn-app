-- Create regions table
CREATE TABLE IF NOT EXISTS regions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT, -- e.g., "Hanoi, Sapa, Ha Long Bay"
  details TEXT, -- e.g., "Majestic mountains..."
  image_url TEXT,
  color VARCHAR(50) DEFAULT 'from-emerald-900', -- CSS class for gradient
  link VARCHAR(255), -- URL to navigate to
  display_order INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read regions"
  ON regions FOR SELECT
  USING (true);

-- Admin manage
CREATE POLICY "Admin manage regions"
  ON regions FOR ALL
  USING (
    EXISTS (
        SELECT 1 FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
        AND r.name IN ('admin', 'editor')
    )
  );
