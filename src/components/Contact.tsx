
import { ContactFormStandalone } from "./ContactFormStandalone";

export const Contact = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-black relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl md:text-6xl font-light text-white mb-6 sm:mb-8 tracking-wider">
            GET IN <span className="text-gold">TOUCH</span>
          </h1>
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-6 sm:mb-8"></div>
          <p className="text-gray-300 text-lg sm:text-xl max-w-3xl mx-auto font-light leading-relaxed">
            Ready to explore real estate opportunities in Portugal and West Africa? 
            Let's discuss how we can help you achieve your investment goals.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-2xl">
            <ContactFormStandalone />
          </div>
        </div>
      </div>
    </section>
  );
};
