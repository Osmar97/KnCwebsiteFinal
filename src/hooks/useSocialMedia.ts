import { useEffect, useState } from "react";
import { fetchIgImagesPublic, fetchSocialLinks, type IgImage, type SocialLinks } from "@/data/socialMedia";

export function useSocialMedia() {
  const [links, setLinks] = useState<SocialLinks | null>(null);
  const [images, setImages] = useState<IgImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const [l, i] = await Promise.all([fetchSocialLinks(), fetchIgImagesPublic()]);
        if (!mounted) return;
        setLinks(l);
        setImages(i);
      } catch (err) {
        console.error("useSocialMedia load failed", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return { links, images, loading };
}