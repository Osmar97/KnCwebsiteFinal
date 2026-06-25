import { ReactNode, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLogin } from "@/components/AdminLogin";
import {
  LayoutDashboard,
  Building2,
  FileBox,
  MapPin,
  Calendar,
  Inbox,
  LogOut,
  Settings,
  Menu,
  ChevronDown,
  Users,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type SubItem = { to: string; label: string };
type SubSection = { heading: string; items: SubItem[] };
type NavItem =
  | { kind: "link"; to: string; label: string; icon: any; exact?: boolean }
  | { kind: "group"; key: string; label: string; icon: any; sections: SubSection[] };

const NAV: NavItem[] = [
  { kind: "link", to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { kind: "link", to: "/admin/properties", label: "Properties", icon: Building2 },
  { kind: "link", to: "/admin/assets", label: "Assets", icon: FileBox },
  {
    kind: "group",
    key: "tours",
    label: "Tours",
    icon: MapPin,
    sections: [
      {
        heading: "Tours",
        items: [{ to: "/admin/tours", label: "All Tours" }],
      },
      {
        heading: "Destinations",
        items: [
          { to: "/admin/tours/where-we-go", label: "Where We Go" },
          { to: "/admin/private-tour/destinations", label: "Private Tour Destinations" },
        ],
      },
      {
        heading: "Private Tour",
        items: [
          { to: "/admin/private-tour/settings", label: "Configuration" },
          { to: "/admin/private-tour/dates", label: "Dates" },
          { to: "/admin/private-tour/addons", label: "Add-Ons" },
          { to: "/admin/private-tour/included", label: "Included Features" },
        ],
      },
    ],
  },
  { kind: "link", to: "/admin/bookings", label: "Bookings", icon: Calendar },
  {
    kind: "group",
    key: "crm",
    label: "CRM",
    icon: Users,
    sections: [
      {
        heading: "Pipeline",
        items: [
          { to: "/admin/crm", label: "All Leads & Pipeline" },
          { to: "/admin/crm/tasks", label: "Tasks" },
          { to: "/admin/leads", label: "Quick Inbox" },
        ],
      },
      {
        heading: "By Source",
        items: [
          { to: "/admin/waitlist", label: "Waitlist Requests" },
          { to: "/admin/quotes", label: "Custom Quote Requests" },
        ],
      },
    ],
  },
  {
    kind: "group",
    key: "site",
    label: "Site Settings",
    icon: Settings,
    sections: [
      {
        heading: "Brand",
        items: [
          { to: "/admin/site-settings/company", label: "Company Information" },
          { to: "/admin/site-settings/social-media", label: "Social Media" },
        ],
      },
    ],
  },
];

const isPathActive = (pathname: string, to: string, exact?: boolean) =>
  exact ? pathname === to : pathname === to || pathname.startsWith(to + "/");

interface SidebarBodyProps {
  pathname: string;
  onNavigate?: () => void;
  onLogout: () => void;
}

const SidebarBody = ({ pathname, onNavigate, onLogout }: SidebarBodyProps) => {
  const initialOpen: Record<string, boolean> = {};
  for (const n of NAV) {
    if (n.kind === "group")
      initialOpen[n.key] = n.sections.some((sec) => sec.items.some((s) => isPathActive(pathname, s.to)));
  }
  const [open, setOpen] = useState<Record<string, boolean>>(initialOpen);

  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
        {NAV.map((n) => {
          const Icon = n.icon;
          if (n.kind === "link") {
            const active = isPathActive(pathname, n.to, n.exact);
            return (
              <Link
                key={n.to}
                to={n.to}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-light tracking-wide min-h-[44px] transition-colors",
                  active ? "bg-gold text-black" : "text-gray-300 hover:text-gold hover:bg-gold/5",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{n.label}</span>
              </Link>
            );
          }
          const allItems = n.sections.flatMap((s) => s.items);
          const groupActive = allItems.some((s) => isPathActive(pathname, s.to));
          const isOpen = open[n.key] ?? groupActive;
          return (
            <div key={n.key}>
              <button
                type="button"
                onClick={() => setOpen((p) => ({ ...p, [n.key]: !isOpen }))}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-light tracking-wide min-h-[44px] transition-colors",
                  groupActive ? "text-gold" : "text-gray-300 hover:text-gold hover:bg-gold/5",
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate flex-1 text-left">{n.label}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
              </button>
              {isOpen && (
                <div className="ml-7 mt-0.5 mb-1 border-l border-gray-800 pl-2 space-y-2">
                  {n.sections.map((sec) => (
                    <div key={sec.heading} className="space-y-0.5">
                      {n.sections.length > 1 && (
                        <p className="px-3 pt-1 text-[10px] uppercase tracking-widest text-gray-600">
                          {sec.heading}
                        </p>
                      )}
                      {sec.items.map((s) => {
                        const active = isPathActive(pathname, s.to);
                        return (
                          <Link
                            key={s.to}
                            to={s.to}
                            onClick={onNavigate}
                            className={cn(
                              "block px-3 py-2 rounded-md text-xs font-light tracking-wide min-h-[40px] flex items-center transition-colors",
                              active ? "bg-gold/15 text-gold" : "text-gray-400 hover:text-gold hover:bg-gold/5",
                            )}
                          >
                            {s.label}
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
      <div className="p-2 border-t border-gray-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-sm font-light tracking-wide text-gray-400 hover:text-red-400 hover:bg-red-500/5 min-h-[44px]"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
};

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}

const AdminLayout = ({ title, description, children, actions }: Props) => {
  const { isAdminLoggedIn, supabaseUser, logout } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!isAdminLoggedIn || !supabaseUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12 pt-28">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Login Required</h1>
            <p className="text-center text-muted-foreground mb-8">
              You must be logged in as an admin to access this area.
            </p>
            <AdminLogin />
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-20 lg:pt-24">
        <div className="flex w-full max-w-[1600px] mx-auto">
          {/* Desktop sidebar */}
          <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 border-r border-gray-800 bg-gray-950 min-h-[calc(100vh-6rem)] sticky top-24 self-start max-h-[calc(100vh-6rem)]">
            <SidebarBody pathname={location.pathname} onLogout={handleLogout} />
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0 px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
            {/* Mobile header */}
            <div className="lg:hidden flex items-center justify-between mb-4 gap-2">
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <button
                    aria-label="Open admin menu"
                    className="inline-flex items-center justify-center w-11 h-11 rounded-md border border-gray-800 bg-gray-950 text-gray-200 hover:text-gold hover:border-gold/50"
                  >
                    <Menu className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72 bg-gray-950 border-r border-gray-800 text-white">
                  <SheetHeader className="px-4 py-4 border-b border-gray-800">
                    <SheetTitle className="text-gold text-left text-base">Admin</SheetTitle>
                  </SheetHeader>
                  <SidebarBody
                    pathname={location.pathname}
                    onLogout={handleLogout}
                    onNavigate={() => setMobileOpen(false)}
                  />
                </SheetContent>
              </Sheet>
              <span className="text-xs uppercase tracking-widest text-gray-500">Admin</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gold break-words">{title}</h1>
                {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
              </div>
              {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
            </div>
            <div className="min-w-0">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;