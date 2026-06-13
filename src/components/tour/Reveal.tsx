import { useEffect, useRef, type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function Reveal({ children, className = "", style = {}, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transitionDelay = `${delay}s`;
    // If the element is already in the viewport on mount (common for
    // content that loads asynchronously into an already-scrolled section),
    // reveal immediately so we don't get stuck at opacity:0 when the
    // IntersectionObserver evaluates an empty/zero-height wrapper.
    const reveal = () => {
      el.classList.add("visible");
    };
    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight || document.documentElement.clientHeight;
    if (rect.top < vh && rect.bottom > 0) {
      reveal();
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < (window.innerHeight || 0)) {
          reveal();
          obs.unobserve(el);
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );
    obs.observe(el);
    // Safety net: if content loads asynchronously and the observer never
    // reports intersection (e.g. wrapper was 0×0 at first evaluation),
    // force-reveal after a short delay so users always see the content.
    const fallback = window.setTimeout(reveal, 1500);
    return () => { obs.disconnect(); window.clearTimeout(fallback); };
  }, [delay]);
  return <div ref={ref} className={`reveal ${className}`} style={style}>{children}</div>;
}