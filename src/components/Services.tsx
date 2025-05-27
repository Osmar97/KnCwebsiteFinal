
import { 
  Building2, 
  TrendingUp, 
  Shield, 
  Users, 
  DollarSign, 
  BarChart3,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      icon: Building2,
      title: "Investment Banking",
      description: "Capital raising, M&A advisory, and strategic financial structuring for growth-oriented companies.",
      features: ["Capital Markets", "M&A Advisory", "Strategic Planning"]
    },
    {
      icon: TrendingUp,
      title: "Growth Strategy",
      description: "Comprehensive business strategy development focused on sustainable growth and market expansion.",
      features: ["Market Analysis", "Business Planning", "Growth Execution"]
    },
    {
      icon: Shield,
      title: "Risk Management",
      description: "Advanced risk assessment and mitigation strategies to protect and optimize business operations.",
      features: ["Risk Assessment", "Compliance", "Financial Controls"]
    },
    {
      icon: Users,
      title: "Corporate Advisory",
      description: "Strategic advisory services for corporate restructuring, governance, and operational excellence.",
      features: ["Corporate Governance", "Restructuring", "Operations"]
    },
    {
      icon: DollarSign,
      title: "Capital Solutions",
      description: "Tailored financing solutions including debt, equity, and alternative capital structures.",
      features: ["Debt Financing", "Equity Solutions", "Alternative Capital"]
    },
    {
      icon: BarChart3,
      title: "Financial Analysis",
      description: "In-depth financial modeling, valuation, and performance analysis for informed decision making.",
      features: ["Valuation", "Financial Modeling", "Performance Analysis"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold font-playfair text-navy-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-navy-600 leading-relaxed">
            Comprehensive financial advisory services designed to drive growth, 
            mitigate risk, and maximize value for our clients across all industries.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.title}
                className="group relative bg-white rounded-2xl border border-gray-100 p-8 hover:shadow-2xl hover:border-primary/20 transition-all duration-300 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon */}
                <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <IconComponent className="w-8 h-8 text-primary" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-semibold font-playfair text-navy-900 mb-4">
                  {service.title}
                </h3>
                <p className="text-navy-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center text-sm text-navy-600">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Learn More Link */}
                <div className="flex items-center text-primary font-medium group-hover:text-navy-900 transition-colors duration-300 cursor-pointer">
                  <span>Learn More</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>

                {/* Hover Border Effect */}
                <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-primary/20 transition-all duration-300"></div>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-navy-900 to-navy-800 rounded-3xl p-12 text-white">
            <h3 className="text-3xl font-bold font-playfair mb-4">
              Ready to Accelerate Your Growth?
            </h3>
            <p className="text-navy-200 text-lg mb-8 max-w-2xl mx-auto">
              Let our expert team develop a customized strategy that drives results 
              and positions your business for long-term success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-navy-900 hover:bg-gray-100">
                Schedule Consultation
              </Button>
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-navy-900">
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;
