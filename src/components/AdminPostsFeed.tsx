import { useState } from "react";
import { usePosts } from "@/contexts/PostsContext";
import { useAdmin } from "@/contexts/AdminContext";
import { PostEditor } from "./PostEditor";
import { Button } from "./ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ResourcesGrid } from "./resources/ResourcesGrid";

export const AdminPostsFeed = () => {
  const { posts, deletePost } = usePosts();
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();
  const [isCreating, setIsCreating] = useState(false);
  const [editingPost, setEditingPost] = useState<any>(null);

  const handleDelete = async (postId: string) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const success = await deletePost(postId);
      if (success) {
        toast({
          title: "Post Deleted",
          description: "The post has been successfully deleted.",
        });
      }
    }
  };

  if (isCreating || editingPost) {
    return (
      <PostEditor
        post={editingPost}
        isEdit={!!editingPost}
        onClose={() => {
          setIsCreating(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="space-y-8">
      {isAdminLoggedIn && (
        <div className="flex justify-end">
          <Button
            onClick={() => setIsCreating(true)}
            className="bg-gold hover:bg-gold/90 text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Post
          </Button>
        </div>
      )}

      <ResourcesGrid category="all" title="All Resources" />

      {isAdminLoggedIn && posts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-gray-800 rounded-lg p-4 border border-gray-700"
            >
              <h3 className="text-white font-medium mb-2">{post.title}</h3>
              <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                {post.content}
              </p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingPost(post)}
                  className="border-gold text-gold hover:bg-gold hover:text-black"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(post.id)}
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
