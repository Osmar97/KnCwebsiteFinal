
import { useState, useEffect } from "react";
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
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const { isAdminLoggedIn } = useAdmin();

  // Check if we're on a page with dark background
  const darkBackgroundPages = ['/', '/services', '/properties'];
  const isDarkBackground = darkBackgroundPages.includes(location.pathname);
  
  // Keep navbar static on properties page
  const isPropertiesPage = location.pathname === '/properties';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Don't hide navbar on properties page
      if (isPropertiesPage) {
        setHidden(false);
      } else {
        // Show navbar when scrolling up or at top
        if (currentScrollY < lastScrollY || currentScrollY < 100) {
          setHidden(false);
        } 
        // Hide navbar when scrolling down
        else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setHidden(true);
          setIsOpen(false); // Close mobile menu when hiding
        }
      }
      
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isPropertiesPage]);

  const navItems = [
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "OUR APPROACH", href: "/our-approach" },
    { name: "PROPERTIES", href: "/properties" },
    { name: "RESOURCES", href: "/resources" },
    { name: "CONTACT", href: "/contact" }
  ];

  // Define text colors based on background
  const textColor = isDarkBackground ? 'text-white' : 'text-[#85754E]';
  const hoverColor = 'hover:text-gold';
  const logoTextColor = isDarkBackground ? 'text-gold' : 'text-[#85754E]';
  const subtitleColor = isDarkBackground ? 'text-gray-400' : 'text-gray-600';
  const mobileTextColor = isDarkBackground ? 'text-white' : 'text-[#85754E]';

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${hidden ? '-top-20' : 'top-0'} ${isPropertiesPage ? 'bg-black' : ''}`}>
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
            {navItems.map((item) => {
              // Show dropdown for PROPERTIES when admin is logged in
              if (item.name === "PROPERTIES" && isAdminLoggedIn) {
                return (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger className={`relative ${textColor} ${hoverColor} transition-colors duration-300 text-xs lg:text-sm tracking-wider font-light group flex items-center gap-1`}>
                      {item.name}
                      <ChevronDown className="w-3 h-3" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-background border-border z-50">
                      <DropdownMenuItem asChild>
                        <Link to="/properties" className="cursor-pointer">
                          Properties
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/admin/properties" className="cursor-pointer">
                          Manage Properties
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                );
              }
              
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`relative ${textColor} ${hoverColor} transition-colors duration-300 text-xs lg:text-sm tracking-wider font-light group`}
                >
                  {item.name}
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></div>
                </Link>
              );
            })}
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
