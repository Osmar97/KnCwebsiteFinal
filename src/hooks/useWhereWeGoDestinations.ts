import { useEffect, useState } from "react";
import { fetchPublicWhereWeGoDestinations } from "@/data/privateTour";
import { logger } from "@/lib/logger";

export interface WhereWeGoDestination {
  id: string;
  slug: string;
  flag: string | null;
  label_en: string;
  label_pt: string | null;
  label_fr: string | null;
  desc_en: string | null;
  desc_pt: string | null;
  desc_fr: string | null;
  region: string | null;
  card_image_url: string | null;
  hero_image_url: string | null;
  sort_order: number;
}

export function useWhereWeGoDestinations() {
  const [destinations, setDestinations] = useState<WhereWeGoDestination[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const rows = await fetchPublicWhereWeGoDestinations();
        if (!cancelled) setDestinations(rows as WhereWeGoDestination[]);
      } catch (err) {
        logger.error("Failed to load where-we-go destinations", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return { destinations, loading };
}