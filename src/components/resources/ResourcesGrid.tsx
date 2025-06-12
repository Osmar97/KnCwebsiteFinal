
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts, type Post } from "@/contexts/PostsContext";

interface ResourcesGridProps {
  category: "all" | "article" | "resource";
  title: string;
}

export const ResourcesGrid = ({ category, title }: ResourcesGridProps) => {
  const { posts, loading } = usePosts();
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = posts;
    if (category !== "all") {
      filtered = posts.filter(post => post.category === category);
    }
    setFilteredPosts(filtered);
  }, [posts, category]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };

  const getPreviewText = (content: string) => {
    // Strip HTML tags for preview
    const strippedContent = content.replace(/<[^>]*>/g, '');
    return strippedContent.length > 150 
      ? strippedContent.substring(0, 150) + "..." 
      : strippedContent;
  };

  const handlePostClick = (post: Post) => {
    navigate(`/resources/${post.category}/${post.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-400">Loading resources...</div>
      </div>
    );
  }

  if (filteredPosts.length === 0) {
    return (
      <div className="text-center py-16">
        <h3 className="text-xl font-semibold text-gray-300 mb-4">No {category === "all" ? "posts" : category + "s"} found</h3>
        <p className="text-gray-400">Check back later for new content!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-light text-center text-gray-300">{title}</h2>
      
      <div className="grid gap-8 md:gap-12">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="bg-gray-800/50 backdrop-blur-sm border-gray-700 hover:bg-gray-800/70 transition-all duration-300 cursor-pointer group" onClick={() => handlePostClick(post)}>
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                {/* Featured Image */}
                {post.images && post.images.length > 0 && (
                  <div className="lg:w-1/3">
                    <img
                      src={post.images[0]}
                      alt={post.title}
                      className="w-full h-48 lg:h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className={`${post.images && post.images.length > 0 ? 'lg:w-2/3' : 'w-full'} space-y-4`}>
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 bg-gold text-black text-sm font-medium rounded-full capitalize">
                    {post.category}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white group-hover:text-gold transition-colors">
                    {post.title}
                  </h3>
                  
                  {/* Preview Text */}
                  {post.content && (
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {getPreviewText(post.content)}
                    </p>
                  )}
                  
                  {/* Meta Information */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-400">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>Ismael Gomes Queta</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(post.created_at)}</span>
                      </div>
                    </div>
                    
                    <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80 hover:bg-gold/10">
                      Read More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
