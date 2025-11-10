import { useState } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PdfViewerProps {
  pdfUrls: string[];
  title?: string;
}

const PdfViewer = ({ pdfUrls, title }: PdfViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + pdfUrls.length) % pdfUrls.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % pdfUrls.length);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = pdfUrls[currentIndex];
    link.download = `${title || 'floor-plan'}-${currentIndex + 1}.pdf`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!pdfUrls || pdfUrls.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Navigation and controls */}
      <div className="flex items-center justify-between mb-4 bg-background/95 backdrop-blur p-3 rounded-lg border border-border">
        <div className="flex items-center gap-3">
          {pdfUrls.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevious}
                disabled={pdfUrls.length <= 1}
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[80px] text-center">
                {currentIndex + 1} / {pdfUrls.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNext}
                disabled={pdfUrls.length <= 1}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleDownload}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      </div>

      {/* PDF viewer */}
      <div className="w-full bg-background rounded-lg border border-border overflow-hidden">
        <embed
          src={pdfUrls[currentIndex]}
          type="application/pdf"
          className="w-full h-[600px] md:h-[700px] lg:h-[800px]"
          title={`${title || 'Floor Plan'} - Page ${currentIndex + 1}`}
        />
      </div>
    </div>
  );
};

export default PdfViewer;