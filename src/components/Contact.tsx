import { ContactFormDialog } from "./ContactFormDialog";
import { ContactEmailDialog } from "./ContactEmailDialog";
import { Mail, Phone, MapPin } from "lucide-react";
import { Button } from "./ui/button";

export const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-gradient-to-b from-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light text-white mb-4">
            Get In <span className="text-gold">Touch</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Ready to start your property journey? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Mail className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Email</h3>
                <a href="mailto:services@kingsncompany.com" className="text-gray-400 hover:text-gold transition-colors">
                  services@kingsncompany.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Phone</h3>
                <p className="text-gray-400">+351 123 456 789</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-gold" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-2">Location</h3>
                <p className="text-gray-400">Lisbon, Portugal & Cabo Verde</p>
              </div>
            </div>
          </div>

          {/* Contact Actions */}
          <div className="space-y-6">
            <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700">
              <h3 className="text-white font-medium text-xl mb-4">Send us a message</h3>
              <p className="text-gray-400 mb-6">
                Choose your preferred way to get in touch with us.
              </p>
              <div className="space-y-4">
                <ContactFormDialog>
                  <Button className="w-full bg-gold hover:bg-gold/90 text-black font-medium">
                    Contact Form
                  </Button>
                </ContactFormDialog>
                <ContactEmailDialog>
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    Email Us
                  </Button>
                </ContactEmailDialog>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
