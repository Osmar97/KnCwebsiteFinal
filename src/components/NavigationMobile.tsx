import { X, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";
import { NavLinkItem } from "./NavigationDesktop";

type NavItem = { name: string; href: string };

interface MobileNavProps {
  items: NavItem[];
  mobileOpen: boolean;
  menuRef: React.RefObject<HTMLDivElement | null>;
  closeRef: React.RefObject<HTMLButtonElement | null>;
  onClose: () => void;
  mobileId: string;
}

export const MobileNav = ({
  items,
  mobileOpen,
  menuRef,
  closeRef,
  onClose,
  mobileId,
}: MobileNavProps) => {
  const { isAdminLoggedIn } = useAdmin();

  return (
    <div
      id={mobileId}
      ref={menuRef}
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
        onClick={onClose}
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
            ref={closeRef}
            type="button"
            onClick={onClose}
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
            {items.map((item, idx) => (
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
                  onNavigate={onClose}
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
                animationDelay: mobileOpen
                  ? `${80 + items.length * 55}ms`
                  : undefined,
                animationFillMode: "both",
              }}
            >
              <p className="text-[10px] tracking-[0.32em] text-white/40 mb-3">
                ADMIN
              </p>
              <NavLinkItem
                to="/admin"
                onNavigate={onClose}
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
  );
};
