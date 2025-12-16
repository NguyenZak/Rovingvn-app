-- ============================================
-- Sliders Table Schema
-- For homepage carousel/banner management
-- ============================================

-- Enable UUID extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Sliders table
CREATE TABLE IF NOT EXISTS sliders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  subtitle TEXT,
  description TEXT,
  image_id UUID REFERENCES media(id) ON DELETE SET NULL,
  link VARCHAR(500),
  button_text VARCHAR(100),
  display_order INTEGER NOT NULL DEFAULT 0,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for sliders
CREATE INDEX IF NOT EXISTS idx_sliders_status ON sliders(status);
CREATE INDEX IF NOT EXISTS idx_sliders_order ON sliders(display_order);
CREATE INDEX IF NOT EXISTS idx_sliders_dates ON sliders(start_date, end_date);

-- Auto-update timestamp trigger
CREATE TRIGGER update_sliders_timestamp
  BEFORE UPDATE ON sliders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Audit log trigger
CREATE TRIGGER audit_sliders_trigger
  AFTER INSERT OR UPDATE OR DELETE ON sliders
  FOR EACH ROW
  EXECUTE FUNCTION audit_log();

-- ============================================
-- RLS POLICIES FOR SLIDERS
-- ============================================

ALTER TABLE sliders ENABLE ROW LEVEL SECURITY;

-- Everyone can view active sliders
CREATE POLICY "sliders_select_policy" ON sliders
  FOR SELECT
  USING (
    status = 'active' OR
    is_editor_or_admin(auth.uid())
  );

-- Editors and admins can create sliders
CREATE POLICY "sliders_insert_policy" ON sliders
  FOR INSERT
  WITH CHECK (is_editor_or_admin(auth.uid()));

-- Editors and admins can update sliders
CREATE POLICY "sliders_update_policy" ON sliders
  FOR UPDATE
  USING (is_editor_or_admin(auth.uid()));

-- Only admins can delete sliders
CREATE POLICY "sliders_delete_policy" ON sliders
  FOR DELETE
  USING (is_admin(auth.uid()));

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE sliders IS 'Homepage sliders/banners';
COMMENT ON COLUMN sliders.display_order IS 'Order of display (lower = first)';
COMMENT ON COLUMN sliders.start_date IS 'Optional: slider active from this date';
COMMENT ON COLUMN sliders.end_date IS 'Optional: slider active until this date';
