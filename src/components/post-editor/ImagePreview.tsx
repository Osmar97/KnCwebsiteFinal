
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ImagePreviewProps {
  images: string[];
  onRemoveImage: (index: number) => void;
}

export const ImagePreview = ({ images, onRemoveImage }: ImagePreviewProps) => {
  if (images.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        Images ({images.length})
      </label>
      <div className="grid grid-cols-2 gap-2">
        {images.map((img, index) => (
          <div key={index} className="relative">
            <img
              src={img}
              alt={`Preview ${index + 1}`}
              className="w-full h-24 object-cover rounded border border-gray-600"
            />
            <Button
              type="button"
              onClick={() => onRemoveImage(index)}
              variant="destructive"
              size="sm"
              className="absolute top-1 right-1 w-6 h-6 p-0"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
