
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useScrollToTop } from "@/hooks/useScrollToTop";
import BookingHeader from "@/components/booking/BookingHeader";
import BookingBenefits from "@/components/booking/BookingBenefits";
import BookingWidget from "@/components/booking/BookingWidget";

const BookingForm = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header Section */}
          <BookingHeader />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            
            {/* Left Side - Information */}
            <div className="space-y-8">
              <BookingBenefits />
            </div>

            {/* Right Side - Booking Widget */}
            <BookingWidget />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BookingForm;
