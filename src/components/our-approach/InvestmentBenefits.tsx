
import { TrendingUp, Shield, BarChart3, Zap, Home, TrendingDown } from "lucide-react";

export const InvestmentBenefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Stable Cash Flow",
      description: "Generate consistent monthly income through carefully selected rental properties with proven track records."
    },
    {
      icon: Shield,
      title: "Tax Advantages",
      description: "Leverage depreciation, deductions, and other tax strategies to maximize your investment returns."
    },
    {
      icon: BarChart3,
      title: "Portfolio Diversification",
      description: "Reduce risk by spreading investments across different property types and geographic locations."
    },
    {
      icon: Zap,
      title: "Leverage",
      description: "Use financing to amplify your purchasing power and accelerate wealth building potential."
    },
    {
      icon: Home,
      title: "Legacy and Estate",
      description: "Build generational wealth through tangible assets that can be passed down to future generations."
    },
    {
      icon: TrendingDown,
      title: "Hedge Against Inflation",
      description: "Protect your wealth with real estate investments that typically appreciate with inflation."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            REAL ESTATE INVESTMENT <span className="text-gold">BENEFITS</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Understanding the fundamental advantages of real estate investment and how they contribute to long-term wealth building.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg hover:shadow-lg transition-all duration-300 group">
              <div className="w-16 h-16 bg-[#85754E] rounded-lg flex items-center justify-center mb-6 group-hover:bg-gold transition-colors">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-[#85754E] mb-4">{benefit.title}</h3>
              <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
