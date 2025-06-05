import { Home, Wrench, Users, BarChart3, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const PropertyManagement = () => {
  const services = [
    {
      icon: Wrench,
      title: "Renovation Coordination",
      description: "Complete renovation management and coordination with trusted contractors"
    }, {
      icon: Users,
      title: "Tenant Services",
      description: "Long-term rental tenant sourcing, screening, and management"
    }, {
      icon: Shield,
      title: "Maintenance Oversight",
      description: "Proactive maintenance scheduling and emergency response"
    }, {
      icon: BarChart3,
      title: "Regular Reporting",
      description: "Detailed reports and updates on property performance and status"
    }
  ];

  const handleBookingClick = () => {
    window.open('https://kingsncompany.setmore.com/book?step=additional-products&products=814e33aa-9b10-43a4-8104-652ace5e0647&type=service&staff=1b7d6db9-90af-4ac1-b392-1f3eb6ec83d2&staffSelected=false', '_blank');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="grid grid-cols-1 gap-6">
            <div className="relative rounded-xl overflow-hidden shadow-xl">
              <img 
                src="/lovable-uploads/50793ec6-8356-407b-ae7e-74047b5c8186.png" 
                alt="Property Management - Renovation Oversight" 
                className="w-full h-[600px] object-cover hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </div>
            
            <Card className="bg-gold/10 backdrop-blur-sm border border-gold/20">
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-gold mb-1">Management</div>
                <div className="text-sm text-gray-300">Professional Oversight</div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wider">
              PROPERTY <span className="text-gold">MANAGEMENT</span>
            </h2>

            <div className="w-24 h-0.5 bg-gradient-to-r from-gold to-transparent mb-8"></div>

            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Complete property management as if it were our own, whether you're abroad 
              or simply prefer the convenience of professional oversight.
            </p>

            <p className="text-gray-400 mb-12 leading-relaxed">
              Our comprehensive management service ensures your investment properties are 
              maintained to the highest standards while maximizing rental income and value.
            </p>

            {/* Services List */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {services.map((service, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                  <div className="w-10 h-10 bg-gold/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-gold" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{service.title}</h3>
                    <p className="text-gray-400 text-sm">{service.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-4">
              <Button 
                onClick={handleBookingClick} 
                className="bg-gold text-white hover:bg-gold/90 px-8 py-3 text-lg font-medium transition-all duration-300 flex items-center gap-2"
              >
                <Home className="w-5 h-5" />
                Request Management
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
