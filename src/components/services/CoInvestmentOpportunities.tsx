import { Handshake, TrendingUp, Shield, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
export const CoInvestmentOpportunities = () => {
  const benefits = [{
    icon: Handshake,
    title: "Shared Capital Contributions",
    description: "Pool resources with KnC investors to access larger, more lucrative investment opportunities."
  }, {
    icon: TrendingUp,
    title: "Premium Off-Market Deals",
    description: "Exclusive access to high-quality properties not available through traditional channels."
  }, {
    icon: Shield,
    title: "Reduced Personal Risk",
    description: "Share investment responsibility while maintaining professional oversight throughout the project."
  }, {
    icon: Users,
    title: "Professional Project Management",
    description: "From acquisition to exit, benefit from our expertise in managing every aspect of the investment."
  }];
  const suitableFor = ["Investors seeking to diversify their portfolio with reduced capital risk", "Those who want access to premium deals while maintaining a hands-off approach", "Partners looking to scale their investment capacity through strategic collaboration", "Experienced investors who value professional oversight and shared expertise"];
  const scrollToContact = () => {
    const contactSection = document.getElementById('resources');
    contactSection?.scrollIntoView({
      behavior: 'smooth'
    });
  };
  return <section className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-gold/10 to-transparent"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          

          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
            CO-INVEST <span className="text-gold">WITH US</span>
          </h2>

          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>

          <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed mb-8">
            Partner with Kings 'n Company to access exclusive investments through our co-investment model.
            <br />Share capital, reduce risk, and maximize returns through strategic collaboration.
          </p>

          {/* Visual Diagram */}
          <div className="flex items-center justify-center mb-12">
            
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {benefits.map((benefit, index) => <Card key={index} className="bg-gray-900/80 border border-gray-700/50 backdrop-blur-sm hover:bg-gray-800/80 transition-all duration-300 group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/30 transition-colors">
                  <benefit.icon className="w-8 h-8 text-gold" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-3">{benefit.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{benefit.description}</p>
              </CardContent>
            </Card>)}
        </div>

        {/* Suitable For Section */}
        <div className="bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl p-8 border border-gray-700/50 backdrop-blur-sm mb-12">
          <h3 className="text-2xl font-light text-gold mb-8 tracking-wider text-center">
            SUITABLE FOR
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            {suitableFor.map((item, index) => <div key={index} className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gold rounded-full mt-3 flex-shrink-0"></div>
                <p className="text-gray-300 leading-relaxed">{item}</p>
              </div>)}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          
        </div>
      </div>
    </section>;
};