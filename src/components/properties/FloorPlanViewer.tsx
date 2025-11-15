import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";


// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

interface FloorPlanViewerProps {
  pdfUrls: string[];
  title?: string;
}

const FloorPlanViewer = ({ pdfUrls, title }: FloorPlanViewerProps) => {
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [baseScale, setBaseScale] = useState(0.5);
  const [zoomMultiplier, setZoomMultiplier] = useState(1.0);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasCalculatedScale = useRef(false);

  const scale = baseScale * zoomMultiplier;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
    hasCalculatedScale.current = false;
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("PDF loading error:", error);
  };

  const onPageLoadSuccess = (page: any) => {
    if (containerRef.current && !hasCalculatedScale.current) {
      const containerWidth = containerRef.current.clientWidth - 64;
      const containerHeight = containerRef.current.clientHeight - 64;
      const pageViewport = page.getViewport({ scale: 1 });
      
      const scaleWidth = containerWidth / pageViewport.width;
      const scaleHeight = containerHeight / pageViewport.height;
      const fitScale = Math.min(scaleWidth, scaleHeight, 1.5);
      
      setBaseScale(fitScale);
      hasCalculatedScale.current = true;
    }
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prev) => (prev - 1 + pdfUrls.length) % pdfUrls.length);
    setCurrentPage(1);
    setZoomMultiplier(1.0);
    hasCalculatedScale.current = false;
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prev) => (prev + 1) % pdfUrls.length);
    setCurrentPage(1);
    setZoomMultiplier(1.0);
    hasCalculatedScale.current = false;
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
    hasCalculatedScale.current = false;
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
    hasCalculatedScale.current = false;
  };

  const handleZoomIn = () => {
    setZoomMultiplier((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoomMultiplier((prev) => Math.max(0.2, prev - 0.2));
  };

  if (!pdfUrls || pdfUrls.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="text-muted-foreground">No floor plans available</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-background border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            disabled={zoomMultiplier <= 0.2}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
            {Math.round(zoomMultiplier * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={zoomMultiplier >= 3}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ZoomIn className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>

        {numPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[70px] sm:min-w-[80px] text-center">
              Page {currentPage} / {numPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        )}

        <div className="flex items-center gap-2">
          {pdfUrls.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handlePreviousPdf}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <span className="text-xs sm:text-sm font-medium min-w-[80px] sm:min-w-[100px] text-center">
                Plan {currentPdfIndex + 1} / {pdfUrls.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPdf}
                className="h-8 w-8 sm:h-9 sm:w-9"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={containerRef} className="flex-1 overflow-auto bg-background flex items-center justify-center p-2 sm:p-4 min-h-[600px]">
        <div className="transition-all duration-200 ease-out max-w-full">
          <Document
            file={pdfUrls[currentPdfIndex]}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={onDocumentLoadError}
            loading={
              <div className="flex items-center justify-center min-h-[600px]">
                <div className="text-foreground text-lg">Loading floor plan...</div>
              </div>
            }
            error={
              <div className="flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
                <div className="text-destructive mb-4 text-lg font-semibold">Failed to load floor plan</div>
                <div className="text-muted-foreground text-sm max-w-md">
                  Please check your connection and try again.
                </div>
              </div>
            }
          >
            <Page
              pageNumber={currentPage}
              scale={scale}
              onLoadSuccess={onPageLoadSuccess}
              renderTextLayer={false}
              renderAnnotationLayer={false}
              className="shadow-lg"
            />
          </Document>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanViewer;