import { ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLogin } from "@/components/AdminLogin";
import { LayoutDashboard, Building2, FileBox, MapPin, Calendar, ClipboardList, Sparkles, LogOut, Settings, Globe, PackagePlus, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/assets", label: "Assets", icon: FileBox },
  { to: "/admin/tours", label: "Tours", icon: MapPin },
  { to: "/admin/bookings", label: "Bookings", icon: Calendar },
  { to: "/admin/waitlist", label: "Waitlist", icon: ClipboardList },
  { to: "/admin/quotes", label: "Custom Quotes", icon: Sparkles },
  { to: "/admin/private-tour/settings", label: "PT · Settings", icon: Settings },
  { to: "/admin/private-tour/destinations", label: "PT · Destinations", icon: Globe },
  { to: "/admin/private-tour/addons", label: "PT · Add-Ons", icon: PackagePlus },
  { to: "/admin/private-tour/dates", label: "PT · Dates", icon: Calendar },
  { to: "/admin/private-tour/included", label: "PT · Included", icon: ListChecks },
];

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

  const isActive = (to: string, exact?: boolean) =>
    exact ? location.pathname === to : location.pathname === to || location.pathname.startsWith(to + "/");

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-20 lg:pt-24">
        <div className="container mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
            <aside className="lg:w-60 lg:flex-shrink-0">
              <div className="bg-gray-950 border border-gray-800 rounded-lg p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
                {NAV.map((n) => {
                  const Icon = n.icon;
                  const active = isActive(n.to, n.exact);
                  return (
                    <Link
                      key={n.to}
                      to={n.to}
                      className={cn(
                        "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-light tracking-wide whitespace-nowrap min-h-[44px] transition-colors",
                        active ? "bg-gold text-black" : "text-gray-300 hover:text-gold hover:bg-gold/5",
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {n.label}
                    </Link>
                  );
                })}
                <button
                  onClick={async () => { await logout(); navigate("/"); }}
                  className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-light tracking-wide text-gray-400 hover:text-red-400 hover:bg-red-500/5 min-h-[44px] mt-auto"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </aside>
            <main className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5 sm:mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gold">{title}</h1>
                  {description && <p className="text-sm text-gray-400 mt-1">{description}</p>}
                </div>
                {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
              </div>
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;