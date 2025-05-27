
import { Mail, Phone, MapPin, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const footerLinks = {
    Services: [
      'Investment Banking',
      'Growth Strategy',
      'Risk Management',
      'Corporate Advisory',
      'Capital Solutions',
      'Financial Analysis'
    ],
    Company: [
      'About Us',
      'Our Team',
      'Careers',
      'Case Studies',
      'News & Insights',
      'Contact'
    ],
    Resources: [
      'Market Reports',
      'Whitepapers',
      'Webinars',
      'Industry Updates',
      'Financial Calculators',
      'FAQ'
    ]
  };

  return (
    <footer className="bg-navy-900 text-white border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-3xl font-bold font-playfair text-white mb-4">
                  King & Company
                </h3>
                <p className="text-navy-200 leading-relaxed max-w-md">
                  Strategic financial advisory and investment banking services 
                  designed to drive growth, mitigate risk, and maximize value 
                  for businesses across all industries.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-navy-200">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-navy-200">contact@kingcompany.com</span>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-0.5" />
                  <span className="text-navy-200">123 Financial District<br />New York, NY 10004</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex space-x-4">
                <a href="#" className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-navy-800 rounded-lg flex items-center justify-center hover:bg-primary transition-colors duration-200">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Footer Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="text-lg font-semibold font-playfair text-white mb-6">
                  {title}
                </h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a 
                        href="#" 
                        className="text-navy-300 hover:text-white transition-colors duration-200"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-8 border-t border-navy-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-navy-300 text-sm">
              © 2024 King & Company. All rights reserved.
            </div>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-navy-300 hover:text-white transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-navy-300 hover:text-white transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-navy-300 hover:text-white transition-colors duration-200">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
