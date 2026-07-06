import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useAdmin } from "@/contexts/AdminContext";

type NavItem = { name: string; href: string };

const PRIMARY_NAV: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Tours", href: "/POT" },
  { name: "Our Approach", href: "/our-approach" },
  { name: "Contact", href: "/contact" },
];

interface NavLinkProps {
  to: string;
  onNavigate?: () => void;
  className?: string;
  activeClassName?: string;
  variant?: "desktop" | "mobile";
  children: React.ReactNode;
}

const NavLinkItem = ({
  to,
  onNavigate,
  className,
  activeClassName,
  variant = "desktop",
  children,
}: NavLinkProps) => {
  const desktopBase =
    "text-xs lg:text-[13px]";
  const mobileBase =
    "min-h-[44px] py-3 text-base tracking-[0.18em] text-white/90";

  return (
    <NavLink
      to={to}
      end={to === "/"}
      onClick={onNavigate}
      data-variant={variant}
      className={({ isActive }) =>
        cn(
          "knc-navbar-link knc-focus-ring",
          variant === "desktop" && desktopBase,
          variant === "mobile" && mobileBase,
          isActive && (activeClassName ?? "text-gold"),
          className,
        )
      }
    >
      {({ isActive }) => (
        <span
          data-active={isActive ? "true" : "false"}
          className="knc-navbar-link__inner inline-flex items-center"
        >
          {children}
        </span>
      )}
    </NavLink>
  );
};

