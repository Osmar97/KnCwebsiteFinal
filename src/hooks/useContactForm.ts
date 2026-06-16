
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { logger } from "@/lib/logger";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    e: React.FormEvent,
    onSuccess?: () => void,
    overrides?: Partial<typeof formData>,
  ) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = { ...formData, ...overrides };
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: payload,
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for your message! We'll get back to you within 24 hours.",
      });

      // Reset form and call success callback
      setFormData({ name: "", email: "", subject: "", message: "" });
      onSuccess?.();
    } catch (error) {
      logger.error("Error sending email:", error);
      toast({
        title: "Failed to Send Message",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    isSubmitting,
    handleSubmit,
    handleInputChange
  };
};
