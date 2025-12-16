-- Create tour_destinations junction table
CREATE TABLE IF NOT EXISTS tour_destinations (
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    destination_id UUID REFERENCES destinations(id) ON DELETE CASCADE,
    PRIMARY KEY (tour_id, destination_id)
);

-- Migrate existing relationships from the single destination_id column
INSERT INTO tour_destinations (tour_id, destination_id)
SELECT id, destination_id 
FROM tours 
WHERE destination_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tour_destinations_tour_id ON tour_destinations(tour_id);
CREATE INDEX IF NOT EXISTS idx_tour_destinations_destination_id ON tour_destinations(destination_id);

-- Enable Row Level Security
ALTER TABLE tour_destinations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Public can view
CREATE POLICY "Public can view tour_destinations"
    ON tour_destinations FOR SELECT
    USING (true);

-- Admins/Editors can manage
CREATE POLICY "Editors can manage tour_destinations"
    ON tour_destinations FOR ALL
    USING (is_editor_or_admin(auth.uid()));
