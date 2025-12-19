-- Complete fix for custom_trips schema cache issue
-- This will drop and recreate the table with all columns properly defined

-- 1. Drop existing table and all dependencies
DROP TABLE IF EXISTS custom_trips CASCADE;

-- 2. Recreate custom_trips table with all columns
CREATE TABLE custom_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    destinations JSONB NOT NULL DEFAULT '[]'::jsonb,
    duration_days INTEGER NOT NULL,
    travel_date DATE,
    travel_styles JSONB NOT NULL DEFAULT '[]'::jsonb,
    number_of_travelers INTEGER NOT NULL DEFAULT 1,
    additional_notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'contacted', 'converted', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Create indexes
CREATE INDEX idx_custom_trips_status ON custom_trips(status);
CREATE INDEX idx_custom_trips_created_at ON custom_trips(created_at DESC);
CREATE INDEX idx_custom_trips_email ON custom_trips(customer_email);

-- 4. Enable RLS
ALTER TABLE custom_trips ENABLE ROW LEVEL SECURITY;

-- 5. Grant permissions
GRANT ALL ON TABLE custom_trips TO anon;
GRANT ALL ON TABLE custom_trips TO authenticated;
GRANT ALL ON TABLE custom_trips TO service_role;

-- 6. Create SECURITY DEFINER function for admin check (if not exists)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_roles ur
    JOIN roles r ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid()
    AND r.name IN ('admin', 'super_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Create RLS policies
CREATE POLICY "Anyone can submit custom trip requests"
    ON custom_trips
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view all custom trips"
    ON custom_trips
    FOR SELECT
    TO authenticated
    USING (is_admin());

CREATE POLICY "Admins can update custom trips"
    ON custom_trips
    FOR UPDATE
    TO authenticated
    USING (is_admin())
    WITH CHECK (is_admin());

CREATE POLICY "Admins can delete custom trips"
    ON custom_trips
    FOR DELETE
    TO authenticated
    USING (is_admin());

-- 8. Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_custom_trips_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER custom_trips_updated_at
    BEFORE UPDATE ON custom_trips
    FOR EACH ROW
    EXECUTE FUNCTION update_custom_trips_updated_at();

-- 9. Force schema reload
NOTIFY pgrst, 'reload schema';

-- 10. Add comment
COMMENT ON TABLE custom_trips IS 'Custom trip requests from the public form';
