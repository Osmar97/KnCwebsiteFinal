import { useState, useEffect } from "react";
import { openInNewTab } from "@/lib/openLink";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, ExternalLink, Download } from "lucide-react";

interface MondayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFormSubmitted: () => void;
  fileName: string;
  fileUrls: string[]; // Array of all file URLs to download
}

export const MondayFormModal = ({ isOpen, onClose, onFormSubmitted, fileName, fileUrls }: MondayFormModalProps) => {
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDownloadButton, setShowDownloadButton] = useState(false);
  const [autoDownloadAttempted, setAutoDownloadAttempted] = useState(false);
  
  // Use direct iframe approach
  const formUrl = `https://forms.monday.com/forms/embed/b7d6b100e18926fcbfbab7daee8d2811?r=euc1`;
  
  useEffect(() => {
    if (!isOpen) {
      // Reset states when modal closes
      setIsFormSubmitted(false);
      setShowDownloadButton(false);
      setAutoDownloadAttempted(false);
    }
  }, [isOpen]);

  useEffect(() => {
    // Listen for messages from the iframe
    const handleMessage = (event: MessageEvent) => {
      // Check if message is from Monday.com form
      if (event.origin.includes('monday.com') || event.data?.type === 'form_submitted') {
        handleFormSubmission();
      }
    };

    if (isOpen) {
      window.addEventListener('message', handleMessage);
    }

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isOpen]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
  };

  const downloadAllFiles = () => {
    fileUrls.forEach((url, index) => {
      setTimeout(() => {
        const fileName = url.split('/').pop() || `document_${index + 1}.pdf`;
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }, index * 500); // Stagger downloads by 500ms
    });
  };

  const handleFormSubmission = () => {
    setIsFormSubmitted(true);
    onFormSubmitted();
    
    if (!autoDownloadAttempted) {
      setAutoDownloadAttempted(true);
      // Attempt automatic download
      setTimeout(() => {
        downloadAllFiles();
        // Show fallback button after 3 seconds if user needs to manually download
        setTimeout(() => {
          setShowDownloadButton(true);
        }, 3000);
      }, 1000);
    }
  };

  // Manual form submission trigger for testing/fallback
  const handleManualSubmission = () => {
    handleFormSubmission();
  };

  const openFormInNewTab = (fallbackMessage?: string) => {
    openInNewTab(formUrl, { fallbackMessage });
    // Since we can't detect submission in new tab, show download button after delay
    setTimeout(() => {
      setIsFormSubmitted(true);
      onFormSubmitted();
      setShowDownloadButton(true);
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-white p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-gray-900">
            Complete the form to access: {fileName}
          </DialogTitle>
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

          {isFormSubmitted && !showDownloadButton && (
            <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-green-600 text-lg font-semibold mb-2">
                  ✅ Form Submitted Successfully!
                </div>
                <div className="text-gray-600">Starting download automatically...</div>
              </div>
            </div>
          )}

          {isFormSubmitted && showDownloadButton && (
            <div className="absolute inset-0 bg-green-50 border border-green-200 rounded-lg flex items-center justify-center z-20">
              <div className="text-center">
                <div className="text-green-600 text-lg font-semibold mb-4">
                  ✅ Form Submitted Successfully!
                </div>
                <div className="text-gray-600 mb-4">
                  If your download didn't start automatically, click below:
                </div>
                <Button 
                  onClick={downloadAllFiles}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Files
                </Button>
              </div>
            </div>
          )}

          <iframe
            src={formUrl}
            width="100%"
            height="500"
            style={{ border: 0, borderRadius: '8px' }}
            title="Monday.com Form"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className="min-h-[500px]"
          />

          <div className="mt-4 text-center space-y-2">
            <Button onClick={openFormInNewTab} className="bg-blue-600 hover:bg-blue-700 text-white">
              <ExternalLink className="w-4 h-4 mr-2" />
              Open Form in New Tab
            </Button>
            <div className="text-sm text-gray-500">
              If the form doesn't load above, click to open in a new tab.
            </div>
            
            {/* Test button for development - remove in production */}
            <Button 
              onClick={handleManualSubmission}
              variant="outline"
              className="ml-2 text-xs"
            >
              Test Form Submission
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};