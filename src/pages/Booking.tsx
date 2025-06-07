
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
                      <span>60 Minutes</span>
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
                      You're a <span className="text-white font-medium">B2B Company</span> making over <span className="text-white font-medium">500k/Year</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You rely heavily on <span className="text-white font-medium">word of mouth</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      You lack <span className="text-white font-medium">growth predictability</span>
                    </p>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <p className="text-gray-300 text-sm">
                      Your <span className="text-white font-medium">sales department is underperforming</span>
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
