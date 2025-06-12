
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
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

      <div className="space-y-6">
        {posts.map((relatedPost) => (
          <Card 
            key={relatedPost.id} 
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all cursor-pointer group border-l-8 border-l-gold"
            onClick={() => navigate(`/resources/${relatedPost.category}/${relatedPost.id}`)}
          >
            <CardContent className="p-8 pr-12">
              <div className="relative">
                {/* Date in top-right corner */}
                <div className="absolute top-0 right-0 text-gray-400 text-sm">
                  {formatDate(relatedPost.created_at)}
                </div>

                {/* Main content area with proper spacing */}
                <div className="pr-32 space-y-5">
                  {/* Category Label with more space below */}
                  <div className="text-xs font-medium text-gold uppercase tracking-wider mb-4">
                    {relatedPost.category}s
                  </div>

                  {/* Title - Much larger, bolder */}
                  <h4 className="text-3xl font-bold text-white leading-tight group-hover:text-gold transition-colors mb-5">
                    {relatedPost.title || "Untitled Post"}
                  </h4>

                  {/* Excerpt with larger font and more spacing */}
                  <p className="text-gray-400 leading-relaxed text-base mb-6">
                    {relatedPost.content.substring(0, 150)}...
                  </p>
                </div>

                {/* Footer with Read More and Author positioned separately */}
                <div className="relative mt-6">
                  {/* Read More in bottom-left */}
                  <div className="text-gold font-medium text-sm group-hover:text-white transition-colors">
                    Read More →
                  </div>

                  {/* Author info in bottom-right corner */}
                  <div className="absolute bottom-0 right-0 flex flex-col items-center space-y-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src="/lovable-uploads/ismaPerfil.JPG" alt="Ismael Gomes Queta" />
                      <AvatarFallback className="bg-gold text-black font-medium text-xs">
                        IG
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-center">
                      <div className="text-white font-medium text-sm">
                        by Ismael Gomes Queta
                      </div>
                      <div className="text-gray-400 text-xs">
                        Founder, Kings 'n Company
                      </div>
                    </div>
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
