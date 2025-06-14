
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export const useContactForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent, onSuccess?: () => void) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with form data automatically addressed to services@kingsncompany.com
      const recipientEmail = "services@kingsncompany.com";
      const mailtoLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\n\nMessage:\n${formData.message}`)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      toast({
        title: "Email Client Opened",
        description: "Your email client should now open with the pre-filled message addressed to services@kingsncompany.com.",
      });

      // Reset form and call success callback
      setFormData({ name: "", subject: "", message: "" });
      onSuccess?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open email client. Please try again.",
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
