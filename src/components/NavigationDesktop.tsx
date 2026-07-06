import { ArrowUpRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAdmin } from "@/contexts/AdminContext";

type NavItem = { name: string; href: string };

interface DesktopNavProps {
  items: NavItem[];
  textColor: string;
  useLightForeground: boolean;
}

export const DesktopNav = ({ items, textColor, useLightForeground }: DesktopNavProps) => {
  const { isAdminLoggedIn } = useAdmin();

  return (
    <div className="hidden md:flex items-center gap-0.5 lg:gap-1">
      {items.map((item) => (
        <NavLinkItem
          key={item.href}
          to={item.href}
          className={cn("px-3 lg:px-4 py-2", textColor)}
        >
          {item.name}
        </NavLinkItem>
      ))}

      {isAdminLoggedIn && (
        <>
          <span
            aria-hidden
            className={cn(
              "ml-4 lg:ml-6 mr-1 h-4 w-px",
              useLightForeground ? "bg-white/20" : "bg-[#85754E]/25",
            )}
          />
          <NavLinkItem
            to="/admin"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 lg:px-4 py-2 text-[11px] lg:text-[12px] opacity-70 hover:opacity-100",
              textColor,
            )}
          >
            Admin
            <ArrowUpRight className="h-3 w-3" aria-hidden />
          </NavLinkItem>
        </>
      )}
    </div>
  );
};

interface NavLinkItemProps {
  to: string;
  onNavigate?: () => void;
  className?: string;
  activeClassName?: string;
  variant?: "desktop" | "mobile";
  children: React.ReactNode;
}

export const NavLinkItem = ({
  to,
  onNavigate,
  className,
  activeClassName,
  variant = "desktop",
  children,
}: NavLinkItemProps) => {
  const desktopBase = "text-xs lg:text-[13px]";
  const mobileBase = "min-h-[44px] py-3 text-base tracking-[0.18em] text-white/90";

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
