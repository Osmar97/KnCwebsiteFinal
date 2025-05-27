
import { User, Target, LifeBuoy, ArrowRight } from "lucide-react";

export const TailoredStrategies = () => {
  const strategies = [
    {
      icon: User,
      title: "Individual Attention",
      description: "Understand client goals in depth through comprehensive consultation and needs assessment."
    },
    {
      icon: Target,
      title: "Bespoke Strategies",
      description: "Personalized investment plans tailored to financial objectives and risk tolerance."
    },
    {
      icon: LifeBuoy,
      title: "Ongoing Support",
      description: "Continuous consultation to adjust strategies as the market evolves and goals change."
    }
  ];

  const processSteps = ["Consult", "Plan", "Execute", "Adjust"];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">OUR COMMITMENT</span>
            <div className="w-8 h-0.5 bg-gold"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wider">
            CUSTOM INVESTMENT <span className="text-gold">PLANNING</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Every investor is unique. Our approach recognizes your specific circumstances and creates strategies that align perfectly with your objectives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {strategies.map((strategy, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg shadow-xl text-center group hover:shadow-2xl hover:shadow-gold/20 transition-all duration-300 border border-gray-800">
              <div className="w-20 h-20 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <strategy.icon className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-4">{strategy.title}</h3>
              <p className="text-gray-300 leading-relaxed">{strategy.description}</p>
            </div>
          ))}
        </div>

        {/* Process Timeline */}
        <div className="bg-gray-900 p-8 rounded-lg shadow-xl border border-gray-800">
          <h3 className="text-2xl font-semibold text-white text-center mb-8">Our Strategic Process</h3>
          <div className="flex items-center justify-center space-x-4 md:space-x-8">
            {processSteps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center text-white font-semibold">
                    {index + 1}
                  </div>
                  <span className="mt-3 text-sm font-medium text-white">{step}</span>
                </div>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-gold mx-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
