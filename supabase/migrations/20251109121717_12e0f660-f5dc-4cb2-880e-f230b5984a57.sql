-- Add descriptions JSONB column to store multi-language descriptions
ALTER TABLE properties 
ADD COLUMN descriptions jsonb DEFAULT '{}'::jsonb;

-- Migrate existing description data to the new format
UPDATE properties 
SET descriptions = jsonb_build_object('pt', description)
WHERE description IS NOT NULL AND description != '';

-- Add index for better performance on JSONB queries
CREATE INDEX idx_properties_descriptions ON properties USING gin(descriptions);