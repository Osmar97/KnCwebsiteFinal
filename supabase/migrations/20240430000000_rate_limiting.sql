-- 
-- LIGHTWEIGHT DATABASE-LEVEL RATE LIMITING
-- tracks requests per user/IP using a simple table.
--

CREATE TABLE IF NOT EXISTS public.rate_limits (
    identifier TEXT PRIMARY KEY,
    request_count INTEGER DEFAULT 1,
    last_request_at TIMESTAMPTZ DEFAULT NOW(),
    reset_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 minute')
);

-- Function to check and increment rate limit
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_limit INTEGER DEFAULT 100
) RETURNS TABLE (
    success BOOLEAN,
    remaining INTEGER,
    reset_at TIMESTAMPTZ
) LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_now TIMESTAMPTZ := NOW();
    v_record RECORD;
BEGIN
    -- Cleanup old records occasionally (optional, or use a cron job)
    -- DELETE FROM public.rate_limits WHERE reset_at < v_now;

    INSERT INTO public.rate_limits (identifier, reset_at)
    VALUES (p_identifier, v_now + INTERVAL '1 minute')
    ON CONFLICT (identifier) DO UPDATE
    SET 
        request_count = CASE 
            WHEN rate_limits.reset_at < v_now THEN 1 
            ELSE rate_limits.request_count + 1 
        END,
        reset_at = CASE 
            WHEN rate_limits.reset_at < v_now THEN v_now + INTERVAL '1 minute' 
            ELSE rate_limits.reset_at 
        END,
        last_request_at = v_now
    RETURNING * INTO v_record;

    IF v_record.request_count > p_limit THEN
        RETURN QUERY SELECT FALSE, 0, v_record.reset_at;
    ELSE
        RETURN QUERY SELECT TRUE, p_limit - v_record.request_count, v_record.reset_at;
    END IF;
END;
$$;
