
import { GraduationCap, Users, MapPin } from "lucide-react";

export const PortfolioServices = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Property Ownership Academy",
      description: "Comprehensive education programs designed to equip you with the knowledge and skills needed for successful real estate investment.",
      features: ["Investment Fundamentals", "Market Analysis", "Risk Management", "Financial Planning"]
    },
    {
      icon: Users,
      title: "Consultancy",
      description: "Expert guidance and strategic advice tailored to your specific investment goals and market conditions.",
      features: ["Strategic Planning", "Portfolio Review", "Market Insights", "Risk Assessment"]
    },
    {
      icon: MapPin,
      title: "Tours",
      description: "Guided property tours and market exploration to help you make informed investment decisions.",
      features: ["Property Inspections", "Market Tours", "Investment Walkthroughs", "Location Analysis"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            PORTFOLIO <span className="text-gold">SERVICES</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Our comprehensive suite of services designed to support every aspect of your real estate investment journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
              <div className="w-16 h-16 bg-gradient-to-br from-[#85754E] to-gold rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#85754E] mb-4">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-6">{service.description}</p>
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-600">
                    <div className="w-2 h-2 bg-gold rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
