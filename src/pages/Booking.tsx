
import { Calendar, Clock, Globe, CheckCircle } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CalendarBooking } from "@/components/CalendarBooking";

const Booking = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wider">
                  Schedule Your <span className="text-gold">Discovery Call</span>
                </h1>
                
                <p className="text-gray-300 text-lg leading-relaxed mb-4">
                  Choose a convenient time from our calendar and tell us about your business.
                  We'll customize our meeting to address your specific challenges.
                </p>
                
                <p className="text-gray-400 text-base">
                  Available Monday to Friday, 9 AM - 6 PM Lisbon time.
                </p>
              </div>

              {/* Meeting Info */}
              <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-8 border border-gray-700/50">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gold rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="w-8 h-8 bg-black transform rotate-45"></div>
                  </div>
                  <h3 className="text-xl font-medium mb-4">Discovery Call - Kings 'n Company</h3>
                  
                  <div className="flex items-center justify-center gap-6 text-sm text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>15 Minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      <span>Europe/Lisbon (GMT+1)</span>
                    </div>
                  </div>
                </div>

                <h4 className="text-lg font-medium mb-4 text-white">This call is for you if:</h4>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You’re planning to <span className="text-white font-medium">buy, invest, or relocate</span> to Portugal
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You feel <span className="text-white font-medium">overwhelmed by the steps</span>, or don’t know where to start
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You’ve been relying on <span className="text-white font-medium">luck, online listings, or word-of-mouth</span> with little progress
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

            {/* Right Side - Calendar Booking */}
            <div className="lg:col-span-2 bg-white text-black rounded-3xl p-8 shadow-2xl">
              <CalendarBooking />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Booking;
