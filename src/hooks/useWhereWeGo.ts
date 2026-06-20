import { useEffect, useState } from "react";
import { fetchWhereWeGoPublic, type WhereWeGoCard } from "@/data/whereWeGo";

export function useWhereWeGo() {
  const [cards, setCards] = useState<WhereWeGoCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchWhereWeGoPublic()
      .then((data) => { if (mounted) setCards(data); })
      .catch(() => { if (mounted) setCards([]); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return { cards, loading };
}