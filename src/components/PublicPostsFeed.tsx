
import { PostCard } from "./PostCard";
import { usePosts } from "@/contexts/PostsContext";

export const PublicPostsFeed = () => {
  const { posts } = usePosts();

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No posts available yet.</p>
          </div>
        ) : (
          posts.map((post) => (
            <PostCard key={post.id} post={post} isPublicView={true} />
          ))
        )}
      </div>
    </div>
  );
};
