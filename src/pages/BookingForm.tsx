
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CheckCircle, Clock, Calendar, Globe, List } from "lucide-react";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useState } from "react";
import TimeSlotPicker from "@/components/TimeSlotPicker";
import BookingFormFields from "@/components/BookingFormFields";
import { useBooking } from "@/hooks/useBooking";

const BookingForm = () => {
  useScrollToTop();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: ""
  });

  const { isSubmitting, submitBooking } = useBooking();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isFormValid = formData.name && formData.email && formData.company && selectedDate && selectedTime;

  const handleSubmit = async () => {
    if (!isFormValid) return;

    const success = await submitBooking({
      ...formData,
      selectedDate: selectedDate!,
      selectedTime
    });

    if (success) {
      // Reset form
      setFormData({ name: "", email: "", company: "", phone: "" });
      setSelectedTime("");
      setSelectedDate(new Date());
    }
  };

  // Filter out weekends and past dates
  const isDateDisabled = (date: Date) => {
    const day = date.getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Disable weekends (Sunday = 0, Saturday = 6) and past dates
    return day === 0 || day === 6 || date < today;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-block px-6 py-2 border border-gold rounded-full text-gold text-sm mb-6">
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
                    <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You're planning to buy, invest, or relocate to Portugal
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You feel overwhelmed by the steps, or don't know where to start
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You've been relying on luck, online listings, or word-of-mouth with little progress
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You want expert support to avoid costly mistakes and delays
                    </p>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle className="w-4 h-4 text-black" />
                    </div>
                    <p className="text-gray-300 leading-relaxed">
                      You value clarity, structure, and a trusted team to guide your journey
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Booking Widget */}
            <div className="bg-white text-black rounded-2xl p-6 shadow-2xl">
              
              {/* Meeting Details */}
              <div className="mb-6">
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Clock className="w-4 h-4" />
                  <span>60 Minutes</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Calendar className="w-4 h-4" />
                  <span>Available Monday - Friday</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm mb-2">
                  <Globe className="w-4 h-4" />
                  <span>Europe/Lisbon (GMT+1)</span>
                </div>
                <div className="flex items-start gap-3 text-gray-600 text-sm">
                  <List className="w-4 h-4 mt-0.5" />
                  <div>
                    <p>In this introductory meeting, we will delve into your Portugal investment or relocation goals and understand your specific needs.</p>
                  </div>
                </div>
              </div>

              {/* Calendar */}
              <div className="mb-6">
                <h3 className="font-medium mb-3 text-center">Select a Date</h3>
                <div className="flex justify-center">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={isDateDisabled}
                    className="w-auto"
                  />
                </div>
              </div>

              {/* Time Slots */}
              <div className="mb-6">
                <TimeSlotPicker 
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onTimeSelect={setSelectedTime}
                />
              </div>

              {/* Booking Form */}
              <BookingFormFields
                formData={formData}
                onInputChange={handleInputChange}
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
                isFormValid={!!isFormValid}
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingForm;
