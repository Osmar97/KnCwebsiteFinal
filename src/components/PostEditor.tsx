
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useToast } from "@/hooks/use-toast";
import { PostEditorForm } from "./post-editor/PostEditorForm";

interface PostEditorProps {
  post?: Post;
  isEdit?: boolean;
  onClose?: () => void;
}

export const PostEditor = ({ post, isEdit = false, onClose }: PostEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(post?.content || "");
  const [images, setImages] = useState<string[]>(post?.images || []);
  const { addPost, updatePost } = usePosts();
  const { toast } = useToast();

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setContent(post?.content || "");
      setImages(post?.images || []);
    }
  }, [isOpen, post]);

  const handleSubmit = (e: React.FormEvent) => {
    if (isEdit && post) {
      updatePost(post.id, content, images);
      toast({
        title: "Success",
        description: "Post updated successfully.",
      });
    } else {
      addPost(content, images);
      toast({
        title: "Success",
        description: "Post created successfully.",
      });
    }

    // Reset form and close dialog
    setContent("");
    setImages([]);
    setIsOpen(false);
    onClose?.();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const result = event.target?.result as string;
          if (result && !images.includes(result)) {
            setImages(prev => [...prev, result]);
          }
        };
        reader.readAsDataURL(file);
      } else {
        toast({
          title: "Error",
          description: "Please select only image files.",
          variant: "destructive",
        });
      }
    });
    
    // Reset the input
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleDialogClose = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      onClose?.();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="bg-gold hover:bg-gold/90 text-black">
            <Plus className="w-4 h-4 mr-2" />
            Create Post
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white max-w-2xl border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-gold">
            {isEdit ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        
        <PostEditorForm
          content={content}
          images={images}
          isEdit={isEdit}
          onContentChange={setContent}
          onFileUpload={handleFileUpload}
          onRemoveImage={removeImage}
          onSubmit={handleSubmit}
          onCancel={() => setIsOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};
