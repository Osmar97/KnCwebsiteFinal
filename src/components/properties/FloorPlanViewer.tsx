import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface FloorPlanViewerProps {
  pdfUrls: string[];
  title?: string;
}

const FloorPlanViewer = ({ pdfUrls, title }: FloorPlanViewerProps) => {
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [baseScale, setBaseScale] = useState(1.0);
  const [zoomMultiplier, setZoomMultiplier] = useState(1.0);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const scale = baseScale * zoomMultiplier;

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setCurrentPage(1);
  };

  const onPageLoadSuccess = (page: any) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth - 32; // padding
      const containerHeight = containerRef.current.clientHeight - 32;
      const pageViewport = page.getViewport({ scale: 1 });
      
      // Calculate scale to fit both width and height
      const scaleWidth = containerWidth / pageViewport.width;
      const scaleHeight = containerHeight / pageViewport.height;
      const fitScale = Math.min(scaleWidth, scaleHeight, 2); // Max scale of 2
      
      setBaseScale(fitScale);
      setPageWidth(containerWidth);
    }
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prev) => (prev - 1 + pdfUrls.length) % pdfUrls.length);
    setCurrentPage(1);
    setZoomMultiplier(1.0);
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prev) => (prev + 1) % pdfUrls.length);
    setCurrentPage(1);
    setZoomMultiplier(1.0);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  };

  const handleZoomIn = () => {
    setZoomMultiplier((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setZoomMultiplier((prev) => Math.max(1.0, prev - 0.2));
  };

  if (!pdfUrls || pdfUrls.length === 0) {
    return null;
  }

  return (
    <div className="w-full h-full flex flex-col bg-background">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-background border-b border-border">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomOut}
            className="h-9 w-9"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            className="h-9 w-9"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>

        {numPages > 1 && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePreviousPage}
              disabled={currentPage <= 1}
              className="h-9 w-9"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[80px] text-center">
              Page {currentPage} / {numPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={handleNextPage}
              disabled={currentPage >= numPages}
              className="h-9 w-9"
            >
              <ChevronRight className="h-4 w-4" />
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
                className="h-9 w-9"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium min-w-[100px] text-center">
                Plan {currentPdfIndex + 1} / {pdfUrls.length}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={handleNextPdf}
                className="h-9 w-9"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={containerRef} className="flex-1 overflow-hidden bg-muted/20 flex items-center justify-center p-4">
        <Document
          file={pdfUrls[currentPdfIndex]}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-muted-foreground">Loading floor plan...</div>
            </div>
          }
          error={
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="text-destructive">Failed to load floor plan</div>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            width={pageWidth || undefined}
            onLoadSuccess={onPageLoadSuccess}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            className="max-w-full h-auto"
          />
        </Document>
      </div>
    </div>
  );
};

export default FloorPlanViewer;