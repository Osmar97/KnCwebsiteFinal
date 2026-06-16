import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PreTourFormData } from "@/components/tour/PreTourFormModal";
import { logger } from "@/lib/logger";

/**
 * Encapsulates all submission flows used on the public Tour page:
 *  - Stripe checkout (reserve)
 *  - Private-tour enquiry modal
 *  - Inline forms (private / waitlist)
 */
export function useTourSubmissions() {
  const { toast } = useToast();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isSendingEnquiry, setIsSendingEnquiry] = useState(false);

  const handleCheckout = async (preTourData?: PreTourFormData): Promise<boolean> => {
    try {
      setIsCheckingOut(true);
      const { data, error } = await supabase.functions.invoke("create-stripe-checkout", {
        body: { origin: window.location.origin, preTourData },
      });
      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
        return true;
      }
      throw new Error("No checkout URL returned");
    } catch (error) {
      logger.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: "There was a problem initiating your checkout. Please try again or contact us.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleEnquiry = async (data: PreTourFormData): Promise<boolean> => {
    try {
      setIsSendingEnquiry(true);
      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: data });
      if (error) throw error;
      toast({
        title: "Request sent",
        description: "Thank you — we'll be in touch shortly to arrange your private tour.",
      });
      return true;
    } catch (error) {
      logger.error("Enquiry error:", error);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your request. Please try again or contact us directly.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSendingEnquiry(false);
    }
  };

  const submitInlineForm = async (
    payload: Record<string, unknown>,
    setLoading: (b: boolean) => void,
    setSubmitted: (b: boolean) => void,
  ) => {
    try {
      setLoading(true);
      const { error } = await supabase.functions.invoke("send-tour-enquiry", { body: payload });
      if (error) throw error;
      setSubmitted(true);
      toast({ title: "Request received", description: "Thank you — we'll be in touch shortly." });
    } catch (err) {
      logger.error("Inline form error:", err);
      toast({
        title: "Something went wrong",
        description: "We couldn't send your request. Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    isCheckingOut,
    isSendingEnquiry,
    handleCheckout,
    handleEnquiry,
    submitInlineForm,
  };
}
