-- ============================================
-- Bookings Management Database Schema
-- ============================================

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Relations
  tour_id UUID REFERENCES tours(id),
  user_id UUID REFERENCES auth.users(id), -- Nullable for guest bookings
  
  -- Customer Info (Snapshot for history or guest info)
  customer_info JSONB NOT NULL DEFAULT '{}'::jsonb, 
  -- Expected structure: { name, email, phone, address, nation }
  
  -- Trip Details
  travel_date DATE NOT NULL,
  adults INTEGER DEFAULT 1,
  children INTEGER DEFAULT 0,
  infants INTEGER DEFAULT 0,
  
  -- Financials
  total_price DECIMAL(12, 2) NOT NULL DEFAULT 0,
  currency VARCHAR(10) DEFAULT 'VND',
  
  payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, partial, refunded
  payment_method VARCHAR(50),
  
  -- Booking Workflow
  status VARCHAR(20) DEFAULT 'pending', -- pending, confirmed, cancelled, completed
  special_requests TEXT,
  admin_notes TEXT,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  booking_code VARCHAR(20) UNIQUE -- Friendly ID e.g., BK-2024-001
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_tour ON bookings(tour_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_bookings_updated_at();

-- Function to generate booking code
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.booking_code IS NULL THEN
    NEW.booking_code := 'BK-' || to_char(NOW(), 'YYMM') || '-' || substring(md5(random()::text) from 1 for 4);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_booking_code
  BEFORE INSERT ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION generate_booking_code();

-- RLS Policies
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Users can view their own bookings
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  USING (auth.uid() = user_id);

-- Admins/Editors see all
CREATE POLICY "Staff can view all bookings"
  ON bookings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Staff can update bookings
CREATE POLICY "Staff can update bookings"
  ON bookings FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON ur.role_id = r.id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'editor')
    )
  );

-- Public/Guests can insert (for booking form)
-- Note: Ideally we use a server action or edge function with service key for public usage,
-- or allow anon insert but restrictive select.
CREATE POLICY "Anyone can create booking"
  ON bookings FOR INSERT
  WITH CHECK (true);

-- Seed Data
INSERT INTO bookings (
  tour_id, customer_info, travel_date, adults, total_price, status, booking_code
) VALUES 
(
  (SELECT id FROM tours LIMIT 1),
  '{"name": "John Doe", "email": "john@example.com", "phone": "+123456789"}'::jsonb,
  NOW() + INTERVAL '1 month',
  2,
  5000000,
  'pending',
  'BK-TEST-001'
),
(
  (SELECT id FROM tours LIMIT 1),
  '{"name": "Alice Smith", "email": "alice@example.com", "phone": "+987654321"}'::jsonb,
  NOW() + INTERVAL '2 weeks',
  1,
  2500000,
  'confirmed',
  'BK-TEST-002'
)
ON CONFLICT DO NOTHING;
