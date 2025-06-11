
import { Upload, FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface PdfUploadProps {
  pdfUrls: string[];
  onPdfUrlsChange: (urls: string[]) => void;
}

export const PdfUpload = ({ pdfUrls, onPdfUrlsChange }: PdfUploadProps) => {
  const { toast } = useToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.includes('pdf')) {
        toast({
          title: "Invalid File Type",
          description: "Please select only PDF files.",
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "PDF files must be smaller than 100MB.",
          variant: "destructive",
        });
        continue;
      }

      try {
        // Check current session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log("PDF Upload - Session check:", { 
          hasSession: !!session, 
          hasUser: !!session?.user,
          sessionError, 
          userId: session?.user?.id,
          userEmail: session?.user?.email
        });
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            title: "Session Error",
            description: "Please refresh the page and try again.",
            variant: "destructive",
          });
          continue;
        }

        if (!session?.user) {
          console.log("No authenticated user found for PDF upload");
          toast({
            title: "Authentication Required",
            description: "Please log in to upload PDFs.",
            variant: "destructive",
          });
          continue;
        }

        // Create a file path that includes the user ID for RLS policy
        const fileName = `${session.user.id}/${Date.now()}_${file.name}`;
        console.log("Uploading PDF with path:", fileName);
        console.log("User ID:", session.user.id);
        console.log("User email:", session.user.email);
        
        const { data, error } = await supabase.storage
          .from('pdfs')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error("Storage upload error:", error);
          toast({
            title: "Upload Error",
            description: `Failed to upload PDF: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }

        console.log("PDF upload successful:", data);

        const { data: { publicUrl } } = supabase.storage
          .from('pdfs')
          .getPublicUrl(data.path);

        console.log("PDF Public URL:", publicUrl);

        onPdfUrlsChange([...pdfUrls, publicUrl]);

        toast({
          title: "Success",
          description: "PDF uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading PDF:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload PDF. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    e.target.value = '';
  };

  const removePdf = (index: number) => {
    onPdfUrlsChange(pdfUrls.filter((_, i) => i !== index));
  };

  const getPdfName = (url: string) => {
    return url.split('/').pop() || 'PDF Document';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload PDFs (up to 100MB each)
      </label>
      
      <div className="mb-3">
        <label htmlFor="pdf-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gold transition-colors">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Click to upload PDF files</span>
          </div>
        </label>
        <input
          id="pdf-upload"
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {pdfUrls.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            PDFs ({pdfUrls.length})
          </label>
          <div className="space-y-2">
            {pdfUrls.map((url, index) => (
              <div key={index} className="flex items-center gap-2 p-2 bg-gray-800 rounded border border-gray-600">
                <FileText className="w-4 h-4 text-red-500" />
                <span className="text-gray-300 text-sm flex-1 truncate">
                  {getPdfName(url)}
                </span>
                <Button
                  type="button"
                  onClick={() => removePdf(index)}
                  variant="destructive"
                  size="sm"
                  className="w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
