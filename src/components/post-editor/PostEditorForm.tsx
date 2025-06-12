
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { PdfUpload } from "./PdfUpload";
import { VideoUpload } from "./VideoUpload";
import { useToast } from "@/hooks/use-toast";

interface PostEditorFormProps {
  title: string;
  content: string;
  images: string[];
  pdfUrls: string[];
  videoUrls: string[];
  category: "article" | "resource";
  isEdit: boolean;
  isSubmitting?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onCategoryChange: (category: "article" | "resource") => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onPdfUrlsChange: (urls: string[]) => void;
  onVideoUrlsChange: (urls: string[]) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const PostEditorForm = ({
  title,
  content,
  images,
  pdfUrls,
  videoUrls,
  category,
  isEdit,
  isSubmitting = false,
  onTitleChange,
  onContentChange,
  onCategoryChange,
  onFileUpload,
  onRemoveImage,
  onPdfUrlsChange,
  onVideoUrlsChange,
  onSubmit,
  onCancel
}: PostEditorFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Post title cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Content is now optional - only validate if there's no other media
    if (!content.trim() && images.length === 0 && pdfUrls.length === 0 && videoUrls.length === 0) {
      toast({
        title: "Error",
        description: "Post must have either content or media (images, videos, or PDFs).",
        variant: "destructive",
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
          Category
        </label>
        <Select value={category} onValueChange={onCategoryChange}>
          <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-600">
            <SelectItem value="article" className="text-white hover:bg-gray-700">Article</SelectItem>
            <SelectItem value="resource" className="text-white hover:bg-gray-700">Resource</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
          Title
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter post title..."
          className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
          Content <span className="text-gray-500 text-xs">(optional)</span>
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="What's on your mind? (optional if you're adding media)"
          className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          disabled={isSubmitting}
        />
      </div>

      <ImageUpload onFileUpload={onFileUpload} />
      <ImagePreview images={images} onRemoveImage={onRemoveImage} />

      <PdfUpload pdfUrls={pdfUrls} onPdfUrlsChange={onPdfUrlsChange} />
      
      <VideoUpload videoUrls={videoUrls} onVideoUrlsChange={onVideoUrlsChange} />

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-gray-600 text-gray-300 hover:bg-gray-700"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className="bg-gold hover:bg-gold/90 text-black"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Saving..." : isEdit ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
};
