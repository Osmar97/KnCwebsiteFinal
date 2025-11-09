-- Add missing property fields for detailed property information

-- Address details
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS street_number TEXT,
ADD COLUMN IF NOT EXISTS no_street_number BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS block TEXT,
ADD COLUMN IF NOT EXISTS door TEXT,
ADD COLUMN IF NOT EXISTS urbanization_name TEXT;

-- Operation types (for rent and sale options)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS operation_sale BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS operation_rent BOOLEAN DEFAULT false;

-- Building information
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS building_year INTEGER,
ADD COLUMN IF NOT EXISTS heating_type TEXT,
ADD COLUMN IF NOT EXISTS energy_class TEXT,
ADD COLUMN IF NOT EXISTS lot_area NUMERIC;

-- Orientation (solar exposure)
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS orientation_north BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation_south BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation_east BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS orientation_west BOOLEAN DEFAULT false;

-- Internal reference and notes for admin use
ALTER TABLE public.properties
ADD COLUMN IF NOT EXISTS internal_reference TEXT,
ADD COLUMN IF NOT EXISTS private_notes TEXT,
ADD COLUMN IF NOT EXISTS notes_visibility TEXT;