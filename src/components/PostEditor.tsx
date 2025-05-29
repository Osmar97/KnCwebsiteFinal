
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Image, X, Upload } from "lucide-react";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useToast } from "@/hooks/use-toast";

interface PostEditorProps {
  post?: Post;
  isEdit?: boolean;
  onClose?: () => void;
}

export const PostEditor = ({ post, isEdit = false, onClose }: PostEditorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [content, setContent] = useState(post?.content || "");
  const [images, setImages] = useState<string[]>(post?.images || []);
  const [imageUrl, setImageUrl] = useState("");
  const { addPost, updatePost } = usePosts();
  const { toast } = useToast();

  // Reset state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setContent(post?.content || "");
      setImages(post?.images || []);
      setImageUrl("");
    }
  }, [isOpen, post]);

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
    setImageUrl("");
    setIsOpen(false);
    onClose?.();
  };

  const addImageFromUrl = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
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
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-2">
              Post Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Add Images
            </label>
            
            {/* File Upload */}
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
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* URL Input */}
            <div className="flex gap-2">
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Or enter image URL..."
                className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
              />
              <Button type="button" onClick={addImageFromUrl} variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                <Image className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {images.length > 0 && (
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
                      onClick={() => removeImage(index)}
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
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-gray-600 text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-gold hover:bg-gold/90 text-black">
              {isEdit ? "Update Post" : "Create Post"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
