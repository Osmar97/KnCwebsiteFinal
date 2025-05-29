
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Image, X } from "lucide-react";
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

    setContent("");
    setImages([]);
    setImageUrl("");
    setIsOpen(false);
    onClose?.();
  };

  const addImage = () => {
    if (imageUrl.trim() && !images.includes(imageUrl.trim())) {
      setImages([...images, imageUrl.trim()]);
      setImageUrl("");
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
      <DialogContent className="bg-white text-gray-900 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-gold">
            {isEdit ? "Edit Post" : "Create New Post"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Post Content
            </label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[120px]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Images
            </label>
            <div className="flex gap-2">
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Enter image URL..."
                className="flex-1"
              />
              <Button type="button" onClick={addImage} variant="outline">
                <Image className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {images.length > 0 && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Images ({images.length})
              </label>
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, index) => (
                  <div key={index} className="relative">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-24 object-cover rounded border"
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
