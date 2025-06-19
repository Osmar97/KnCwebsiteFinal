
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingFormFieldsProps {
  formData: {
    name: string;
    email: string;
    company: string;
    phone: string;
  };
  onInputChange: (field: string, value: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isFormValid: boolean;
}

const BookingFormFields = ({ 
  formData, 
  onInputChange, 
  onSubmit, 
  isSubmitting, 
  isFormValid 
}: BookingFormFieldsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
        <Input
          id="name"
          type="text"
          value={formData.name}
          onChange={(e) => onInputChange('name', e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => onInputChange('email', e.target.value)}
          className="mt-1"
          required
        />
      </div>

      <div>
        <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => onInputChange('phone', e.target.value)}
          className="mt-1"
        />
      </div>

      <Button 
        onClick={onSubmit}
        disabled={isSubmitting || !isFormValid}
        className="w-full bg-gold hover:bg-gold-dark text-black py-3 text-lg font-semibold"
      >
        {isSubmitting ? "Booking..." : "Book Your Discovery Call"}
      </Button>
    </div>
  );
};

export default BookingFormFields;
