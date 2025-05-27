
import { GraduationCap, Users, MapPin } from "lucide-react";

export const CoreServices = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Property Ownership Academy",
      description: "Education platform offering courses from beginner to advanced strategies.",
      subtitle: "Empowers investors with essential knowledge and skills.",
      features: ["Beginner to Advanced Courses", "Market Analysis Training", "Investment Strategies", "Risk Management"]
    },
    {
      icon: Users,
      title: "Property Ownership Consultancy",
      description: "Personalized guidance including deal sourcing and project management.",
      subtitle: "Strategic planning to maximize returns.",
      features: ["Deal Sourcing", "Project Management", "Strategic Planning", "Return Optimization"]
    },
    {
      icon: MapPin,
      title: "Property Ownership Tour",
      description: "Exclusive, immersive property tours abroad.",
      subtitle: "Discover lucrative opportunities and gain in-depth market insights.",
      features: ["Exclusive Property Access", "Market Insights", "On-Site Inspections", "Investment Walkthroughs"]
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">INITIATE | ENHANCE YOUR PORTFOLIO</span>
            <div className="w-8 h-0.5 bg-gold"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            CORE <span className="text-gold">SERVICES</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive solutions designed to guide you through every stage of your real estate investment journey.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-[#85754E] to-gold rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#85754E] mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed mb-2">{service.description}</p>
              <p className="text-gold font-medium mb-6">{service.subtitle}</p>
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
