
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { AdminLogin } from "./AdminLogin";
import logo from '../assets/logo.png';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Check if we're on a page with white background
  const isWhiteBackground = location.pathname !== '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/services" },
    { name: "OUR APPROACH", href: "/our-approach" },
    { name: "RESOURCES", href: "/resources" },
    { name: "CONTACT", href: "/contact" }
  ];

  // Define text colors based on background
  const textColor = isWhiteBackground ? 'text-[#85754E]' : 'text-white';
  const hoverColor = isWhiteBackground ? 'hover:text-gold' : 'hover:text-gold';
  const logoTextColor = isWhiteBackground ? 'text-[#85754E]' : 'text-gold';
  const subtitleColor = isWhiteBackground ? 'text-gray-600' : 'text-gray-400';
  const mobileTextColor = isWhiteBackground ? 'text-[#85754E]' : 'text-white';

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-transparent backdrop-blur-md shadow-2xl' 
        : 'bg-transparent backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link 
            to="/"
            className="flex items-center space-x-3 group cursor-pointer"
          >
            <img 
              src={logo} 
              alt="Logo" 
              className="w-12 h-12 object-contain drop-shadow-[0_0_10px_rgba(160,143,42,0.8)]" 
            />
            <div>
              <div className={`${logoTextColor} font-light text-lg tracking-wider group-hover:text-gold-light transition-colors`}>
                Kings 'n Company
              </div>
              <div className={`text-xs ${subtitleColor} tracking-widest`}>
                REAL ESTATE NETWORK
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative ${textColor} ${hoverColor} transition-colors duration-300 text-sm tracking-wider font-light group`}
              >
                {item.name}
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gold transition-all duration-300 group-hover:w-full"></div>
              </Link>
            ))}
            <AdminLogin />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor} ${hoverColor} transition-colors duration-300 p-2`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
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
                  className={`block px-3 py-2 ${mobileTextColor} hover:text-gold hover:bg-gold/5 rounded-md transition-all duration-300 text-sm tracking-wider`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="px-3 py-2">
                <AdminLogin />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
