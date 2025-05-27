
import { CheckCircle } from "lucide-react";

export const TimelineProcess = () => {
  const steps = [
    {
      phase: "Phase 1",
      title: "Join the Network",
      description: "Begin your journey by joining our exclusive real estate investment network and gaining access to our resources.",
      duration: "Day 1"
    },
    {
      phase: "Phase 2", 
      title: "Initial Consultation",
      description: "Comprehensive assessment of your financial goals, risk tolerance, and investment preferences.",
      duration: "Week 1"
    },
    {
      phase: "Phase 3",
      title: "Strategy Development",
      description: "Creation of your personalized investment strategy and portfolio roadmap.",
      duration: "Week 2-3"
    },
    {
      phase: "Phase 4",
      title: "Property Selection",
      description: "Identification and evaluation of investment opportunities that align with your strategy.",
      duration: "Week 4-8"
    },
    {
      phase: "Phase 5",
      title: "Due Diligence",
      description: "Thorough analysis and verification of selected properties including financial and legal review.",
      duration: "Week 9-10"
    },
    {
      phase: "Phase 6",
      title: "Acquisition",
      description: "Complete the purchase process with our guidance through negotiations, financing, and closing.",
      duration: "Week 11-12"
    },
    {
      phase: "Phase 7",
      title: "Management",
      description: "Ongoing property management and portfolio optimization to maximize your returns.",
      duration: "Ongoing"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            OUR <span className="text-gold">PROCESS</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            A proven step-by-step process that guides you from initial consultation to successful property ownership and beyond.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-gradient-to-b from-[#85754E] to-gold h-full hidden lg:block"></div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={index} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                {/* Content */}
                <div className={`lg:w-1/2 ${index % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:text-left lg:pl-12'}`}>
                  <div className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="text-gold text-sm font-medium mb-2">{step.phase}</div>
                    <h3 className="text-xl font-semibold text-[#85754E] mb-3">{step.title}</h3>
                    <p className="text-gray-600 mb-4">{step.description}</p>
                    <div className="text-sm text-gold font-medium">{step.duration}</div>
                  </div>
                </div>

                {/* Timeline dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Spacer for alternating layout */}
                <div className="lg:w-1/2 hidden lg:block"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
