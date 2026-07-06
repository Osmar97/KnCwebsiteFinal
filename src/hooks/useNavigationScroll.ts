import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

const ROUTES_WITH_TRANSPARENT_NAV: ReadonlySet<string> = new Set(["/", "/services"]);

export const isRouteTransparent = (pathname: string): boolean => {
  if (ROUTES_WITH_TRANSPARENT_NAV.has(pathname)) return true;
  if (pathname.startsWith("/properties/")) return true;
  return false;
};

export const isPropertyRoute = (pathname: string): boolean =>
  pathname === "/properties" || pathname.startsWith("/properties/");

export function useNavigationScroll() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const location = useLocation();

  const isTransparent = isRouteTransparent(location.pathname);
  const isPropertiesPage = isPropertyRoute(location.pathname);

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const lastScrollY = useRef(0);
  const lastDirectionChangeY = useRef(0);
  const scrollDirection = useRef<"up" | "down">("up");
  const ticking = useRef(false);

  // Hero sentinel observer
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let rafId = 0;
    const NAV_HEIGHT = 72;

    const evaluate = (sentinel: HTMLElement) => {
      const rect = sentinel.getBoundingClientRect();
      setScrolled(rect.top <= NAV_HEIGHT);
    };

    const attach = () => {
      const sentinel = document.querySelector<HTMLElement>("[data-hero-sentinel]");
      if (!sentinel) {
        setScrolled(true);
        return;
      }
      evaluate(sentinel);
      observer = new IntersectionObserver(
        ([entry]) => {
          const passedTop =
            !entry.isIntersecting && entry.boundingClientRect.top < NAV_HEIGHT;
          setScrolled(passedTop);
        },
        { rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`, threshold: [0, 1] },
      );
      observer.observe(sentinel);
    };

    rafId = window.requestAnimationFrame(() => {
      attach();
      if (!document.querySelector("[data-hero-sentinel]")) {
        mutationObserver = new MutationObserver(() => {
          if (document.querySelector("[data-hero-sentinel]")) {
            mutationObserver?.disconnect();
            mutationObserver = null;
            attach();
          }
        });
        mutationObserver.observe(document.body, { childList: true, subtree: true });
      }
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [location.pathname]);

  // Reset scrolled state on non-hero pages
  useEffect(() => {
    if (!isTransparent) {
      setScrolled(true);
    }
  }, [isTransparent, location.pathname]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Body scroll lock + focus management for mobile menu
  useEffect(() => {
    if (!mobileOpen) return;

    lastFocusedRef.current = document.activeElement as HTMLElement | null;

    const previousOverflow = document.body.style.overflow;
    const previousPaddingRight = document.body.style.paddingRight;
    const scrollbarGap = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbarGap > 0) {
      document.body.style.paddingRight = `${scrollbarGap}px`;
    }

    const focusTimer = window.setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      firstFocusable?.focus();
    }, 60);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPaddingRight;
      lastFocusedRef.current?.focus?.();
    };
  }, [mobileOpen]);

  // ESC closes mobile menu
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        mobileTriggerRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Smart auto-hide navbar on scroll
  useEffect(() => {
    const HIDE_AFTER = 60;
    const SHOW_AT_TOP = 10;
    const DIR_THRESHOLD = 8;

    const update = () => {
      ticking.current = false;
      const currentScrollY = Math.max(0, window.scrollY);

      if (currentScrollY <= SHOW_AT_TOP) {
        setIsNavHidden(false);
        lastScrollY.current = currentScrollY;
        lastDirectionChangeY.current = currentScrollY;
        scrollDirection.current = "up";
        return;
      }

      const delta = currentScrollY - lastScrollY.current;
      const dir: "up" | "down" =
        delta > 0 ? "down" : delta < 0 ? "up" : scrollDirection.current;

      if (dir !== scrollDirection.current) {
        lastDirectionChangeY.current = currentScrollY;
        scrollDirection.current = dir;
      }

      const distSinceFlip = Math.abs(currentScrollY - lastDirectionChangeY.current);

      if (dir === "down" && currentScrollY > HIDE_AFTER && distSinceFlip > DIR_THRESHOLD) {
        setIsNavHidden(true);
      } else if (dir === "up" && distSinceFlip > DIR_THRESHOLD) {
        setIsNavHidden(false);
      }

      lastScrollY.current = currentScrollY;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    lastScrollY.current = window.scrollY;
    lastDirectionChangeY.current = window.scrollY;
    update();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  return {
    mobileOpen,
    setMobileOpen,
    scrolled,
    isNavHidden,
    isTransparent,
    isPropertiesPage,
    mobileMenuRef,
    mobileTriggerRef,
    mobileCloseRef,
    closeMobile,
    location,
  };
}
