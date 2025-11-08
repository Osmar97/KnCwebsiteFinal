-- Add apartment-specific fields to properties table
ALTER TABLE public.properties 
ADD COLUMN IF NOT EXISTS floor TEXT,
ADD COLUMN IF NOT EXISTS is_top_floor BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS penthouse BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS t0 BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS duplex BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS agent_captador TEXT,
ADD COLUMN IF NOT EXISTS agent_comercializador TEXT;

-- Add comment to describe the columns
COMMENT ON COLUMN public.properties.floor IS 'Floor number for apartments (e.g., "ground", "1", "2", etc.)';
COMMENT ON COLUMN public.properties.is_top_floor IS 'Indicates if apartment is on the top floor of the building';
COMMENT ON COLUMN public.properties.penthouse IS 'Indicates if apartment is a penthouse';
COMMENT ON COLUMN public.properties.t0 IS 'Indicates if apartment is a T0 (studio)';
COMMENT ON COLUMN public.properties.duplex IS 'Indicates if apartment is a duplex';
COMMENT ON COLUMN public.properties.agent_captador IS 'Agent who acquired the property';
COMMENT ON COLUMN public.properties.agent_comercializador IS 'Agent responsible for selling/renting the property';