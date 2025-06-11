
import { useState } from "react";
import { Play, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VideoDisplayProps {
  videoUrls: string[];
}

export const VideoDisplay = ({ videoUrls }: VideoDisplayProps) => {
  const [videoErrors, setVideoErrors] = useState<{ [key: number]: string }>({});

  const handleVideoError = (index: number, error: any) => {
    console.error(`Video ${index} error:`, error);
    const videoUrl = videoUrls[index];
    const fileExtension = videoUrl?.split('.').pop()?.toLowerCase();
    
    let errorMessage = 'Error loading video';
    if (fileExtension === 'mkv') {
      errorMessage = 'MKV format is not supported by web browsers. Please convert to MP4, WebM, or download to view.';
    } else if (fileExtension && !['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      errorMessage = `${fileExtension.toUpperCase()} format may not be supported. Try MP4 or WebM format.`;
    }
    
    setVideoErrors(prev => ({
      ...prev,
      [index]: errorMessage
    }));
  };

  const handleVideoLoadStart = (index: number) => {
    console.log(`Video ${index} load started`);
    setVideoErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleVideoCanPlay = (index: number) => {
    console.log(`Video ${index} can play`);
  };

  const handleVideoDownload = (videoUrl: string) => {
    const fileName = videoUrl.split('/').pop() || 'video';
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!videoUrls || videoUrls.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
        <Play className="w-5 h-5 text-gold" />
        Videos
      </h3>
      <div className="space-y-6">
        {videoUrls.map((videoUrl, index) => (
          <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
            {videoErrors[index] ? (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="text-red-400">
                  <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                  <p className="text-base mb-4">{videoErrors[index]}</p>
                  
                  <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                    <Button
                      onClick={() => handleVideoDownload(videoUrl)}
                      className="bg-gold hover:bg-gold/90 text-black flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download Video
                    </Button>
                    
                    <a 
                      href={videoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-gold hover:underline text-sm"
                    >
                      Try opening directly in new tab
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <video
                src={videoUrl}
                className="w-full max-h-96 object-contain bg-black"
                controls
                preload="metadata"
                onError={(e) => handleVideoError(index, e)}
                onLoadStart={() => handleVideoLoadStart(index)}
                onCanPlay={() => handleVideoCanPlay(index)}
              >
                <p className="text-gray-400 p-4">
                  Your browser does not support the video tag. 
                  <a href={videoUrl} className="text-gold hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                    Download the video instead.
                  </a>
                </p>
              </video>
            )}
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              Video {index + 1} of {videoUrls.length}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
