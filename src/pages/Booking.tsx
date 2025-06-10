
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { CheckCircle } from "lucide-react";

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wider">
                  Get in <span className="text-gold">Touch</span>
                </h1>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Ready to explore investment opportunities in Portugal? Contact us to discuss your specific needs and how we can help you achieve your goals.
                </p>
                
                <p className="text-gray-400 text-base">
                  We'll get back to you within 24 hours.
                </p>
              </div>

              {/* Meeting Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-black transform rotate-45"></div>
                  </div>
                  <h3 className="text-xl font-medium mb-4">Contact Kings 'n Company</h3>
                </div>

                <h4 className="text-lg font-medium mb-4 text-white">Perfect for you if:</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You're planning to <span className="text-white font-medium">buy, invest, or relocate</span> to Portugal
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You feel <span className="text-white font-medium">overwhelmed by the steps</span>, or don't know where to start
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You've been relying on <span className="text-white font-medium">luck, online listings, or word-of-mouth</span> with little progress
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You want <span className="text-white font-medium">expert support</span> to avoid costly mistakes and delays
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You value <span className="text-white font-medium">clarity, structure, and a trusted team</span> to guide your journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Contact Form */}
            <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
              <ContactForm />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
