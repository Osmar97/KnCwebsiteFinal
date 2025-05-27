
import { User, Target, LifeBuoy } from "lucide-react";

export const TailoredStrategies = () => {
  const strategies = [
    {
      icon: User,
      title: "Individual Attention",
      description: "Every client receives personalized attention with strategies designed specifically for their financial situation and goals."
    },
    {
      icon: Target,
      title: "Bespoke Strategies",
      description: "Custom investment strategies crafted to match your risk tolerance, timeline, and return expectations."
    },
    {
      icon: LifeBuoy,
      title: "Ongoing Support",
      description: "Continuous guidance and support throughout your investment journey, from acquisition to portfolio optimization."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            TAILORED <span className="text-gold">STRATEGIES</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            No two investors are alike. Our approach recognizes your unique circumstances and creates strategies that align with your specific objectives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {strategies.map((strategy, index) => (
            <div key={index} className="text-center group">
              <div className="relative">
                <div className="w-20 h-20 bg-[#85754E] rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-gold transition-colors duration-300">
                  <strategy.icon className="w-10 h-10 text-white" />
                </div>
                <div className="absolute inset-0 w-20 h-20 border-2 border-gold rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
              </div>
              <h3 className="text-2xl font-semibold text-[#85754E] mb-4">{strategy.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{strategy.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
