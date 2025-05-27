
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-8 h-8">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path
                    d="M50 10 L80 30 L70 60 L50 90 L30 60 L20 30 Z"
                    fill="none"
                    stroke="#85754E"
                    strokeWidth="2"
                  />
                  <circle cx="50" cy="35" r="3" fill="#85754E" />
                  <circle cx="35" cy="45" r="2" fill="#85754E" />
                  <circle cx="65" cy="45" r="2" fill="#85754E" />
                </svg>
              </div>
              <span className="text-xl font-playfair text-[#85754E]">
                Kings 'n Company
              </span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Building generational wealth through strategic real estate investments and superior asset management services.
            </p>
            <p className="text-sm text-gray-500">
              © 2024 Kings 'n Company. All rights reserved.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#about" className="text-gray-400 hover:text-[#85754E] transition-colors">About</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-[#85754E] transition-colors">Services</a></li>
              <li><a href="#approach" className="text-gray-400 hover:text-[#85754E] transition-colors">Our Approach</a></li>
              <li><a href="#resources" className="text-gray-400 hover:text-[#85754E] transition-colors">Resources</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Real Estate Network</li>
              <li>Investment Advisory</li>
              <li>Asset Management</li>
              <li className="pt-2">
                <a href="mailto:info@kingsncompany.com" className="hover:text-[#85754E] transition-colors">
                  info@kingsncompany.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
