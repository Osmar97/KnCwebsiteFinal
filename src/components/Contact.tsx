
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Contact = () => {
  const contactInfo = [
    {
      icon: Phone,
      title: "Phone",
      detail: "+1 (555) 123-4567",
      description: "Monday to Friday, 9am to 6pm EST"
    },
    {
      icon: Mail,
      title: "Email",
      detail: "contact@kingcompany.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: MapPin,
      title: "Office",
      detail: "123 Financial District, New York, NY 10004",
      description: "By appointment only"
    },
    {
      icon: Clock,
      title: "Business Hours",
      detail: "Mon - Fri: 9:00 AM - 6:00 PM",
      description: "Emergency consultations available"
    }
  ];

  return (
    <section id="contact" className="py-20 bg-navy-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-playfair mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-navy-200 leading-relaxed">
            Ready to transform your business? Let's discuss how our strategic 
            financial advisory services can help you achieve your goals.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10">
            <h3 className="text-2xl font-bold font-playfair mb-6">
              Schedule a Consultation
            </h3>
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">First Name</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder:text-navy-300"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <Input 
                    className="bg-white/10 border-white/20 text-white placeholder:text-navy-300"
                    placeholder="Doe"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <Input 
                  type="email"
                  className="bg-white/10 border-white/20 text-white placeholder:text-navy-300"
                  placeholder="john@company.com"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Company</label>
                <Input 
                  className="bg-white/10 border-white/20 text-white placeholder:text-navy-300"
                  placeholder="Your Company"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">How can we help?</label>
                <Textarea 
                  className="bg-white/10 border-white/20 text-white placeholder:text-navy-300 min-h-[120px]"
                  placeholder="Tell us about your business and what you're looking to achieve..."
                />
              </div>
              
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
                Send Message
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold font-playfair mb-6">
                Contact Information
              </h3>
              <p className="text-navy-200 leading-relaxed mb-8">
                Our team is ready to help you navigate complex financial decisions 
                and develop strategies that drive sustainable growth.
              </p>
            </div>

            <div className="grid gap-6">
              {contactInfo.map((info) => {
                const IconComponent = info.icon;
                return (
                  <div key={info.title} className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg mb-1">{info.title}</h4>
                      <p className="text-white font-medium mb-1">{info.detail}</p>
                      <p className="text-navy-300 text-sm">{info.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Additional CTA */}
            <div className="bg-gradient-to-r from-primary/20 to-blue-600/20 rounded-2xl p-6 border border-primary/30">
              <h4 className="text-xl font-semibold font-playfair mb-3">
                Prefer to Talk Directly?
              </h4>
              <p className="text-navy-200 mb-4">
                Schedule a 30-minute discovery call to discuss your specific needs 
                and learn how we can help accelerate your growth.
              </p>
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-navy-900">
                Book Discovery Call
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
