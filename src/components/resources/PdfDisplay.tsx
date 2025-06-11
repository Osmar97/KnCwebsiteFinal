import { FileText, Download, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
interface PdfDisplayProps {
  pdfUrls: string[];
}
export const PdfDisplay = ({
  pdfUrls
}: PdfDisplayProps) => {
  const handlePdfDownload = (pdfUrl: string) => {
    const fileName = pdfUrl.split('/').pop() || 'document.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const getPdfName = (url: string) => {
    const name = url.split('/').pop() || 'PDF Document';
    // Remove timestamp and user ID prefix if present
    const cleanName = name.replace(/^\d+_/, '').replace(/^[a-f0-9-]+\/\d+_/, '');
    return cleanName.length > 50 ? cleanName.substring(0, 50) + '...' : cleanName;
  };
  if (!pdfUrls || pdfUrls.length === 0) {
    return null;
  }
  return <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <FileText className="w-5 h-5 text-gold" />
        Resources
      </h3>
      <div className="space-y-4">
        {pdfUrls.map((pdfUrl, index) => <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <FileText className="w-8 h-8 text-red-500" />
                <div className="flex-1">
                  <h4 className="text-white font-medium">
                    {getPdfName(pdfUrl)}
                  </h4>
                  <p className="text-gray-400 text-sm">PDF Document</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button onClick={() => window.open(pdfUrl, '_blank')} variant="outline" size="sm" className="border-gray-600 bg-[#85754e] text-zinc-950">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View
                </Button>
                <Button onClick={() => handlePdfDownload(pdfUrl)} className="bg-gold hover:bg-gold/90 text-black" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};