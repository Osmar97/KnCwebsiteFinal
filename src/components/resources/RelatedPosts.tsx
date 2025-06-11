
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { type Post } from "@/contexts/PostsContext";

interface RelatedPostsProps {
  posts: Post[];
  category: string;
}

export const RelatedPosts = ({ posts, category }: RelatedPostsProps) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  if (posts.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-2xl font-light text-white mb-2">Related {category}s</h3>
        <div className="w-16 h-0.5 bg-gold mx-auto"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {posts.map((relatedPost) => (
          <Card 
            key={relatedPost.id} 
            className="bg-white hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/resources/${relatedPost.category}/${relatedPost.id}`)}
          >
            <CardContent className="p-4">
              {relatedPost.images && relatedPost.images.length > 0 && (
                <div className="w-full h-32 overflow-hidden rounded mb-4">
                  <img
                    src={relatedPost.images[0]}
                    alt="Related post"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="space-y-2">
                <div className="text-xs text-gray-500">
                  {formatDate(relatedPost.created_at)}
                </div>
                <p className="text-sm text-gray-700 line-clamp-3">
                  {relatedPost.content.substring(0, 100)}...
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
