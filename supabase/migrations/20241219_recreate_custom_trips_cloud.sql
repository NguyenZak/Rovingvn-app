-- Complete recreation of custom_trips table for Supabase Cloud
-- Run this in Supabase Dashboard SQL Editor

-- Drop existing table if any
DROP TABLE IF EXISTS custom_trips CASCADE;

-- Create custom_trips table with all required columns
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

-- Create indexes
CREATE INDEX idx_custom_trips_status ON custom_trips(status);
CREATE INDEX idx_custom_trips_created_at ON custom_trips(created_at DESC);
CREATE INDEX idx_custom_trips_email ON custom_trips(customer_email);

-- Enable RLS
ALTER TABLE custom_trips ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE custom_trips TO anon;
GRANT ALL ON TABLE custom_trips TO authenticated;
GRANT ALL ON TABLE custom_trips TO service_role;

-- Create RLS policies
CREATE POLICY "Anyone can submit custom trip requests"
    ON custom_trips
    FOR INSERT
    TO public
    WITH CHECK (true);

CREATE POLICY "Admins can view all custom trips"
    ON custom_trips
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

CREATE POLICY "Admins can update custom trips"
    ON custom_trips
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can delete custom trips"
    ON custom_trips
    FOR DELETE
    TO authenticated
    USING (is_admin(auth.uid()));

-- Create trigger for updated_at
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

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Verify table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'custom_trips' 
ORDER BY ordinal_position;
