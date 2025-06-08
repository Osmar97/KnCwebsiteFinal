
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useNavigate } from "react-router-dom";

interface ResourcesGridProps {
  category: "all" | "article" | "resource";
  title: string;
}

export const ResourcesGrid = ({ category, title }: ResourcesGridProps) => {
  const { posts, getPostsByCategory } = usePosts();
  const navigate = useNavigate();
  
  const displayPosts = category === "all" 
    ? posts 
    : getPostsByCategory(category as "article" | "resource");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getExcerpt = (content: string, maxLength: number = 200) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength).trim() + "...";
  };

  const handlePostClick = (post: Post) => {
    navigate(`/resources/${post.category}/${post.id}`);
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-light text-white mb-2">{title}</h2>
        <div className="w-16 h-0.5 bg-gold mx-auto"></div>
      </div>

      {displayPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400">No posts available yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayPosts.map((post) => (
            <Card 
              key={post.id} 
              className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all cursor-pointer group"
              onClick={() => handlePostClick(post)}
            >
              <CardContent className="p-8">
                <div className="flex justify-between items-start gap-8">
                  {/* Left Content Area */}
                  <div className="flex-1 space-y-4">
                    {/* Category Label */}
                    <div className="text-xs font-medium text-gold uppercase tracking-wider">
                      {post.category}s
                    </div>

                    {/* Main Headline */}
                    <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight group-hover:text-gold transition-colors">
                      {post.title}
                    </h3>

                    {/* Body Excerpt */}
                    <p className="text-gray-400 text-lg leading-relaxed max-w-3xl">
                      {getExcerpt(post.content, 200)}
                    </p>

                    {/* CTA Element */}
                    <Button 
                      variant="ghost" 
                      className="text-gold hover:text-white p-0 h-auto font-medium group/btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePostClick(post);
                      }}
                    >
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>

                  {/* Right Meta Section */}
                  <div className="flex flex-col items-end space-y-4 min-w-[200px]">
                    {/* Date Stamp */}
                    <div className="text-gray-400 text-sm">
                      {formatDate(post.created_at)}
                    </div>

                    {/* Author Section */}
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-white font-medium text-sm">
                          by Ismael Gomes Queta
                        </div>
                        <div className="text-gray-400 text-xs">
                          CEO, King's 'n Company
                        </div>
                      </div>
                      <Avatar className="w-12 h-12">
                        <AvatarImage src="/lovable-uploads/ismaPerfil.JPG" alt="Ismael Gomes Queta" />
                        <AvatarFallback className="bg-gold text-black font-medium">
                          IG
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>
                </div>

                {/* Featured Image (if available) */}
                {post.images && post.images.length > 0 && (
                  <div className="mt-6 rounded-lg overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt="Article featured image"
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
