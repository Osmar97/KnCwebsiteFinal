
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useContactForm } from "@/hooks/useContactForm";
import { Send, X, Mail } from "lucide-react";

export const ContactEmailDialog = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const { formData, isSubmitting, handleSubmit, handleInputChange } = useContactForm();

  // Custom validation to make only email, name, and message required
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // simple client validation
    const newErrors: typeof errors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSubmit(e, () => setOpen(false));
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-[#222328] to-[#151517] border border-gray-700 text-white max-w-[95vw] sm:max-w-md mx-4">
        <DialogHeader>
          <DialogTitle className="text-gold text-lg font-light flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact by Email
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4 pt-2">
          <div>
            <label htmlFor="dialog-name" className="block text-xs font-medium text-gray-300 mb-1">
              Name<span className="text-gold">*</span>
            </label>
            <Input
              id="dialog-name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-gold h-10 text-sm"
              required
            />
            {errors.name && <div className="text-destructive text-xs mt-1">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="dialog-email" className="block text-xs font-medium text-gray-300 mb-1">
              Email<span className="text-gold">*</span>
            </label>
            <Input
              id="dialog-email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-gold h-10 text-sm"
              required
            />
            {errors.email && <div className="text-destructive text-xs mt-1">{errors.email}</div>}
          </div>
          <div>
            <label htmlFor="dialog-subject" className="block text-xs font-medium text-gray-300 mb-1">
              Subject <span className="text-muted-foreground">(optional)</span>
            </label>
            <Input
              id="dialog-subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-gold h-10 text-sm"
              // not required
            />
          </div>
          <div>
            <label htmlFor="dialog-message" className="block text-xs font-medium text-gray-300 mb-1">
              Message<span className="text-gold">*</span>
            </label>
            <Textarea
              id="dialog-message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="bg-gray-800 border-gray-700 text-white focus:border-gold min-h-[80px] resize-none text-sm"
              required
            />
            {errors.message && <div className="text-destructive text-xs mt-1">{errors.message}</div>}
          </div>
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1 border-gray-600 text-gray-300 h-10 text-sm"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-gold hover:bg-gold/90 text-black font-medium h-10 text-sm"
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
