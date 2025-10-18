import { ContactFormDialog } from "@/components/ContactFormDialog";
import { ContactFormStandalone } from "@/components/ContactFormStandalone";

interface ContactFormProps {
  children?: React.ReactNode;
}

export const ContactForm = ({ children }: ContactFormProps) => {
  // If children are provided, render as a dialog trigger
  if (children) {
    return <ContactFormDialog>{children}</ContactFormDialog>;
  }

  // Otherwise render as a standalone form
  return <ContactFormStandalone />;
};
