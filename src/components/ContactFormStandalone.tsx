
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Send } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";

export const ContactFormStandalone = () => {
  const { formData, isSubmitting, handleSubmit, handleInputChange } = useContactForm();

  return (
    <div className="px-4 sm:px-0">
      <div className="text-center mb-6 sm:mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-gold" />
          <h2 className="text-xl sm:text-2xl font-light tracking-wider text-gray-900">
            Contact Us
          </h2>
        </div>
        <p className="text-gray-600 text-sm sm:text-base px-4">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full h-10 sm:h-auto"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className="w-full h-10 sm:h-auto"
            required
          />
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject *
          </label>
          <Input
            id="subject"
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange("subject", e.target.value)}
            className="w-full h-10 sm:h-auto"
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message *
          </label>
          <Textarea
            id="message"
            value={formData.message}
            onChange={(e) => handleInputChange("message", e.target.value)}
            className="w-full min-h-[100px] sm:min-h-[120px] resize-none"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-3 h-12 text-sm sm:text-base"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};
