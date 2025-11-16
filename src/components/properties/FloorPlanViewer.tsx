import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import { useRef, useState, useEffect, useMemo } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Import PDF.js worker using Vite-friendly URL import:
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.min.js?url";
pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface FloorPlanViewerProps {
  pdfUrls: string[];
  title?: string;
}

const FloorPlanViewer = ({ pdfUrls, title }: FloorPlanViewerProps) => {
  const [currentPdfIndex, setCurrentPdfIndex] = useState(0);
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Memoized PDF.js options
  const options = useMemo(() => ({
    cMapUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/standard_fonts/`,
  }), []);

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth - 32;
        console.log('Container width updated:', width);
        setContainerWidth(width > 0 ? width : 800);
      }
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    console.log('🔍 FloorPlanViewer - useEffect triggered');
    console.log('  - pdfUrls:', pdfUrls);
    console.log('  - pdfUrls type:', typeof pdfUrls);
    console.log('  - pdfUrls is array:', Array.isArray(pdfUrls));
    console.log('  - pdfUrls length:', pdfUrls?.length);
    console.log('  - currentPdfIndex:', currentPdfIndex);
    console.log('  - Current PDF URL:', pdfUrls[currentPdfIndex]);
    console.log('  - URL type:', typeof pdfUrls[currentPdfIndex]);
    
    // Test if URL is accessible
    const testUrl = pdfUrls[currentPdfIndex];
    if (testUrl && typeof testUrl === 'string') {
      console.log('🌐 Testing PDF URL accessibility...');
      fetch(testUrl, { method: 'HEAD' })
        .then(response => {
          console.log('  ✅ PDF URL accessible, status:', response.status);
          console.log('  - Content-Type:', response.headers.get('content-type'));
          console.log('  - Content-Length:', response.headers.get('content-length'));
        })
        .catch(err => {
          console.error('  ❌ PDF URL not accessible:', err);
        });
    } else {
      console.error('  ❌ Invalid URL:', testUrl);
    }
    
    setIsLoading(true);
    setError(null);
    setNumPages(0);
  }, [pdfUrls, currentPdfIndex]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    console.log('✅✅✅ PDF LOADED SUCCESSFULLY! ✅✅✅');
    console.log('  - Number of pages:', numPages);
    console.log('  - PDF URL:', pdfUrls[currentPdfIndex]);
    setNumPages(numPages);
    setCurrentPage(1);
    setIsLoading(false);
    setError(null);
  };

  const onDocumentLoadError = (error: Error) => {
    console.error("❌❌❌ PDF LOADING ERROR! ❌❌❌");
    console.error("  - Error:", error);
    console.error("  - Error message:", error.message);
    console.error("  - Error stack:", error.stack);
    console.error("  - Failed PDF URL:", pdfUrls[currentPdfIndex]);
    setIsLoading(false);
    setError(`Failed to load PDF: ${error.message}`);
  };

  const handlePreviousPdf = () => {
    setCurrentPdfIndex((prev) => (prev - 1 + pdfUrls.length) % pdfUrls.length);
    setCurrentPage(1);
    setScale(1.0);
  };

  const handleNextPdf = () => {
    setCurrentPdfIndex((prev) => (prev + 1) % pdfUrls.length);
    setCurrentPage(1);
    setScale(1.0);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(numPages, prev + 1));
  };

  const handleZoomIn = () => {
    setScale((prev) => Math.min(3, prev + 0.2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(0.5, prev - 0.2));
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
            disabled={scale <= 0.5}
            className="h-8 w-8 sm:h-9 sm:w-9"
          >
            <ZoomOut className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
          <span className="text-xs sm:text-sm font-medium min-w-[50px] sm:min-w-[60px] text-center">
            {Math.round(scale * 100)}%
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={handleZoomIn}
            disabled={scale >= 3}
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
      <div ref={containerRef} className="flex-1 overflow-auto bg-muted/10 flex items-center justify-center p-4">
        {error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <div className="text-destructive mb-4 text-lg font-semibold">Failed to load floor plan</div>
            <div className="text-muted-foreground text-sm max-w-md mb-4">
              {error}
            </div>
            <div className="text-xs text-muted-foreground mb-4 font-mono break-all max-w-2xl">
              URL: {pdfUrls[currentPdfIndex]}
            </div>
            <Button onClick={() => {
              console.log('🔄 Retrying PDF load...');
              setError(null);
              setIsLoading(true);
            }}>
              Try Again
            </Button>
          </div>
        ) : (
          <>
            {console.log('📄 Rendering Document component with:', {
              file: pdfUrls[currentPdfIndex],
              containerWidth,
              scale,
              currentPage
            })}
            <Document
              file={pdfUrls[currentPdfIndex]}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              options={options}
              loading={
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="text-foreground text-lg">Loading floor plan...</div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Fetching: {pdfUrls[currentPdfIndex]?.substring(0, 50)}...
                  </div>
                </div>
              }
            >
              <Page
                pageNumber={currentPage}
                width={containerWidth}
                scale={scale}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                className="shadow-lg"
                loading={
                  <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-foreground">Rendering page {currentPage}...</div>
                  </div>
                }
                onLoadSuccess={() => console.log('✅ Page rendered successfully')}
                onLoadError={(error) => console.error('❌ Page rendering error:', error)}
              />
            </Document>
          </>
        )}
      </div>
    </div>
  );
};

export default FloorPlanViewer;
