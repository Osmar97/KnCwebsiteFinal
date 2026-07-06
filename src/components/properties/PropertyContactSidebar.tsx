import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useContactForm } from "@/hooks/useContactForm";
import { formatNumber } from "@/lib/formatPrice";

interface Props {
  propertyTitle?: string;
  propertyLocation?: string;
  propertyCity?: string;
  propertyPrice?: number;
}

export const PropertyContactSidebar = ({
  propertyTitle,
  propertyLocation,
  propertyCity,
  propertyPrice,
}: Props) => {
  const [phone, setPhone] = useState("");
  const {
    formData,
    isSubmitting,
    handleInputChange,
    handleSubmit,
  } = useContactForm();

  const onSubmit = (e: React.FormEvent) => {
    const subject = `Property Inquiry: ${propertyTitle || "Property"}`;
    const message = `Phone: ${phone}\n\nProperty: ${propertyTitle}\nLocation: ${propertyLocation}, ${propertyCity}\nPrice: ${formatNumber(propertyPrice || 0)}€\n\n${formData.message}`;
    handleSubmit(e, () => setPhone(""), { subject, message });
  };

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gold">Would you like to know more?</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <Input
          type="email"
          placeholder="Email *"
          required
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]"
        />
        <Input
          type="text"
          placeholder="Name *"
          required
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]"
        />
        <Input
          type="tel"
          placeholder="Phone *"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]"
        />
        <Textarea
          placeholder="Message"
          rows={4}
          value={formData.message}
          onChange={(e) => handleInputChange("message", e.target.value)}
          className="bg-black border-gray-800 text-white placeholder:text-gray-500"
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-black hover:bg-gold-light disabled:opacity-50 min-h-[44px]"
        >
          {isSubmitting ? "Sending..." : "Contact us"}
        </Button>
      </form>
      <p className="text-xs text-gray-500 mt-4">
        By requesting information, you agree to our Privacy Policy and Terms of Service.
      </p>
    </div>
  );
};