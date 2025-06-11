
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar, User, Share2, ChevronLeft, ChevronRight, Play, AlertCircle, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts, type Post } from "@/contexts/PostsContext";
import { useToast } from "@/hooks/use-toast";

export const ArticleView = () => {
  const { category, id } = useParams<{ category: string; id: string }>();
  const navigate = useNavigate();
  const { getPostById, getPostsByCategory } = usePosts();
  const { toast } = useToast();
  
  const [post, setPost] = useState<Post | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [videoErrors, setVideoErrors] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (id) {
      const foundPost = getPostById(id);
      console.log("Found post:", foundPost);
      console.log("Post videos:", foundPost?.video_urls);
      if (foundPost) {
        setPost(foundPost);
        // Get related posts from same category, excluding current post
        const related = getPostsByCategory(foundPost.category)
          .filter(p => p.id !== id)
          .slice(0, 3);
        setRelatedPosts(related);
      }
    }
  }, [id, getPostById, getPostsByCategory]);

  if (!post) {
    return (
      <div className="min-h-screen bg-neutral-900 text-white flex items-center justify-center">
        <p>Article not found</p>
      </div>
    );
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
        url: window.location.href,
      });
    } catch (error) {
      // Fallback to copying URL
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Article link has been copied to your clipboard.",
      });
    }
  };

  const nextImage = () => {
    if (post.images && post.images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % post.images.length);
    }
  };

  const prevImage = () => {
    if (post.images && post.images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + post.images.length) % post.images.length);
    }
  };

  const handleVideoError = (index: number, error: any) => {
    console.error(`Video ${index} error:`, error);
    const videoUrl = post?.video_urls?.[index];
    const fileExtension = videoUrl?.split('.').pop()?.toLowerCase();
    
    let errorMessage = 'Error loading video';
    if (fileExtension === 'mkv') {
      errorMessage = 'MKV format is not supported by web browsers. Please convert to MP4, WebM, or download to view.';
    } else if (fileExtension && !['mp4', 'webm', 'ogg'].includes(fileExtension)) {
      errorMessage = `${fileExtension.toUpperCase()} format may not be supported. Try MP4 or WebM format.`;
    }
    
    setVideoErrors(prev => ({
      ...prev,
      [index]: errorMessage
    }));
  };

  const handleVideoLoadStart = (index: number) => {
    console.log(`Video ${index} load started`);
    setVideoErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleVideoCanPlay = (index: number) => {
    console.log(`Video ${index} can play`);
  };

  const handleVideoDownload = (videoUrl: string) => {
    const fileName = videoUrl.split('/').pop() || 'video';
    const link = document.createElement('a');
    link.href = videoUrl;
    link.download = fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  console.log("Rendering ArticleView with videos:", post.video_urls);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="outline"
          onClick={() => navigate('/resources')}
          className="mb-8 text-white border-gray-600 hover:bg-gray-800"
        >
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
            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              className="text-white border-gray-600 hover:bg-gray-800"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
          
          <div className="inline-block px-3 py-1 bg-gold text-black text-sm font-medium rounded-full mb-4 capitalize">
            {post.category}
          </div>
        </div>

        {/* Featured Image */}
        {post.images && post.images.length > 0 && (
          <div className="relative mb-8 rounded-lg overflow-hidden">
            <img
              src={post.images[currentImageIndex]}
              alt="Article featured image"
              className="w-full h-64 md:h-96 object-cover"
            />
            
            {post.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-black/70"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 border-gray-600 text-white hover:bg-black/70"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
                
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {post.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full ${
                        index === currentImageIndex ? 'bg-gold' : 'bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Videos Section */}
        {post.video_urls && post.video_urls.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-gold" />
              Videos
            </h3>
            <div className="space-y-6">
              {post.video_urls.map((videoUrl, index) => (
                <div key={index} className="relative bg-gray-800 rounded-lg overflow-hidden">
                  {videoErrors[index] ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                      <div className="text-red-400">
                        <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                        <p className="text-base mb-4">{videoErrors[index]}</p>
                        
                        <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
                          <Button
                            onClick={() => handleVideoDownload(videoUrl)}
                            className="bg-gold hover:bg-gold/90 text-black flex items-center gap-2"
                          >
                            <Download className="w-4 h-4" />
                            Download Video
                          </Button>
                          
                          <a 
                            href={videoUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-gold hover:underline text-sm"
                          >
                            Try opening directly in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <video
                      src={videoUrl}
                      className="w-full max-h-96 object-contain bg-black"
                      controls
                      preload="metadata"
                      onError={(e) => handleVideoError(index, e)}
                      onLoadStart={() => handleVideoLoadStart(index)}
                      onCanPlay={() => handleVideoCanPlay(index)}
                    >
                      <p className="text-gray-400 p-4">
                        Your browser does not support the video tag. 
                        <a href={videoUrl} className="text-gold hover:underline ml-1" target="_blank" rel="noopener noreferrer">
                          Download the video instead.
                        </a>
                      </p>
                    </video>
                  )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    Video {index + 1} of {post.video_urls.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="prose prose-invert max-w-none mb-12">
          <div className="text-lg leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* Debug info - remove this after testing */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-gray-800 rounded text-sm text-gray-300">
            <p><strong>Debug Info:</strong></p>
            <p>Post ID: {post.id}</p>
            <p>Video URLs: {JSON.stringify(post.video_urls)}</p>
            <p>Video URLs length: {post.video_urls?.length || 0}</p>
            <p>Video errors: {JSON.stringify(videoErrors)}</p>
          </div>
        )}

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-gold/10 to-gold/5 border border-gold/20 rounded-lg p-8 mb-12 text-center">
          <h3 className="text-2xl font-light text-white mb-4">
            Ready to Start Your Journey?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're planning to buy, invest, or relocate to Portugal, our expert team is here to guide you every step of the way.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              className="bg-gold hover:bg-gold/90 text-black px-8"
              onClick={() => navigate('/booking')}
            >
              Book a Discovery Call
            </Button>
            <Button 
              variant="outline" 
              className="border-gold text-gold hover:bg-gold/10"
              onClick={() => navigate('/contact')}
            >
              Get in Touch
            </Button>
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <div className="space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-light text-white mb-2">Related {post.category}s</h3>
              <div className="w-16 h-0.5 bg-gold mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
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
        )}
      </div>
    </div>
  );
};
