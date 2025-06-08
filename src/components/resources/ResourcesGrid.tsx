
import { ArrowRight, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useNavigate } from "react-router-dom";

interface ResourcesGridProps {
  category: "article" | "resource";
  title: string;
}

export const ResourcesGrid = ({ category, title }: ResourcesGridProps) => {
  const { getPostsByCategory } = usePosts();
  const navigate = useNavigate();
  const posts = getPostsByCategory(category);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getExcerpt = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const handlePostClick = (postId: string) => {
    navigate(`/resources/${category}/${postId}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light text-white mb-2">{title}</h2>
        <div className="w-16 h-0.5 bg-gold mx-auto"></div>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No {category}s available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Card key={post.id} className="bg-white hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePostClick(post.id)}>
              <CardContent className="p-0">
                {post.images && post.images.length > 0 && (
                  <div className="w-full h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={post.images[0]}
                      alt="Post featured image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      <span>Ismael Gomes Queta</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(post.created_at)}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <p className="text-gray-700 leading-relaxed">
                      {getExcerpt(post.content)}
                    </p>
                    
                    <Button 
                      variant="outline" 
                      className="w-full group"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostClick(post.id);
                      }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
