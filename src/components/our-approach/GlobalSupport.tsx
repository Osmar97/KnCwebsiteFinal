
import { Globe, Headphones, ShoppingBag } from "lucide-react";

export const GlobalSupport = () => {
  const supports = [
    {
      icon: Globe,
      title: "End-to-End Solutions",
      description: "Complete real estate investment solutions from initial consultation to ongoing property management."
    },
    {
      icon: Headphones,
      title: "Customized Support",
      description: "Personalized assistance tailored to your unique investment goals and market preferences."
    },
    {
      icon: ShoppingBag,
      title: "One-Stop Shop",
      description: "All your real estate investment needs handled under one roof for maximum convenience and efficiency."
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-light text-[#85754E] mb-6 tracking-wider">
            GLOBAL <span className="text-gold">SUPPORT</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive support services available worldwide to ensure your investment success regardless of location.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {supports.map((support, index) => (
            <div key={index} className="text-center group">
              <div className="w-24 h-24 bg-gradient-to-br from-[#85754E] to-gold rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <support.icon className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-[#85754E] mb-4">{support.title}</h3>
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{support.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
