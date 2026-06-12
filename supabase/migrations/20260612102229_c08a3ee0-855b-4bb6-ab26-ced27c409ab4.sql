CREATE OR REPLACE FUNCTION public.create_custom_quote_request(
  _first_name text,
  _last_name text,
  _email text,
  _phone text DEFAULT NULL,
  _nationality text DEFAULT NULL,
  _num_guests integer DEFAULT NULL,
  _num_days integer DEFAULT NULL,
  _destinations text[] DEFAULT NULL,
  _destination_slug text DEFAULT NULL,
  _start_tour_date_id uuid DEFAULT NULL,
  _extras_slugs text[] DEFAULT NULL,
  _budget text DEFAULT NULL,
  _notes text DEFAULT NULL,
  _total_amount numeric DEFAULT NULL,
  _deposit_amount numeric DEFAULT NULL,
  _currency text DEFAULT 'EUR',
  _payload jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF char_length(COALESCE(_first_name, '')) < 1 OR char_length(COALESCE(_first_name, '')) > 100 THEN
    RAISE EXCEPTION 'invalid first_name';
  END IF;
  IF char_length(COALESCE(_last_name, '')) < 1 OR char_length(COALESCE(_last_name, '')) > 100 THEN
    RAISE EXCEPTION 'invalid last_name';
  END IF;
  IF char_length(COALESCE(_email, '')) < 3 OR char_length(COALESCE(_email, '')) > 320
     OR _email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'invalid email';
  END IF;
  IF char_length(COALESCE(_notes, '')) > 5000 THEN
    RAISE EXCEPTION 'notes too long';
  END IF;

  INSERT INTO public.tour_custom_quote_requests(
    first_name, last_name, email, phone, nationality,
    num_guests, num_days, destinations, destination_slug,
    start_tour_date_id, extras_slugs, budget, notes,
    total_amount, deposit_amount, currency, status, payload
  ) VALUES (
    _first_name, _last_name, _email, _phone, _nationality,
    _num_guests, _num_days,
    COALESCE(_destinations, '{}'::text[]),
    _destination_slug,
    _start_tour_date_id,
    COALESCE(_extras_slugs, '{}'::text[]),
    _budget, _notes,
    _total_amount, _deposit_amount,
    COALESCE(_currency, 'EUR'),
    'new',
    COALESCE(_payload, '{}'::jsonb)
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;