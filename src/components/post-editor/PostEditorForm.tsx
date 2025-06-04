
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { useToast } from "@/hooks/use-toast";

interface PostEditorFormProps {
  content: string;
  images: string[];
  isEdit: boolean;
  isSubmitting?: boolean;
  onContentChange: (content: string) => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const PostEditorForm = ({
  content,
  images,
  isEdit,
  isSubmitting = false,
  onContentChange,
  onFileUpload,
  onRemoveImage,
  onSubmit,
  onCancel
}: PostEditorFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Post content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
          Post Content
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => onContentChange(e.target.value)}
          placeholder="What's on your mind?"
          className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400"
          required
          disabled={isSubmitting}
        />
      </div>

      <ImageUpload onFileUpload={onFileUpload} />
      <ImagePreview images={images} onRemoveImage={onRemoveImage} />

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
