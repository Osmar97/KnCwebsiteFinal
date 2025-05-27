
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import logo from '../assets/logo.png';

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: "ABOUT", href: "/about" },
    { name: "SERVICES", href: "/" },
    { name: "MARKETS", href: "/markets" },
    { name: "NETWORK", href: "/network" },
    { name: "RESOURCES", href: "/resources" }
  ];

  const isActive = (href: string) => {
    if (href === "/" && location.pathname === "/") return true;
    if (href !== "/" && location.pathname === href) return true;
    return false;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-black/95 backdrop-blur-md border-b border-gray-700/50 shadow-2xl' 
        : 'bg-black/90 backdrop-blur-sm border-b border-gray-600/30'
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
              <div className="text-gold font-light text-lg tracking-wider group-hover:text-gold-light transition-colors">
                Kings 'n Company
              </div>
              <div className="text-xs text-gray-400 tracking-widest">
                REAL ESTATE NETWORK
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`relative transition-colors duration-300 text-sm tracking-wider font-light group ${
                  isActive(item.href) ? 'text-gold' : 'text-white hover:text-gold'
                }`}
              >
                {item.name}
                <div className={`absolute bottom-0 left-0 h-0.5 bg-gold transition-all duration-300 ${
                  isActive(item.href) ? 'w-full' : 'w-0 group-hover:w-full'
                }`}></div>
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-gold transition-colors duration-300 p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden transition-all duration-300">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-black/95 backdrop-blur-md rounded-b-lg border-b border-gray-600/30">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md transition-all duration-300 text-sm tracking-wider ${
                    isActive(item.href) 
                      ? 'text-gold bg-gold/5' 
                      : 'text-white hover:text-gold hover:bg-gold/5'
                  }`}
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
