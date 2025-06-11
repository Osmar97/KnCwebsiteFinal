import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useToast } from "@/hooks/use-toast";
import { ImageGallery } from "./ImageGallery";
import { VideoDisplay } from "./VideoDisplay";
import { PdfDisplay } from "./PdfDisplay";
import { RelatedPosts } from "./RelatedPosts";
import { AuthorInfo } from "./AuthorInfo";

export const ArticleView = () => {
  const {
    category,
    id
  } = useParams<{
    category: string;
    id: string;
  }>();
  const navigate = useNavigate();
  const {
    getPostById,
    getPostsByCategory
  } = usePosts();
  const {
    toast
  } = useToast();
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      console.log("Found post:", foundPost);
      console.log("Post PDFs:", foundPost?.pdf_urls);
      console.log("Post videos:", foundPost?.video_urls);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts from same category, excluding current post
        const related = getPostsByCategory(foundPost.category).filter(p => p.id !== id).slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id, getPostById, getPostsByCategory]);

  if (!post) {
    return <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p>Article not found</p>
      </div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: `Kings 'n Company - ${post.category}`,
        text: post.content.substring(0, 100) + "...",
        url: window.location.href
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard."
      });
    }
  };

  console.log("Rendering ArticleView with PDFs:", post.pdf_urls);
  console.log("Rendering ArticleView with videos:", post.video_urls);

  return <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="outline" onClick={() => navigate('/resources')} className="mb-8 border-gray-600 text-gray-950 bg-[#85754e]">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Resources
        </Button>

        {/* Article Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>Ismael Gomes Queta</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.created_at)}</span>
            </div>
            <Button variant="outline" size="sm" onClick={handleShare} className="border-gray-600 bg-[#85754e] text-neutral-950">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="inline-block px-3 py-1 bg-gold text-black text-sm font-medium rounded-full mb-4 capitalize">
            {post.category}
          </div>
        </div>

        {/* Featured Image */}
        <ImageGallery images={post.images} />

        {/* Videos Section */}
        <VideoDisplay videoUrls={post.video_urls} />

        {/* PDFs Section */}
        <PdfDisplay pdfUrls={post.pdf_urls} />

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Author Information */}
        <AuthorInfo />

        {/* Related Articles */}
        <RelatedPosts posts={relatedPosts} category={post.category} />
      </div>
    </div>;
};
