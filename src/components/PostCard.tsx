import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Edit, Trash2, Download, FileText, Play } from "lucide-react";
import { type Post, usePosts } from "@/contexts/PostsContext";
import { PostEditor } from "./PostEditor";
import { ImageModal } from "./ImageModal";
import { useToast } from "@/hooks/use-toast";
import { useAdmin } from "@/contexts/AdminContext";

interface PostCardProps {
  post: Post;
  isPublicView?: boolean;
}

export const PostCard = ({ post, isPublicView = false }: PostCardProps) => {
  const { deletePost } = usePosts();
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const success = await deletePost(post.id);
      if (success) {
        toast({
          title: "Success",
          description: "Post deleted successfully.",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to delete post.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
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

  const handlePdfDownload = (pdfUrl: string) => {
    const fileName = pdfUrl.split('/').pop() || 'document.pdf';
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getPdfName = (url: string) => {
    const name = url.split('/').pop() || 'PDF Document';
    return name.length > 30 ? name.substring(0, 30) + '...' : name;
  };

  const showAdminControls = isAdminLoggedIn && !isPublicView;

  return (
    <>
      <Card className="w-full bg-white shadow-md">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gold">
                <img 
                  src="/lovable-uploads/ismaPerfil.JPG" 
                  alt="Admin Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ismael Gomes Queta</p>
                <p className="text-sm text-gray-500">Founder</p>
                <p className="text-xs text-gray-400">{formatDate(post.created_at)}</p>
                {post.updated_at && post.updated_at !== post.created_at && (
                  <p className="text-xs text-gray-400">Edited {formatDate(post.updated_at)}</p>
                )}
              </div>
            </div>
            {showAdminControls && (
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
                    <Button variant="outline" size="sm" disabled={isDeleting}>
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
                      <AlertDialogAction 
                        onClick={handleDelete} 
                        className="bg-red-600 hover:bg-red-700"
                        disabled={isDeleting}
                      >
                        {isDeleting ? "Deleting..." : "Delete"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div 
              className="text-gray-900 whitespace-pre-wrap [&_strong]:font-bold [&_em]:italic [&_p]:mb-2"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
            
            {post.images && post.images.length > 0 && (
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

            {post.pdf_urls && post.pdf_urls.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Downloadable Resources:</h4>
                <div className="grid gap-2">
                  {post.pdf_urls.map((pdfUrl, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <FileText className="w-5 h-5 text-red-500" />
                      <span className="flex-1 text-sm text-gray-700 truncate">
                        {getPdfName(pdfUrl)}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePdfDownload(pdfUrl)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.video_urls && post.video_urls.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-700">Videos:</h4>
                <div className="grid gap-4">
                  {post.video_urls.map((videoUrl, index) => (
                    <div key={index} className="relative">
                      <video
                        src={videoUrl}
                        className="w-full rounded-lg"
                        controls
                        preload="metadata"
                        style={{ maxHeight: '400px' }}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  ))}
                </div>
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
        images={post.images || []}
        initialIndex={selectedImageIndex}
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
      />
    </>
  );
};
