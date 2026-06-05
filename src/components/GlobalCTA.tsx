import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

export const GlobalCTA = () => {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="bg-gradient-to-r from-[#85754E] to-gold p-8 md:p-12 rounded-2xl text-white max-w-4xl mx-auto shadow-2xl relative overflow-hidden group">
            {/* Background shimmer effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
            
            <div className="relative z-10">
              <h3 className="text-2xl md:text-4xl font-light tracking-wide mb-4">
                Ready to Begin Your <span className="font-semibold">Investment Journey?</span>
              </h3>
              <p className="text-white/90 text-lg md:text-xl mb-8 font-light max-w-2xl mx-auto">
                Join our exclusive network and gain access to premium European and West African property opportunities.
              </p>
              
              <a 
                href="https://form.jotform.com/241827522878366"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-white text-[#85754E] px-8 py-4 rounded-xl font-medium tracking-wide group/btn hover:bg-gray-50 hover:-translate-y-1 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] transition-all duration-400 ease-out cursor-pointer"
              >
                <span>Start Your Journey</span>
                <div className="w-8 h-8 rounded-full bg-[#85754E]/10 flex items-center justify-center group-hover/btn:bg-[#85754E] transition-colors duration-400">
                  <ArrowUpRight className="w-4 h-4 text-[#85754E] group-hover/btn:text-white transition-colors duration-400" />
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
