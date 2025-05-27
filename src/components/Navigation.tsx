
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 10 L80 30 L70 60 L50 90 L30 60 L20 30 Z"
                    fill="none"
                    stroke="#85754E"
                    strokeWidth="2"
                    className="opacity-80"
                  />
                  <circle cx="50" cy="35" r="3" fill="#85754E" />
                  <circle cx="35" cy="45" r="2" fill="#85754E" />
                  <circle cx="65" cy="45" r="2" fill="#85754E" />
                  <circle cx="45" cy="55" r="2" fill="#85754E" />
                  <circle cx="55" cy="55" r="2" fill="#85754E" />
                </svg>
              </div>
              <span className="text-2xl font-playfair text-[#85754E]">
                Kings 'n Company
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#about" className="text-gray-700 hover:text-[#85754E] px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#85754E] transition-colors">
                ABOUT
              </a>
              <a href="#services" className="text-gray-700 hover:text-[#85754E] px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#85754E] transition-colors">
                SERVICES
              </a>
              <a href="#approach" className="text-gray-700 hover:text-[#85754E] px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#85754E] transition-colors">
                OUR APPROACH
              </a>
              <a href="#resources" className="text-gray-700 hover:text-[#85754E] px-3 py-2 text-sm font-medium border-b-2 border-transparent hover:border-[#85754E] transition-colors">
                RESOURCES
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-[#85754E] p-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              <a href="#about" className="text-gray-700 hover:text-[#85754E] block px-3 py-2 text-base font-medium">
                ABOUT
              </a>
              <a href="#services" className="text-gray-700 hover:text-[#85754E] block px-3 py-2 text-base font-medium">
                SERVICES
              </a>
              <a href="#approach" className="text-gray-700 hover:text-[#85754E] block px-3 py-2 text-base font-medium">
                OUR APPROACH
              </a>
              <a href="#resources" className="text-gray-700 hover:text-[#85754E] block px-3 py-2 text-base font-medium">
                RESOURCES
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
