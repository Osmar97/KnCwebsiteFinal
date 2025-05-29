
import { PostEditor } from "./PostEditor";
import { PostCard } from "./PostCard";
import { usePosts } from "@/contexts/PostsContext";
import { useAdmin } from "@/contexts/AdminContext";

export const AdminPostsFeed = () => {
  const { posts } = usePosts();
  const { isAdminLoggedIn } = useAdmin();

  if (!isAdminLoggedIn) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Post Creation Button */}
      <div className="flex justify-end">
        <PostEditor />
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts yet. Create your first post!</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  );
};
