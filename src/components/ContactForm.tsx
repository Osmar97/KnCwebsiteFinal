import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Send, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContactFormProps {
  children?: React.ReactNode;
}

export const ContactForm = ({ children }: ContactFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create mailto link with form data
      const mailtoLink = `mailto:services@kingsncompany.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(`Name: ${formData.name}\n\nMessage:\n${formData.message}`)}`;
      
      // Open email client
      window.location.href = mailtoLink;
      
      toast({
        title: "Email Client Opened",
        description: "Your email client should now open with the pre-filled message.",
      });

      // Reset form and close dialog
      setFormData({ name: "", subject: "", message: "" });
      setIsOpen(false);
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

  // If children are provided, render as a dialog trigger
  if (children) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
        <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-gold text-xl font-light tracking-wider flex items-center gap-3">
              <Mail className="w-5 h-5" />
              Contact Us
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold min-h-[100px]"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium"
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  }

  // Otherwise render as a standalone form
  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Mail className="w-6 h-6 text-gold" />
          <h2 className="text-2xl font-light tracking-wider text-gray-900">
            Contact Us
          </h2>
        </div>
        <p className="text-gray-600">
          Fill out the form below and we'll get back to you within 24 hours.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name *
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            className="w-full"
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
            className="w-full"
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
            className="w-full min-h-[120px]"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold hover:bg-gold/90 text-black font-medium py-3"
        >
          <Send className="w-4 h-4 mr-2" />
          {isSubmitting ? "Sending..." : "Send Message"}
        </Button>
      </form>
    </div>
  );
};
