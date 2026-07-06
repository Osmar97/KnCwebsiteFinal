import { useId } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { useNavigationScroll } from "@/hooks/useNavigationScroll";
import { DesktopNav } from "./NavigationDesktop";
import { MobileNav } from "./NavigationMobile";

type NavItem = { name: string; href: string };

const PRIMARY_NAV: NavItem[] = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Services", href: "/services" },
  { name: "Tours", href: "/POT" },
  { name: "Our Approach", href: "/our-approach" },
  { name: "Contact", href: "/contact" },
];

export const Navigation = () => {
  const {
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
  } = useNavigationScroll();

  const mobileId = useId();

  const useLightForeground = isTransparent;

  const navbarBg = (() => {
    if (isPropertiesPage) {
      return "bg-black/95 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5";
    }
    if (!isTransparent) {
      return "bg-black/90 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5";
    }
    if (scrolled) {
      return "bg-black/70 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5";
    }
    return "bg-transparent border-b border-transparent";
  })();

  const textColor = useLightForeground ? "text-white" : "text-[#85754E]";
  const logoTextColor = "text-gold";
  const subtitleColor = useLightForeground ? "text-white/50" : "text-gray-600";

  return (
    <>
      <header
        className="knc-navbar fixed inset-x-0 top-0 z-50 will-change-transform"
        style={{
          height: scrolled
            ? "var(--knc-nav-height-scrolled, 60px)"
            : "var(--knc-nav-height, 76px)",
          transition:
            "height 380ms cubic-bezier(0.22, 1, 0.36, 1), transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
          transform: isNavHidden ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        }}
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
          <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-10">
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

            <DesktopNav
              items={PRIMARY_NAV}
              textColor={textColor}
              useLightForeground={useLightForeground}
            />

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
              {mobileOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      <MobileNav
        items={PRIMARY_NAV}
        mobileOpen={mobileOpen}
        menuRef={mobileMenuRef}
        closeRef={mobileCloseRef}
        onClose={closeMobile}
        mobileId={mobileId}
      />
    </>
  );
};

export default Navigation;
