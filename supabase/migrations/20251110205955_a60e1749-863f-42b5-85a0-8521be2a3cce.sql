-- Add floor_plans column to properties table for storing multiple floor plan PDFs
ALTER TABLE properties 
ADD COLUMN IF NOT EXISTS floor_plans text[] DEFAULT '{}';

COMMENT ON COLUMN properties.floor_plans IS 'Array of URLs for floor plan PDF files';