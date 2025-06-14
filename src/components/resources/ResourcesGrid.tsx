
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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
    // Replace paragraph tags with spaces and strip all HTML tags
    const withSpaces = content.replace(/<\/p>/g, ' ').replace(/<p[^>]*>/g, '');
    const strippedContent = withSpaces.replace(/<[^>]*>/g, '');
    // Clean up multiple spaces and trim
    const cleanedContent = strippedContent.replace(/\s+/g, ' ').trim();
    return cleanedContent.length > 180 
      ? cleanedContent.substring(0, 180) + "..." 
      : cleanedContent;
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
              <div className="relative">
                {/* Date in top-right corner */}
                <div className="absolute top-0 right-0 flex items-center gap-2 text-gray-400 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(post.created_at)}</span>
                </div>

                {/* Main content area */}
                <div className="pr-32 space-y-4">
                  {/* Category Badge */}
                  <div className="inline-block px-3 py-1 bg-gold text-black text-sm font-medium rounded-full uppercase tracking-wider">
                    {post.category === "article" ? "ARTICLES" : "RESOURCES"}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-semibold text-white group-hover:text-gold transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  {/* Preview Text */}
                  {post.content && (
                    <p className="text-gray-300 text-base leading-relaxed">
                      {getPreviewText(post.content)}
                    </p>
                  )}
                  
                  {/* Read More Button */}
                  <Button variant="ghost" size="sm" className="text-gold hover:text-gold/80 hover:bg-gold/10 p-0 h-auto font-medium">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>

                {/* Author info in bottom-right corner */}
                <div className="absolute bottom-0 right-0 flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-white font-medium text-sm">
                      by Ismael Gomes Queta
                    </div>
                    <div className="text-gray-400 text-xs">
                      Founder, Kings 'n Company
                    </div>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/lovable-uploads/ismaPerfil.JPG" alt="Ismael Gomes Queta" />
                    <AvatarFallback className="bg-gold text-black font-medium text-xs">
                      IG
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
