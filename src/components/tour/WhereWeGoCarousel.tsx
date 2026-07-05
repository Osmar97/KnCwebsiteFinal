import { useEffect, useRef, useState, useCallback } from "react";
import type { WhereWeGoCard } from "@/data/whereWeGo";
import type { Language } from "@/pages/TourTranslations";

function pickField(card: WhereWeGoCard, base: "country_name" | "subtitle" | "description", lang: Language): string {
  const key = `${base}_${lang}` as keyof WhereWeGoCard;
  const fallback = `${base}_en` as keyof WhereWeGoCard;
  const value = (card[key] as string | null) || (card[fallback] as string | null);
  return (value ?? "").toString();
}

interface Props {
  cards: WhereWeGoCard[];
  lang: Language;
  emptyLabel: string;
  loading: boolean;
}

const SPEED_PX_PER_SEC = 40;

export function WhereWeGoCarousel({ cards, lang, emptyLabel, loading }: Props) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const halfWidthRef = useRef(0);
  const pausedRef = useRef(false);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragStartOffsetRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mql.matches);
    update();
    mql.addEventListener("change", update);
    return () => mql.removeEventListener("change", update);
  }, []);

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || cards.length === 0) return;
    const firstDupCard = track.children[cards.length] as HTMLElement;
    if (firstDupCard) {
      halfWidthRef.current = firstDupCard.offsetLeft;
    } else {
      halfWidthRef.current = track.scrollWidth / 2;
    }
  }, [cards.length]);

  useEffect(() => {
    measure();
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => ro.disconnect();
  }, [measure, cards.length]);

  const applyTransform = () => {
    const track = trackRef.current;
    if (!track) return;
    const half = halfWidthRef.current || 1;
    let x = offsetRef.current % half;
    if (x < 0) x += half;
    offsetRef.current = x;
    track.style.transform = `translate3d(${-x}px, 0, 0)`;
  };

  useEffect(() => {
    const step = (ts: number) => {
      if (lastTsRef.current == null) lastTsRef.current = ts;
      const dt = (ts - lastTsRef.current) / 1000;
      lastTsRef.current = ts;
      if (!pausedRef.current && !draggingRef.current && !reducedMotion && halfWidthRef.current > 0) {
        offsetRef.current += SPEED_PX_PER_SEC * dt;
        applyTransform();
      }
      rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = null;
    };
  }, [reducedMotion]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartOffsetRef.current = offsetRef.current;
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    offsetRef.current = dragStartOffsetRef.current - dx;
    applyTransform();
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    try { (e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId); } catch {}
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const half = halfWidthRef.current || 0;
    if (e.key === "ArrowRight") {
      offsetRef.current += 240;
      applyTransform();
    } else if (e.key === "ArrowLeft") {
      offsetRef.current -= 240;
      if (offsetRef.current < 0) offsetRef.current += half;
      applyTransform();
    }
  };

  if (!loading && cards.length === 0) {
    return <p style={{ opacity: 0.6 }}>{emptyLabel}</p>;
  }

  // Duplicate cards for seamless loop
  const doubled = cards.length > 0 ? [...cards, ...cards] : [];

  return (
    <div
      ref={viewportRef}
      className="wwg-viewport"
      role="region"
      aria-label="Destinations carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onMouseEnter={() => { pausedRef.current = true; }}
      onMouseLeave={() => { pausedRef.current = false; }}
      onFocus={() => { pausedRef.current = true; }}
      onBlur={() => { pausedRef.current = false; }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onKeyDown={onKeyDown}
    >
      <div ref={trackRef} className="wwg-track">
        {doubled.map((c, i) => {
          const country = pickField(c, "country_name", lang);
          const subtitle = pickField(c, "subtitle", lang);
          const description = pickField(c, "description", lang);
          return (
            <article
              key={`${c.id ?? country}-${i}`}
              className="wwg-card"
              aria-label={country}
            >
              <div className="wwg-imgwrap">
                {c.image_url ? (
                  <img
                    src={c.image_url}
                    alt={country}
                    loading="lazy"
                    draggable={false}
                    className="wwg-img"
                  />
                ) : (
                  <div className="wwg-img wwg-img-fallback" />
                )}
              </div>
              <div className="wwg-ov" />
              <div className="wwg-cnt">
                <div className="wwg-ctry">{country}</div>
                <div className="wwg-name">{country}</div>
                <div className="wwg-detail">{subtitle || description}</div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}