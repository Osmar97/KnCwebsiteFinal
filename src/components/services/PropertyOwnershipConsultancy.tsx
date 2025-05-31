
import { Users, Search, FileText, TrendingUp, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export const PropertyOwnershipConsultancy = () => {
  const services = [{
    icon: Search,
    title: "Strategic Planning",
    description: "Market research and strategic planning based on your timeline and goals"
  }, {
    icon: FileText,
    title: "Property Negotiations",
    description: "Expert property negotiations and transaction management"
  }, {
    icon: Users,
    title: "Trusted Network",
    description: "Access to our network of legal, banking, and renovation partners"
  }, {
    icon: TrendingUp,
    title: "Portfolio Building",
    description: "From first homes to complete investment portfolios"
  }];
  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="py-20 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img src="/lovable-uploads/f7d5895b-3367-447c-b4e4-f7accb416dc1.png" alt="Property Ownership Consultancy - Expert Guidance" className="w-full h-[600px] object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
            </div>
            
            {/* Floating Stats */}
            <Card className="absolute -top-8 -right-8 bg-[#85754E] border-0 shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-white/90">End-to-End Support</div>
              </CardContent>
            </Card>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            

            <h2 className="text-4xl md:text-5xl font-light text-white mb-6 tracking-wider">
              PROPERTY OWNERSHIP <span className="text-[#85754E]">CONSULTANCY</span>
            </h2>

            <div className="w-24 h-0.5 bg-gradient-to-r from-[#85754E] to-transparent mb-8"></div>

            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Complete support for those ready to buy, rent, or invest. You bring the vision, 
              we handle everything else from start to finish.
            </p>

            <p className="text-gray-400 mb-12 leading-relaxed">
              Our end-to-end consultancy service takes care of every aspect of your property 
              journey, ensuring smooth transactions and optimal outcomes.
            </p>

            {/* Services Grid */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {services.map((service, index) => <div key={index} className="flex items-start space-x-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50 shadow-sm">
                  <div className="w-10 h-10 bg-[#85754E]/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <service.icon className="w-5 h-5 text-[#85754E]" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">{service.title}</h3>
                    <p className="text-gray-300 text-sm">{service.description}</p>
                  </div>
                </div>)}
            </div>

            <Button onClick={scrollToContact} className="bg-[#85754E] text-white hover:bg-[#85754E]/90 px-8 py-3 text-lg font-medium group">
              GET CONSULTATION
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </section>;
};
