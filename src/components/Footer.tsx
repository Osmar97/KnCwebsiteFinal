import { MapPin, Phone, Mail, Globe, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div>
              <h3 className="text-gold text-xl font-light tracking-wider mb-4">
                Kings 'n Company
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real estate consulting, blending local expertise and global vision.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h4 className="text-white font-medium tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/our-approach" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Our Approach
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Resources
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-gold transition-colors text-sm">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h4 className="text-white font-medium tracking-wider">CONTACT</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Portugal & Cabo Verde
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <a 
                  href="tel:+351939953609"
                  className="text-gray-400 text-sm hover:text-gold transition-colors cursor-pointer"
                >
                  +351 939 953 609
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  services@kingsncompany.com
                </span>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-medium tracking-wider">CONNECT</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.linkedin.com/company/kings-n-company/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300">
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/kingsncompany_/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
              >
                <Instagram className="w-5 h-5" />
              </a>

              <a 
                href="https://api.whatsapp.com/send/?phone=351939953609&text=&type=phone_number&app_absent=0" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-gold/20 rounded-full flex items-center justify-center hover:bg-gold hover:text-black transition-all duration-300"
              >
                <Phone className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © {currentYear} Kings 'n Company. All rights reserved. | AMI 21908
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
