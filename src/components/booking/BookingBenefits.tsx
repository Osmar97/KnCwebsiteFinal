
import { CheckCircle } from "lucide-react";

interface BookingBenefitsProps {}

const BookingBenefits = ({}: BookingBenefitsProps) => {
  const benefits = [
    "You're planning to buy, invest, or relocate to Portugal",
    "You feel overwhelmed by the steps, or don't know where to start",
    "You've been relying on luck, online listings, or word-of-mouth with little progress",
    "You want expert support to avoid costly mistakes and delays",
    "You value clarity, structure, and a trusted team to guide your journey"
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">This call is for you if:</h2>
      
      <div className="space-y-4">
        {benefits.map((benefit, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-6 h-6 bg-gold rounded flex items-center justify-center flex-shrink-0 mt-0.5">
              <CheckCircle className="w-4 h-4 text-black" />
            </div>
            <p className="text-gray-300 leading-relaxed">
              {benefit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingBenefits;
