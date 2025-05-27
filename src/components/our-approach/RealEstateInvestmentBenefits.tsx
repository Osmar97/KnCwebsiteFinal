
import { TrendingUp, Shield, BarChart3, Zap, Home, TrendingDown } from "lucide-react";

export const RealEstateInvestmentBenefits = () => {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Stable Cash Flow",
      description: "Reliable rental income compared to other volatile investments, providing consistent monthly returns."
    },
    {
      icon: Shield,
      title: "Tax Advantages",
      description: "Deduct depreciation, mortgage interest, and operational expenses to optimize your tax position."
    },
    {
      icon: BarChart3,
      title: "Portfolio Diversification",
      description: "Reduces overall risk during market downturns by spreading investments across different asset classes."
    },
    {
      icon: Zap,
      title: "Leverage",
      description: "Control high-value assets with small down payments, amplifying your investment potential."
    },
    {
      icon: Home,
      title: "Legacy and Estate",
      description: "Build generational wealth and financial security that can be passed to future generations."
    },
    {
      icon: TrendingDown,
      title: "Hedge Against Inflation",
      description: "Property values rise with inflation, protecting your investment from currency devaluation."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wider">
            REAL ESTATE INVESTMENT <span className="text-gold">BENEFITS</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Understanding the fundamental advantages that make real estate a cornerstone of wealth building strategies.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 group border border-gray-800">
              <div className="w-16 h-16 bg-gradient-to-br from-[#85754E] to-gold rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <benefit.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{benefit.title}</h3>
              <p className="text-gray-300 leading-relaxed">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
