
import { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';
import { useAdmin } from "@/contexts/AdminContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const location = useLocation();
  const { isAdminLoggedIn } = useAdmin();

  // Check if we're on a page with dark background
  const darkBackgroundPages = ['/', '/services', '/properties'];
  const isDarkBackground = darkBackgroundPages.includes(location.pathname);
  
  // Keep navbar static on properties page and property detail pages
  const isPropertiesPage = location.pathname === '/properties' || location.pathname.startsWith('/properties/');

  const lastScrollY = useRef(0);
  const lastDirChangeY = useRef(0);
  const lastDir = useRef<"up" | "down">("up");
  const ticking = useRef(false);

  // Background state — driven by hero visibility via IntersectionObserver.
  // `scrolled` becomes true once the page has been scrolled past the hero
  // sentinel (or, when no sentinel exists on the page, immediately).
  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    let mutationObserver: MutationObserver | null = null;
    let rafId = 0;

    const NAV_HEIGHT = 64;

    const evaluate = (sentinel: HTMLElement) => {
      const rect = sentinel.getBoundingClientRect();
      // Hero is "in view" while sentinel sits below the navbar bottom.
      setScrolled(rect.top <= NAV_HEIGHT);
    };

    const attach = () => {
      const sentinel = document.querySelector<HTMLElement>("[data-hero-sentinel]");

      if (!sentinel) {
        // No hero on this page → solid navbar from the start.
        setScrolled(true);
        return;
      }

      // Initial sync (handles refresh + route change deep in the page).
      evaluate(sentinel);

      observer = new IntersectionObserver(
        ([entry]) => {
          // The sentinel is rendered at the bottom edge of the hero.
          // Once it crosses above the navbar, we switch to the blurred bg.
          const passedTop =
            !entry.isIntersecting && entry.boundingClientRect.top < NAV_HEIGHT;
          setScrolled(passedTop);
        },
        {
          // Trigger exactly when the sentinel meets the navbar bottom.
          rootMargin: `-${NAV_HEIGHT}px 0px 0px 0px`,
          threshold: [0, 1],
        },
      );
      observer.observe(sentinel);
    };

    // Wait one frame so the new route's DOM is mounted before querying.
    rafId = window.requestAnimationFrame(() => {
      attach();

      // If the sentinel mounts later (lazy hero, async data), watch for it.
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

  useEffect(() => {
    lastScrollY.current = window.scrollY;
    lastDirChangeY.current = window.scrollY;

    const SHOW_AT_TOP = 80;       // always visible above this
    const HIDE_AFTER = 120;       // only start hiding past this
    const DIR_THRESHOLD = 8;      // ignore tiny direction flips (jitter)

    const update = () => {
      ticking.current = false;
      const y = Math.max(0, window.scrollY);

      if (isPropertiesPage) {
        setHidden(false);
        lastScrollY.current = y;
        return;
      }

      if (y <= SHOW_AT_TOP) {
        setHidden(false);
        lastScrollY.current = y;
        lastDirChangeY.current = y;
        lastDir.current = "up";
        return;
      }

      const delta = y - lastScrollY.current;
      const dir: "up" | "down" = delta > 0 ? "down" : delta < 0 ? "up" : lastDir.current;

      if (dir !== lastDir.current) {
        lastDirChangeY.current = y;
        lastDir.current = dir;
      }

      const distSinceFlip = Math.abs(y - lastDirChangeY.current);

      if (dir === "down" && y > HIDE_AFTER && distSinceFlip > DIR_THRESHOLD) {
        setHidden(true);
        setIsOpen(false);
      } else if (dir === "up" && distSinceFlip > DIR_THRESHOLD) {
        setHidden(false);
      }

      lastScrollY.current = y;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isPropertiesPage]);

  const navItems = [
    { name: "HOME", href: "/" },
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "TOURS", href: "/POT" },
    { name: "CITY KEYS", href: "/kttc" },
    { name: "OUR APPROACH", href: "/our-approach" },
    { name: "CONTACT", href: "/contact" }
  ];

  // Define text colors based on background
  const textColor = isDarkBackground ? 'text-white' : 'text-[#85754E]';
  const hoverColor = 'hover:text-gold';
  const logoTextColor = isDarkBackground ? 'text-gold' : 'text-[#85754E]';
  const subtitleColor = isDarkBackground ? 'text-gray-400' : 'text-gray-600';
  const mobileTextColor = isDarkBackground ? 'text-white' : 'text-[#85754E]';

  const baseBg = isPropertiesPage
    ? "bg-black"
    : scrolled
      ? (isDarkBackground
          ? "bg-black/60 backdrop-blur-xl backdrop-saturate-150 border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.25)]"
          : "bg-white/70 backdrop-blur-xl backdrop-saturate-150 border-b border-black/5 shadow-[0_4px_30px_rgba(0,0,0,0.06)]")
      : "bg-transparent";

  return (
    <nav
      style={{
        transform: hidden ? "translate3d(0,-100%,0)" : "translate3d(0,0,0)",
        transition:
          "transform 500ms cubic-bezier(0.22, 1, 0.36, 1), background-color 400ms ease, backdrop-filter 400ms ease, box-shadow 400ms ease, border-color 400ms ease",
        willChange: "transform",
      }}
      className={`fixed inset-x-0 top-0 w-full z-50 ${baseBg}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-2 sm:space-x-3 group cursor-pointer"
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain drop-shadow-[0_0_10px_rgba(160,143,42,0.8)]" 
            />
            <div className="hidden sm:block">
              <div className={`${logoTextColor} font-light text-base sm:text-lg tracking-wider group-hover:text-gold-light transition-colors`}>
                Kings 'n Company
              </div>
              <div className={`text-xs ${subtitleColor} tracking-widest`}>
                REAL ESTATE NETWORK
              </div>
            </div>
            {/* Mobile logo text */}
            <div className="sm:hidden">
              <div className={`${logoTextColor} font-light text-sm tracking-wider group-hover:text-gold-light transition-colors`}>
                Kings 'n Company
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative ${textColor} ${hoverColor} transition-colors duration-300 text-xs lg:text-sm tracking-wider font-light group`}
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
            
            {isAdminLoggedIn && (
              <DropdownMenu>
                <DropdownMenuTrigger className={`relative ${textColor} ${hoverColor} transition-colors duration-300 text-xs lg:text-sm tracking-wider font-light group flex items-center gap-1`}>
                  ADMIN
                  <ChevronDown className="w-3 h-3" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-background border-border z-50">
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="cursor-pointer">
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/properties" className="cursor-pointer">
                      Properties
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/assets" className="cursor-pointer">
                      Assets
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/tours" className="cursor-pointer">
                      Tours
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/bookings" className="cursor-pointer">
                      Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/waitlist" className="cursor-pointer">
                      Waitlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/admin/quotes" className="cursor-pointer">
                      Custom Quotes
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor} ${hoverColor} transition-colors duration-300 p-2`}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden transition-all duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-md rounded-b-lg">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-3 ${mobileTextColor} hover:text-gold hover:bg-gold/5 rounded-md transition-all duration-300 text-sm tracking-wider border-b border-gray-800 last:border-b-0`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
