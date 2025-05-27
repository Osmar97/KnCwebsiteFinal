
import { Search, DollarSign, FileText, TrendingUp } from "lucide-react";

export const GlobalSupport = () => {
  const supports = [
    {
      icon: Search,
      title: "Market Research",
      description: "Comprehensive analysis of European and West African markets to identify optimal investment opportunities.",
      whyItMatters: "Data-driven decisions reduce risk and maximize potential returns."
    },
    {
      icon: DollarSign,
      title: "Financing",
      description: "Access to competitive financing options and strategic funding solutions tailored to international investments.",
      whyItMatters: "Proper financing structure amplifies investment capacity and optimizes cash flow."
    },
    {
      icon: FileText,
      title: "Transaction Management",
      description: "End-to-end management of complex international property transactions and legal compliance.",
      whyItMatters: "Expert handling ensures smooth transactions and legal protection across borders."
    },
    {
      icon: TrendingUp,
      title: "Portfolio Scaling",
      description: "Strategic guidance for expanding and optimizing your real estate portfolio across multiple markets.",
      whyItMatters: "Systematic scaling builds long-term wealth and diversifies investment risk."
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">OUR COMMITMENT</span>
            <div className="w-8 h-0.5 bg-gold"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wider">
            END-TO-END INVESTMENT <span className="text-gold">SOLUTIONS</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Tailored solutions to investor needs and goals. All-in-one solution combining education, consultancy, and exclusive access.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {supports.map((support, index) => (
            <div key={index} className="bg-gray-900 p-8 rounded-lg hover:shadow-xl hover:shadow-gold/20 transition-all duration-300 group border border-gray-800">
              <div className="flex items-start space-x-6">
                <div className="w-16 h-16 bg-gradient-to-br from-[#85754E] to-gold rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <support.icon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-3">{support.title}</h3>
                  <p className="text-gray-300 leading-relaxed mb-4">{support.description}</p>
                  <div className="border-l-4 border-gold pl-4">
                    <p className="text-sm text-gold font-medium">Why it matters:</p>
                    <p className="text-sm text-gray-400 italic">{support.whyItMatters}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
