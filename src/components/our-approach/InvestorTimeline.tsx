
import { Users, Search, FileText, Handshake, Settings, TrendingUp } from "lucide-react";

export const InvestorTimeline = () => {
  const steps = [
    {
      icon: Users,
      title: "Join Our Network",
      description: "Discovery call, initial consultation, partnership agreement, gaining access to investor network.",
      duration: "Day 1-7"
    },
    {
      icon: Search,
      title: "Property Search",
      description: "Market analysis, exclusive property access, on-site/virtual visits, specific market studies.",
      duration: "Week 2-4"
    },
    {
      icon: FileText,
      title: "Due Diligence",
      description: "Legal and financial reviews, risk assessment, feasibility studies, comprehensive analysis.",
      duration: "Week 5-6"
    },
    {
      icon: Handshake,
      title: "Transaction",
      description: "Negotiation, contract management, financing setup, final closing and ownership transfer.",
      duration: "Week 7-8"
    },
    {
      icon: Settings,
      title: "Management",
      description: "Renovation and resale oversight, marketing and leasing, team placement, performance monitoring.",
      duration: "Week 9+"
    },
    {
      icon: TrendingUp,
      title: "Grow & Excel",
      description: "Reinvesting profits, portfolio optimization, continuous support, scaling your investments.",
      duration: "Ongoing"
    }
  ];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wider">
            OUR 6-STEP <span className="text-gold">INVESTOR JOURNEY</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            A proven timeline that guides you from initial contact to successful property ownership and portfolio growth.
          </p>
        </div>

        {/* Desktop Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-[#85754E] via-gold to-[#85754E] transform -translate-y-1/2"></div>
            
            <div className="flex justify-between items-center relative">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col items-center relative z-10 bg-black px-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center mb-4 shadow-lg">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-center max-w-xs">
                    <h3 className="font-semibold text-white mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{step.description}</p>
                    <span className="text-xs text-gold font-medium">{step.duration}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center flex-shrink-0">
                <step.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{step.title}</h3>
                  <span className="text-sm text-gold font-medium">{step.duration}</span>
                </div>
                <p className="text-gray-300 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-[#85754E] to-gold p-8 rounded-xl text-white">
            <h3 className="text-2xl font-semibold mb-4">Ready to Begin Your Investment Journey?</h3>
            <p className="text-gray-100 mb-6">Join our exclusive network and gain access to premium European and West African property opportunities.</p>
            <a 
              href="https://form.jotform.com/241827522878366"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-white text-[#85754E] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300"
            >
              Start Your Journey
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
