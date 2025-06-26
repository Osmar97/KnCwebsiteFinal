import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface MondayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  fileName: string;
  formId: string; // added formId prop
}

export const MondayFormModal = ({ isOpen, onClose, onFormSubmitted, fileName, formId }: MondayFormModalProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load monday forms script once
  useEffect(() => {
    if (!isOpen) return;
    const existing = document.querySelector('script[src="https://cdn.forms.monday.com/static/js/forms2.min.js"]');
    if (existing) {
      initForm();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://cdn.forms.monday.com/static/js/forms2.min.js';
    script.async = true;
    script.onload = initForm;
    document.body.appendChild(script);
    return () => {
      // keep the script for future reopens
    };
  }, [isOpen]);

  // Initialize monday forms embed
  const initForm = () => {
    setIsLoading(true);
    // @ts-ignore
    window.MondayForms2?.init({
      selector: '#monday-form-container',
      formId,
      onSubmit: () => {
        setIsFormSubmitted(true);
        onFormSubmitted();
        setTimeout(onClose, 2000);
      },
    });
    // Listen for embed-ready event
    document.addEventListener('mondayFormInit', () => {
      setIsLoading(false);
    });
  };

  const openFormInNewTab = () => {
    window.open(`https://forms.monday.com/forms/embed/${formId}`, '_blank');
    setTimeout(() => {
      setIsFormSubmitted(true);
      onFormSubmitted();
      setTimeout(onClose, 2000);
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-0">
          <DialogTitle className="text-gray-900">
            Complete the form to access: {fileName}
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>

        <div className="relative p-6">
          {isLoading && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <div className="text-gray-600">Loading form...</div>
              </div>
            </div>
          )}

          {isFormSubmitted && (
            <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-green-600 text-lg font-semibold mb-2">
                  ✅ Form Submitted Successfully!
                </div>
                <div className="text-gray-600">Processing your request...</div>
              </div>
            </div>
          )}

          <div id="monday-form-container" data-form-id={formId} className="min-h-[500px]" />

          {/* Fallback button */}
          <div className="mt-4 text-center">
            <Button onClick={openFormInNewTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Form in New Tab
            </Button>
            <div className="text-sm text-gray-500 mt-2">
              If the form doesn’t load above, click to open in a new tab.
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
