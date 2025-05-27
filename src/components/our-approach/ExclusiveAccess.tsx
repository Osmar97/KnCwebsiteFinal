
import { Eye, Handshake, Zap } from "lucide-react";

export const ExclusiveAccess = () => {
  const access = [
    {
      icon: Eye,
      title: "Off-Market Opportunities",
      description: "Access to exclusive properties not available to the general public, giving you a competitive advantage."
    },
    {
      icon: Handshake,
      title: "Strategic Partnerships",
      description: "Leverage our network of trusted partners including developers, agents, and financial institutions."
    },
    {
      icon: Zap,
      title: "First-Mover Advantage",
      description: "Be among the first to know about new investment opportunities in emerging markets and developments."
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            EXCLUSIVE <span className="text-gold">ACCESS</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Gain access to opportunities and networks that are typically reserved for institutional investors and industry insiders.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {access.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-[#85754E] rounded-lg flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#85754E] mb-4">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
