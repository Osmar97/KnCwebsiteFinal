
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, User } from "lucide-react";
import { type Post, usePosts } from "@/contexts/PostsContext";
import { PostEditor } from "./PostEditor";
import { ImageModal } from "./ImageModal";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  post: Post;
}

export const PostCard = ({ post }: PostCardProps) => {
  const { deletePost } = usePosts();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleDelete = () => {
    deletePost(post.id);
    toast({
      title: "Success",
      description: "Post deleted successfully.",
    });
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setImageModalOpen(true);
  };

  return (
    <>
      <Card className="w-full bg-white shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ismael Gomes Queta</p>
                <p className="text-sm text-gray-500">Founder</p>
                <p className="text-xs text-gray-400">{formatDate(post.createdAt)}</p>
                {post.updatedAt > post.createdAt && (
                  <p className="text-xs text-gray-400">Edited {formatDate(post.updatedAt)}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditDialog(true)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Post</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this post? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="text-gray-900"
              dangerouslySetInnerHTML={{ __html: post.content }}
              style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}
            />
            
            {post.images.length > 0 && (
              <div className={`grid gap-2 ${
                post.images.length === 1 
                  ? 'grid-cols-1' 
                  : post.images.length === 2 
                  ? 'grid-cols-2' 
                  : 'grid-cols-2 md:grid-cols-3'
              }`}>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                    onClick={() => handleImageClick(index)}
                  />
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {showEditDialog && (
        <PostEditor
          post={post}
          isEdit={true}
          onClose={() => setShowEditDialog(false)}
        />
      )}

      <ImageModal
        images={post.images}
        initialIndex={selectedImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </>
  );
};
