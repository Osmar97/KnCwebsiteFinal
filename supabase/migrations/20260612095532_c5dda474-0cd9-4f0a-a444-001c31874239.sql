UPDATE public.tour_custom_quote_requests
SET extras_slugs = services
WHERE (extras_slugs = '{}' OR extras_slugs IS NULL) AND services IS NOT NULL AND services <> '{}';

ALTER TABLE public.tour_custom_quote_requests DROP COLUMN services;