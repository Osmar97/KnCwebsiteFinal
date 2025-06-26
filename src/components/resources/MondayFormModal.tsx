
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface MondayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  fileName: string;
}

export const MondayFormModal = ({ isOpen, onClose, onFormSubmitted, fileName }: MondayFormModalProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFormSubmitted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for messages from the Monday.com iframe
    const handleMessage = (event: MessageEvent) => {
      console.log('Received message:', event.data, 'from origin:', event.origin);
      
      // Check if the message is from Monday.com form
      if (event.origin.includes('monday.com') || 
          event.data?.type === 'form-submitted' ||
          event.data?.action === 'submit' ||
          typeof event.data === 'string' && event.data.includes('submit')) {
        console.log('Form submitted successfully');
        setIsFormSubmitted(true);
        onFormSubmitted();
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleMessage);
    }
    
    return () => window.removeEventListener('message', handleMessage);
  }, [onFormSubmitted, onClose, isOpen]);

  const handleSubmitManually = () => {
    console.log('Manual form submission triggered');
    setIsFormSubmitted(true);
    onFormSubmitted();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="text-gray-900">
            Complete the form to access: {fileName}
          </DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-4 h-4" />
          </Button>
        </DialogHeader>
        
        <div className="relative">
          {isFormSubmitted && (
            <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-green-600 text-lg font-semibold mb-2">
                  ✅ Form Submitted Successfully!
                </div>
                <div className="text-gray-600">
                  Processing your request...
                </div>
              </div>
            </div>
          )}
          
          <iframe
            src="https://forms.monday.com/forms/embed/b7d6b100e18926fcbfbab7daee8d2811?r=euc1"
            width="100%"
            height="500"
            style={{ 
              border: 0, 
              boxShadow: '5px 5px 56px 0px rgba(0,0,0,0.25)',
              borderRadius: '8px'
            }}
            title="Monday.com Form"
          />
          
          {/* Debug button for testing */}
          <div className="mt-4 text-center">
            <Button
              onClick={handleSubmitManually}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Test Form Submission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
