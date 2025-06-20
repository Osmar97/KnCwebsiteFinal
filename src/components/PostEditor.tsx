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
  const [title, setTitle] = useState(post?.title || "");
  const [content, setContent] = useState(post?.content || "");
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [pdfUrls, setPdfUrls] = useState<string[]>(post?.pdf_urls || []);
  const [videoUrls, setVideoUrls] = useState<string[]>(post?.video_urls || []);
  const [category, setCategory] = useState<"article" | "resource">(post?.category || "article");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPost, updatePost } = usePosts();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOpen) {
      setTitle(post?.title || "");
      setContent(post?.content || "");
      setImages(post?.images || []);
      setPdfUrls(post?.pdf_urls || []);
      setVideoUrls(post?.video_urls || []);
      setCategory(post?.category || "article");
    }
  }, [isOpen, post]);

  const validateContent = (title: string, content: string, images: string[], pdfUrls: string[], videoUrls: string[]): boolean => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    
    // Title is required and must be within limits
    if (trimmedTitle.length === 0 || trimmedTitle.length > 200) {
      return false;
    }
    
    // Content length check if provided
    if (trimmedContent.length > 5000) {
      return false;
    }
    
    // Must have either content or media
    return trimmedContent.length > 0 || images.length > 0 || pdfUrls.length > 0 || videoUrls.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateContent(title, content, images, pdfUrls, videoUrls)) {
      toast({
        title: "Invalid Content",
        description: "Title is required (max 200 chars). Content is optional but if provided must be under 5000 chars. Must include either content or media.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      let success = false;
      
      if (isEdit && post) {
        success = await updatePost(post.id, title, content, images, pdfUrls, videoUrls, category);
        if (success) {
          toast({
            title: "Success",
            description: "Post updated successfully.",
          });
        }
      } else {
        success = await addPost(title, content, images, pdfUrls, videoUrls, category);
        if (success) {
          toast({
            title: "Success",
            description: "Post created successfully.",
          });
        }
      }

      if (!success) {
        toast({
          title: "Error",
          description: "Failed to save post. Please check your content and try again.",
          variant: "destructive",
        });
        return;
      }

      setTitle("");
      setContent("");
      setImages([]);
      setPdfUrls([]);
      setVideoUrls([]);
      setCategory("article");
      setIsOpen(false);
      onClose?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 10) {
      toast({
        title: "Too Many Images",
        description: "Maximum 10 images allowed per post.",
        variant: "destructive",
      });
      return;
    }

    Array.from(files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File Type",
          description: "Please select only image files.",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 100 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Images must be smaller than 5MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result && !images.includes(result)) {
          setImages(prev => [...prev, result]);
        }
      };
      reader.readAsDataURL(file);
    });
    
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

  const handleCancel = () => {
    setIsOpen(false);
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
      <DialogContent className="bg-gray-900 text-white max-w-2xl border-gray-700 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-gold">
            {isEdit ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        
        <PostEditorForm
          title={title}
          content={content}
          images={images}
          pdfUrls={pdfUrls}
          videoUrls={videoUrls}
          category={category}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          onTitleChange={setTitle}
          onContentChange={setContent}
          onCategoryChange={setCategory}
          onFileUpload={handleFileUpload}
          onRemoveImage={removeImage}
          onPdfUrlsChange={setPdfUrls}
          onVideoUrlsChange={setVideoUrls}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </DialogContent>
    </Dialog>
  );
};
