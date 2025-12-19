-- Create general_inquiries table for "Start Your Journey" contact form
-- This table stores simple contact inquiries from the homepage

CREATE TABLE IF NOT EXISTS general_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    number_of_people INTEGER NOT NULL DEFAULT 1,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'archived')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_general_inquiries_status ON general_inquiries(status);
CREATE INDEX idx_general_inquiries_created_at ON general_inquiries(created_at DESC);
CREATE INDEX idx_general_inquiries_email ON general_inquiries(email);

-- Enable RLS
ALTER TABLE general_inquiries ENABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON TABLE general_inquiries TO anon;
GRANT ALL ON TABLE general_inquiries TO authenticated;
GRANT ALL ON TABLE general_inquiries TO service_role;

-- RLS Policies
-- Allow anyone to submit inquiries
CREATE POLICY "Anyone can submit general inquiries"
    ON general_inquiries
    FOR INSERT
    WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view all general inquiries"
    ON general_inquiries
    FOR SELECT
    TO authenticated
    USING (is_admin(auth.uid()));

-- Only admins can update inquiries
CREATE POLICY "Admins can update general inquiries"
    ON general_inquiries
    FOR UPDATE
    TO authenticated
    USING (is_admin(auth.uid()))
    WITH CHECK (is_admin(auth.uid()));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete general inquiries"
    ON general_inquiries
    FOR DELETE
    TO authenticated
    USING (is_admin(auth.uid()));

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION update_general_inquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER general_inquiries_updated_at
    BEFORE UPDATE ON general_inquiries
    FOR EACH ROW
    EXECUTE FUNCTION update_general_inquiries_updated_at();

-- Force schema reload
NOTIFY pgrst, 'reload schema';

-- Add comment
COMMENT ON TABLE general_inquiries IS 'General contact inquiries from the homepage "Start Your Journey" form';
