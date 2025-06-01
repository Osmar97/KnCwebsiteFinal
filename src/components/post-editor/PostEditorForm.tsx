import { Button } from "@/components/ui/button";
import { RichTextEditor } from "./RichTextEditor";
import { ImageUpload } from "./ImageUpload";
import { ImagePreview } from "./ImagePreview";
import { useToast } from "@/hooks/use-toast";

interface PostEditorFormProps {
  content: string;
  images: string[];
  isEdit: boolean;
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
  onContentChange,
  onFileUpload,
  onRemoveImage,
  onSubmit,
  onCancel
}: PostEditorFormProps) => {
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strip HTML tags for validation but keep the formatted content
    const textContent = content.replace(/<[^>]*>/g, '').trim();
    
    if (!textContent) {
      toast({
        title: "Error",
        description: "Post content cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    // Call the parent's submit handler which should close the dialog
    onSubmit(e);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
          Post Content
        </label>
        <RichTextEditor
          value={content}
          onChange={onContentChange}
          placeholder="What's on your mind?"
          className="focus:ring-gold"
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
        >
          Cancel
        </Button>
        <Button type="submit" className="bg-gold hover:bg-gold/90 text-black">
          {isEdit ? "Update Post" : "Create Post"}
        </Button>
      </div>
    </form>
  );
};
