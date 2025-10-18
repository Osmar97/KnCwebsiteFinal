-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create properties table
CREATE TABLE public.properties (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- Basic information
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  price DECIMAL(12, 2) NOT NULL,
  
  -- Property type and classification
  transaction_type TEXT NOT NULL DEFAULT 'Comprar',
  property_type TEXT NOT NULL,
  
  -- Size
  private_area DECIMAL(10, 2),
  construction_area DECIMAL(10, 2),
  
  -- Rooms
  bedrooms TEXT,
  bathrooms INTEGER,
  
  -- Condition
  condition TEXT,
  
  -- Features (boolean)
  air_conditioning BOOLEAN DEFAULT false,
  built_in_wardrobes BOOLEAN DEFAULT false,
  elevator BOOLEAN DEFAULT false,
  balcony_terrace BOOLEAN DEFAULT false,
  parking BOOLEAN DEFAULT false,
  garden BOOLEAN DEFAULT false,
  pool BOOLEAN DEFAULT false,
  storage BOOLEAN DEFAULT false,
  adapted_house BOOLEAN DEFAULT false,
  luxury_house BOOLEAN DEFAULT false,
  sea_view BOOLEAN DEFAULT false,
  
  -- Media
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  floor_plan_url TEXT,
  virtual_tour_url TEXT,
  
  -- Additional details
  floor INTEGER,
  total_floors INTEGER,
  divisions JSONB DEFAULT '[]',
  
  -- Status
  status TEXT DEFAULT 'active',
  featured BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Properties are viewable by everyone"
ON public.properties FOR SELECT USING (status = 'active');

CREATE POLICY "Only authenticated admins can create properties"
ON public.properties FOR INSERT WITH CHECK (is_admin_user());

CREATE POLICY "Only authenticated admins can update properties"
ON public.properties FOR UPDATE USING (is_admin_user());

CREATE POLICY "Only authenticated admins can delete properties"
ON public.properties FOR DELETE USING (is_admin_user());

-- Indexes
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_city ON public.properties(city);
CREATE INDEX idx_properties_bedrooms ON public.properties(bedrooms);
CREATE INDEX idx_properties_transaction_type ON public.properties(transaction_type);

-- Trigger
CREATE TRIGGER update_properties_updated_at
BEFORE UPDATE ON public.properties
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();