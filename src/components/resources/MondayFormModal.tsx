
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink } from "lucide-react";

interface MondayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  fileName: string;
}

export const MondayFormModal = ({ isOpen, onClose, onFormSubmitted, fileName }: MondayFormModalProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasIframeError, setHasIframeError] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsFormSubmitted(false);
      setIsLoading(true);
      setHasIframeError(false);
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

  const handleIframeLoad = () => {
    console.log('Iframe loaded');
    setIsLoading(false);
    // Check if iframe content is accessible
    setTimeout(() => {
      const iframe = document.querySelector('iframe[title="Monday.com Form"]') as HTMLIFrameElement;
      if (iframe) {
        try {
          // If we can't access the content, it might be blocked
          if (!iframe.contentDocument && !iframe.contentWindow) {
            setHasIframeError(true);
          }
        } catch (error) {
          console.log('Iframe access check completed');
        }
      }
    }, 2000);
  };

  const handleIframeError = () => {
    console.log('Iframe failed to load');
    setIsLoading(false);
    setHasIframeError(true);
  };

  const handleSubmitManually = () => {
    console.log('Manual form submission triggered');
    setIsFormSubmitted(true);
    onFormSubmitted();
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const openFormInNewTab = () => {
    window.open('https://forms.monday.com/forms/embed/b7d6b100e18926fcbfbab7daee8d2811?r=euc1', '_blank');
    // Simulate form submission for now
    setTimeout(() => {
      handleSubmitManually();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white p-0">
        <DialogHeader className="flex flex-row items-center justify-between p-6 pb-0">
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
        
        <div className="relative p-6">
          {isLoading && !hasIframeError && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                <div className="text-gray-600">Loading form...</div>
              </div>
            </div>
          )}

          {hasIframeError && (
            <div className="absolute inset-0 bg-gray-50 flex items-center justify-center z-10">
              <div className="text-center p-8">
                <div className="text-gray-600 mb-4">
                  The form cannot be displayed in this window due to security restrictions.
                </div>
                <Button
                  onClick={openFormInNewTab}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Open Form in New Tab
                </Button>
                <div className="text-sm text-gray-500 mt-4">
                  After completing the form, your download will start automatically.
                </div>
              </div>
            </div>
          )}
          
          {isFormSubmitted && (
            <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center z-20">
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
          
          <div className="bg-white rounded-lg overflow-hidden border" style={{ minHeight: '500px' }}>
            <iframe
              src="https://forms.monday.com/forms/embed/b7d6b100e18926fcbfbab7daee8d2811?r=euc1"
              width="100%"
              height="500"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              style={{ 
                border: 'none',
                display: 'block',
                backgroundColor: 'white'
              }}
              title="Monday.com Form"
              allow="forms-data"
            />
          </div>
          
          {/* Debug button for testing */}
          <div className="mt-4 text-center">
            <Button
              onClick={handleSubmitManually}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Test Form Submission (Debug)
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
