import { useState } from "react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Download, BookOpen, TrendingUp, DollarSign, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePosts } from "@/contexts/PostsContext";
import { GlobalCTA } from "@/components/GlobalCTA";

const FreeResources = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const {
    toast
  } = useToast();
  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);

    // Simulate newsletter signup
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter."
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };
  const resourceCategories = [{
    title: "Real Estate Investment",
    icon: <TrendingUp className="w-8 h-8" />,
    description: "Learn the fundamentals of property investment",
    href: "/resources"
  }, {
    title: "Wealth Building",
    icon: <DollarSign className="w-8 h-8" />,
    description: "Strategies for building generational wealth",
    href: "/resources"
  }, {
    title: "Property Management",
    icon: <Trophy className="w-8 h-8" />,
    description: "Master the art of property management",
    href: "/resources"
  }, {
    title: "Market Analysis",
    icon: <BookOpen className="w-8 h-8" />,
    description: "Understand market trends and opportunities",
    href: "/resources"
  }];
  return <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="pt-[76px] sm:pt-20">
        {/* Hero Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-12">
              <div className="w-80 h-80 mx-auto mb-8 relative">
                <img src="/lovable-uploads/logo_horizontal.png" alt="Free Resources" className="w-full h-full object-contain " />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Free Weekly<br />
              <span className="text-gold">Investment Insights</span>
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              <strong>Join PropertyNotes</strong> – my free, weekly newsletter where I share actionable 
              investment tips, practical wealth-building advice, and high-quality insights from 
              across the real estate world, directly to your inbox.
            </p>
            
            <form onSubmit={handleNewsletterSignup} className="max-w-md mx-auto flex gap-3">
              <Input type="email" placeholder="Your email" value={email} onChange={e => setEmail(e.target.value)} required className="flex-1 bg-white/10 border-gray-600 text-white placeholder:text-gray-400" />
              <Button type="submit" disabled={isSubscribing} className="bg-gold hover:bg-gold/90 text-black font-semibold px-8">
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            
            <p className="text-sm text-gray-400 mt-4 max-w-2xl mx-auto">
              By submitting this form, you'll be signed up to my free newsletter. I may also send you 
              other emails about my courses. You can opt-out at any time. For more information, see our{" "}
              <a href="/privacy-policy" className="text-gold hover:underline">privacy policy.</a>
            </p>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-20 px-4 bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              How Can I Help You?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Link to="/services" className="group">
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Services
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Explore our comprehensive real estate services
                    </p>
                    <div className="mt-4">
                      <ArrowRight className="w-5 h-5 text-gold mx-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/our-approach" className="group">
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      <DollarSign className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Our Approach
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Discover our investment methodology and strategies
                    </p>
                    <div className="mt-4">
                      <ArrowRight className="w-5 h-5 text-gold mx-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/resources" className="group">
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Resources
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Access our library of articles and insights
                    </p>
                    <div className="mt-4">
                      <ArrowRight className="w-5 h-5 text-gold mx-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>

              <Link to="/contact" className="group">
                <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      <Trophy className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      Contact
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      Get in touch with our expert team
                    </p>
                    <div className="mt-4">
                      <ArrowRight className="w-5 h-5 text-gold mx-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* All Recent Articles Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-left text-white mb-16 font-noto-serif">
              All Recent Articles
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {(() => {
              const {
                getPostsByCategory
              } = usePosts();
              const articles = getPostsByCategory("article").slice(0, 4);
              return articles.map((article, index) => <Card key={article.id} className="bg-gray-800/50 border-gray-700/50 overflow-hidden hover:bg-gray-800 transition-all duration-300 group">
                    <CardContent className="p-0">
                      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-8 border-b border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-2 leading-tight">
                          {article.title}
                        </h3>
                        <p className="text-gray-400 text-sm">
                          {new Date(article.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                        </p>
                      </div>
                      
                      <div className="p-8">
                        <p className="text-gray-300 mb-6 leading-relaxed line-clamp-3">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 180)}...
                        </p>
                        <Button variant="link" className="p-0 text-gold font-medium hover:text-gold/80 group-hover:translate-x-1 transition-all duration-200" onClick={() => window.location.href = `/resources/article/${article.id}`}>
                          Continue Reading <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>);
            })()}
            </div>
          </div>
        </section>

        {/* Global CTA Section */}
        <GlobalCTA />
      </main>

      <Footer />
    </div>;
};
export default FreeResources;