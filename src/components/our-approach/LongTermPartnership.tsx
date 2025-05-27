
import { TrendingUp, Users, Shield } from "lucide-react";

export const LongTermPartnership = () => {
  const partnerships = [
    {
      icon: TrendingUp,
      title: "Sustained Growth",
      description: "Focus on long-term portfolio expansion and success, building wealth that compounds over time."
    },
    {
      icon: Users,
      title: "Legacy Planning",
      description: "Helping investors plan for generational wealth transfer and long-term family financial security."
    },
    {
      icon: Shield,
      title: "Trust and Transparency",
      description: "Integrity and trust-based relationships are core values that guide every interaction and decision."
    }
  ];

  const testimonial = {
    quote: "Kings 'n Company transformed our investment approach. Their expertise in European markets and personalized guidance helped us build a portfolio that will benefit our family for generations.",
    author: "Maria Santos",
    title: "Portfolio Investor",
    location: "Portugal"
  };

  return (
    <section className="py-20 bg-gradient-to-br from-[#85754E] to-gold text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-yellow-200"></div>
            <span className="text-yellow-200 text-sm tracking-widest font-light">OUR COMMITMENT</span>
            <div className="w-8 h-0.5 bg-yellow-200"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light mb-6 tracking-wider">
            SUSTAINED <span className="text-yellow-200">COLLABORATION</span>
          </h2>
          <p className="text-gray-100 text-lg max-w-3xl mx-auto">
            We believe in building lasting relationships that extend far beyond individual transactions, focusing on your long-term success and legacy.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {partnerships.map((partnership, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="w-16 h-16 bg-white/20 rounded-lg flex items-center justify-center mb-6">
                <partnership.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{partnership.title}</h3>
              <p className="text-gray-100 leading-relaxed">{partnership.description}</p>
            </div>
          ))}
        </div>

        {/* Testimonial Section */}
        <div className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="text-4xl text-yellow-200 mb-4">"</div>
            <p className="text-xl text-gray-100 italic leading-relaxed mb-6">
              {testimonial.quote}
            </p>
            <div className="border-t border-white/20 pt-6">
              <p className="font-semibold text-white">{testimonial.author}</p>
              <p className="text-yellow-200 text-sm">{testimonial.title} • {testimonial.location}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
