
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle, Clock, Calendar, Globe, List } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";

const BookingForm = () => {
  useScrollToTop();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 border border-purple-400 rounded-full text-purple-300 text-sm mb-6">
              GET STARTED
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Tell Us More About Your Business
            </h1>
            <p className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto">
              Before booking a demo call, fill in the form with your company's info
              so we can curate the perfect fit.
            </p>
            <p className="text-gray-400">
              We'll get back to you ASAP to confirm our meeting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left Side - Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">This call is for you if:</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You're a <span className="text-white font-semibold">B2B Company</span> making over <span className="text-white font-semibold">500k/Year</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You rely heavily on <span className="text-white font-semibold">word of mouth</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You set goals but don't know how to reach them, aka, <span className="text-white font-semibold">lack growth predictability</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      Your <span className="text-white font-semibold">sales department is underperforming</span>
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You <span className="text-white font-semibold">lack standardized processes</span> for your company's growth
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Calendar Widget */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-2xl">
              
              {/* Meeting Details */}
              <div className="mb-6">
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>60 Minutes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Seg, 16 De Jun De 2025</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Europe/Lisbon (GMT+1)</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600 text-sm">
                  <List className="w-4 h-4 mt-0.5" />
                  <div>
                    <p>Nesta reunião introdutória, vamos aprofundar as dores do voss</p>
                    <p>o departamento comercial e perceber os verdadeiros obstác...</p>
                    <button className="text-purple-600 text-sm mt-1">Mostrar mais</button>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    ←
                  </button>
                  <h3 className="font-semibold">Junho 2025</h3>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    →
                  </button>
                </div>
                
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="w-full"
                />
              </div>

              {/* Book Call Button */}
              <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg font-semibold">
                Book Your Call
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingForm;
