-- Create custom_trips table for storing custom tour requests
CREATE TABLE IF NOT EXISTS custom_trips (
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

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_custom_trips_status ON custom_trips(status);

-- Create index on created_at for ordering
CREATE INDEX IF NOT EXISTS idx_custom_trips_created_at ON custom_trips(created_at DESC);

-- Enable RLS
ALTER TABLE custom_trips ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (submit a custom trip request)
CREATE POLICY "Anyone can submit custom trip requests"
    ON custom_trips
    FOR INSERT
    TO public
    WITH CHECK (true);

-- Policy: Only admins can view all custom trips
CREATE POLICY "Admins can view all custom trips"
    ON custom_trips
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('admin', 'super_admin')
        )
    );

-- Policy: Only admins can update custom trips
CREATE POLICY "Admins can update custom trips"
    ON custom_trips
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('admin', 'super_admin')
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_roles.user_id = auth.uid()
            AND user_roles.role IN ('admin', 'super_admin')
        )
    );

-- Trigger to auto-update updated_at
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
