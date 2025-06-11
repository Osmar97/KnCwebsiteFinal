
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
            className="bg-gray-900/50 border-gray-800 hover:bg-gray-900/70 transition-all cursor-pointer group border-l-4 border-l-gold"
            onClick={() => navigate(`/resources/${relatedPost.category}/${relatedPost.id}`)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Category Label */}
                <div className="text-xs font-medium text-gold uppercase tracking-wider">
                  {relatedPost.category}s
                </div>

                {/* Title */}
                <h4 className="text-xl font-bold text-white leading-tight group-hover:text-gold transition-colors">
                  {relatedPost.title || "Untitled Post"}
                </h4>

                {/* Excerpt */}
                <p className="text-gray-400 leading-relaxed">
                  {relatedPost.content.substring(0, 150)}...
                </p>

                {/* Read More and Author Section */}
                <div className="flex justify-between items-center pt-2">
                  <div className="text-gold font-medium text-sm group-hover:text-white transition-colors">
                    Read More →
                  </div>

                  <div className="flex items-center gap-3">
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
