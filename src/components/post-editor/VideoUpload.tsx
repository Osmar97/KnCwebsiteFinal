
import { Upload, Video, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

interface VideoUploadProps {
  videoUrls: string[];
  onVideoUrlsChange: (urls: string[]) => void;
}

export const VideoUpload = ({ videoUrls, onVideoUrlsChange }: VideoUploadProps) => {
  const { toast } = useToast();
  const { supabaseUser, isAdminLoggedIn } = useAdmin();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (!file.type.includes('video/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select only video files.",
          variant: "destructive",
        });
        continue;
      }

      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Video files must be smaller than 500MB.",
          variant: "destructive",
        });
        continue;
      }

      try {
        console.log("Video Upload - Admin check:", { 
          isAdminLoggedIn, 
          hasSupabaseUser: !!supabaseUser,
          userId: supabaseUser?.id,
          userEmail: supabaseUser?.email
        });
        
        if (!isAdminLoggedIn || !supabaseUser) {
          console.log("No authenticated admin user found for video upload");
          toast({
            title: "Authentication Required",
            description: "Please log in as admin to upload videos.",
            variant: "destructive",
          });
          continue;
        }

        // Sanitize filename to remove special characters and spaces
        const sanitizedFileName = file.name
          .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
          .replace(/\s+/g, '_') // Replace spaces with underscore
          .toLowerCase();

        // Create a file path that includes the user ID for RLS policy
        const fileName = `${supabaseUser.id}/${Date.now()}_${sanitizedFileName}`;
        console.log("Uploading video with sanitized path:", fileName);
        console.log("User ID:", supabaseUser.id);
        console.log("User email:", supabaseUser.email);
        
        const { data, error } = await supabase.storage
          .from('videos')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) {
          console.error("Storage upload error:", error);
          toast({
            title: "Upload Error",
            description: `Failed to upload video: ${error.message}`,
            variant: "destructive",
          });
          continue;
        }

        console.log("Video upload successful:", data);

        const { data: { publicUrl } } = supabase.storage
          .from('videos')
          .getPublicUrl(data.path);

        console.log("Video Public URL:", publicUrl);

        onVideoUrlsChange([...videoUrls, publicUrl]);

        toast({
          title: "Success",
          description: "Video uploaded successfully.",
        });
      } catch (error) {
        console.error("Error uploading video:", error);
        toast({
          title: "Upload Error",
          description: "Failed to upload video. Please try again.",
          variant: "destructive",
        });
      }
    }
    
    e.target.value = '';
  };

  const removeVideo = (index: number) => {
    onVideoUrlsChange(videoUrls.filter((_, i) => i !== index));
  };

  const getVideoName = (url: string) => {
    return url.split('/').pop() || 'Video File';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Upload Videos (up to 500MB each)
      </label>
      
      <div className="mb-3">
        <label htmlFor="video-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gold transition-colors">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Click to upload video files</span>
          </div>
        </label>
        <input
          id="video-upload"
          type="file"
          multiple
          accept="video/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {videoUrls.length > 0 && (
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Videos ({videoUrls.length})
          </label>
          <div className="space-y-2">
            {videoUrls.map((url, index) => (
              <div key={index} className="relative">
                <video
                  src={url}
                  className="w-full h-32 object-cover rounded border border-gray-600"
                  controls
                  preload="metadata"
                />
                <Button
                  type="button"
                  onClick={() => removeVideo(index)}
                  variant="destructive"
                  size="sm"
                  className="absolute top-1 right-1 w-6 h-6 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
                <div className="text-xs text-gray-400 mt-1 truncate">
                  {getVideoName(url)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
