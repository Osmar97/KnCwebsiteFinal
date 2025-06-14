
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mail, Send, X } from "lucide-react";
import { useContactForm } from "@/hooks/useContactForm";

interface ContactFormDialogProps {
  children: React.ReactNode;
}

export const ContactFormDialog = ({ children }: ContactFormDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { formData, isSubmitting, handleSubmit, handleInputChange } = useContactForm();

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, () => setIsOpen(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 text-white max-w-[95vw] sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-gold text-lg sm:text-xl font-light tracking-wider flex items-center gap-3">
            <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
            Contact Us
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label htmlFor="name" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Name
            </label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white focus:border-gold h-10 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white focus:border-gold h-10 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white focus:border-gold h-10 text-sm"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-xs sm:text-sm font-medium text-gray-300 mb-2">
              Message
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="bg-gray-800 border-gray-600 text-white focus:border-gold min-h-[80px] sm:min-h-[100px] resize-none text-sm"
              required
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-full sm:flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 h-10 text-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gold hover:bg-gold/90 text-black font-medium h-10 text-sm"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Sending..." : "Send"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
