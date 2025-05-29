
import { Upload } from "lucide-react";

interface ImageUploadProps {
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUpload = ({ onFileUpload }: ImageUploadProps) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Add Images
      </label>
      
      <div className="mb-3">
        <label htmlFor="file-upload" className="cursor-pointer">
          <div className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-600 rounded-lg hover:border-gold transition-colors">
            <Upload className="w-5 h-5 text-gray-400" />
            <span className="text-gray-400">Click to upload images or drag and drop</span>
          </div>
        </label>
        <input
          id="file-upload"
          type="file"
          multiple
          accept="image/*"
          onChange={onFileUpload}
          className="hidden"
        />
      </div>
    </div>
  );
};