export const Navigation = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAdminLoggedIn } = useAdmin();
  const mobileId = useId();

  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement | null>(null);
  const mobileCloseRef = useRef<HTMLButtonElement | null>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Simple scroll listener — drives height shrink + shadow after 16px.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Body scroll lock + focus management for mobile menu.
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

    // Focus the first interactive element inside the menu after open.
    const focusTimer = window.setTimeout(() => {
      const firstFocusable = mobileMenuRef.current?.querySelector<HTMLElement>(
        'a[href], button:not([disabled])',
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

  // ESC closes the mobile menu.
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

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  // Unified premium dark navbar across every public page.
  const navbarBg = scrolled
    ? "bg-black/85 backdrop-blur-xl backdrop-saturate-150 border-b border-white/10"
    : "bg-black/60 backdrop-blur-lg backdrop-saturate-150 border-b border-white/5";

  const textColor = "text-white/90";
  const logoTextColor = "text-gold";
  const subtitleColor = "text-white/50";
  const navHeight = scrolled ? 60 : 72;

  return (
    <>
      <header
        className="knc-navbar fixed inset-x-0 top-0 z-50 will-change-transform transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{ height: `${navHeight}px` }}
      >
        <nav
          aria-label="Primary"
          className={cn(
            "h-full w-full transition-[background-color,backdrop-filter,border-color,box-shadow] duration-[420ms]",
            "ease-[cubic-bezier(0.22,1,0.36,1)]",
            navbarBg,
            scrolled && "shadow-[0_8px_30px_rgba(0,0,0,0.18)]",
          )}
        >
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link
              to="/"
              className="knc-focus-ring group flex items-center gap-3"
              aria-label="Kings 'n Company — Home"
            >
              <span className="relative">
                <img
                  src={logo}
                  alt=""
                  aria-hidden
                  className="h-9 w-9 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_10px_rgba(160,143,102,0.55)] transition-transform duration-500 ease-out group-hover:scale-105"
                />
              </span>
              <span className="hidden sm:flex flex-col leading-tight">
                <span
                  className={cn(
                    "font-light text-[15px] lg:text-base tracking-[0.18em] transition-colors duration-300",
                    logoTextColor,
                    "group-hover:text-gold-light",
                  )}
                >
                  Kings &lsquo;n Company
                </span>
                <span
                  className={cn(
                    "text-[10px] tracking-[0.32em] font-light mt-0.5",
                    subtitleColor,
                  )}
                >
                  REAL ESTATE NETWORK
                </span>
              </span>
              <span className="sm:hidden font-light text-sm tracking-[0.16em] text-gold">
                Kings &lsquo;n Company
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 lg:gap-2">
              {PRIMARY_NAV.map((item) => (
                <NavLinkItem
                  key={item.href}
                  to={item.href}
                  className={cn("px-3 lg:px-4", textColor)}
                >
                  {item.name}
                </NavLinkItem>
              ))}

              {isAdminLoggedIn && (
                <div className="ml-4 lg:ml-6 pl-4 lg:pl-6 border-l border-white/10">
                  <NavLinkItem
                    to="/admin"
                    className={cn(
                      "inline-flex items-center gap-1.5 px-2 lg:px-3 text-[11px] lg:text-[12px] text-white/60 hover:text-gold",
                    )}
                  >
                    Admin
                    <ArrowUpRight className="h-3 w-3 opacity-70" aria-hidden />
                  </NavLinkItem>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              ref={mobileTriggerRef}
              type="button"
              className={cn(
                "knc-focus-ring md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md",
                "text-white/90 hover:text-gold transition-colors duration-300",
              )}
              onClick={() => setMobileOpen((o) => !o)}
              aria-expanded={mobileOpen}
              aria-controls={mobileId}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        id={mobileId}
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label="Site navigation"
        aria-hidden={!mobileOpen}
        className={cn(
          "fixed inset-0 z-40 md:hidden",
          "transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
          mobileOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className="absolute inset-0 bg-black/85 backdrop-blur-2xl"
          onClick={closeMobile}
          aria-hidden
        />
        <div
          className={cn(
            "relative ml-auto h-full w-full max-w-sm bg-gradient-to-b from-black via-black to-neutral-950",
            "border-l border-white/5 flex flex-col",
            "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
            mobileOpen ? "translate-x-0" : "translate-x-full",
          )}
        >
          <div className="flex h-[72px] items-center justify-end px-4">
            <button
              ref={mobileCloseRef}
              type="button"
              onClick={closeMobile}
              className={cn(
                "knc-focus-ring inline-flex h-11 w-11 items-center justify-center rounded-md",
                "text-white/90 hover:text-gold transition-colors",
              )}
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav
            aria-label="Mobile"
            className="flex-1 overflow-y-auto px-6 pb-10 pt-2"
          >
            <ul className="flex flex-col gap-1">
              {PRIMARY_NAV.map((item, idx) => (
                <li
                  key={item.href}
                  className={cn(
                    "opacity-0",
                    mobileOpen && "animate-menu-item-in",
                  )}
                  style={{
                    animationDelay: mobileOpen ? `${80 + idx * 55}ms` : undefined,
                    animationFillMode: "both",
                  }}
                >
                  <NavLinkItem
                    to={item.href}
                    onNavigate={closeMobile}
                    variant="mobile"
                    className="block w-full border-b border-white/5"
                  >
                    <span className="flex w-full items-center justify-between">
                      <span>{item.name}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-40" aria-hidden />
                    </span>
                  </NavLinkItem>
                </li>
              ))}
            </ul>

            {isAdminLoggedIn && (
              <div
                className={cn(
                  "mt-8 border-t border-white/5 pt-6 opacity-0",
                  mobileOpen && "animate-menu-item-in",
                )}
                style={{
                  animationDelay: mobileOpen ? `${80 + PRIMARY_NAV.length * 55}ms` : undefined,
                  animationFillMode: "both",
                }}
              >
                <p className="text-[10px] tracking-[0.32em] text-white/40 mb-3">
                  ADMIN
                </p>
                <NavLinkItem
                  to="/admin"
                  onNavigate={closeMobile}
                  variant="mobile"
                  className="block w-full min-h-[44px] text-gold"
                >
                  <span className="flex w-full items-center justify-between">
                    <span>Open Dashboard</span>
                    <ArrowUpRight className="h-4 w-4" aria-hidden />
                  </span>
                </NavLinkItem>
              </div>
            )}
          </nav>

          <div className="border-t border-white/5 px-6 py-5 text-[11px] tracking-[0.32em] text-white/40">
            REAL ESTATE NETWORK
          </div>
        </div>
      </div>
    </>
  );
};

export default Navigation;
