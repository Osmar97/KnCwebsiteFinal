import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Mail, Download, BookOpen, TrendingUp, DollarSign, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const FreeResources = () => {
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const { toast } = useToast();

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubscribing(true);
    
    // Simulate newsletter signup
    setTimeout(() => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
      setIsSubscribing(false);
    }, 1000);
  };

  const resourceCategories = [
    {
      title: "Real Estate Investment",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "Learn the fundamentals of property investment",
      href: "/resources"
    },
    {
      title: "Wealth Building",
      icon: <DollarSign className="w-8 h-8" />,
      description: "Strategies for building generational wealth",
      href: "/resources"
    },
    {
      title: "Property Management",
      icon: <Trophy className="w-8 h-8" />,
      description: "Master the art of property management",
      href: "/resources"
    },
    {
      title: "Market Analysis",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Understand market trends and opportunities",
      href: "/resources"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <div className="relative mb-12">
              <div className="w-80 h-80 mx-auto mb-8 relative">
                <img 
                  src="/lovable-uploads/logo_horizontal.png" 
                  alt="Free Resources" 
                  className="w-full h-full object-contain opacity-20"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Mail className="w-24 h-24 text-gold" />
                </div>
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
              <Input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 bg-white/10 border-gray-600 text-white placeholder:text-gray-400"
              />
              <Button 
                type="submit" 
                disabled={isSubscribing}
                className="bg-gold hover:bg-gold/90 text-black font-semibold px-8"
              >
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

        {/* How Can I Help You Section */}
        <section className="py-20 px-4 bg-gray-800/50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              How Can I Help You?
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {resourceCategories.map((category, index) => (
                <Card key={index} className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-8 text-center">
                    <div className="text-gold mb-4 flex justify-center group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">
                      {category.title}
                    </h3>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {category.description}
                    </p>
                    <div className="mt-4">
                      <ArrowRight className="w-5 h-5 text-gold mx-auto group-hover:translate-x-1 transition-transform" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Free Resources Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-center text-white mb-16">
              Free Resources & Downloads
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300">
                <CardContent className="p-8">
                  <Download className="w-12 h-12 text-gold mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Investment Calculator
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Calculate potential returns on your property investments with our comprehensive tool.
                  </p>
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    Download Free
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300">
                <CardContent className="p-8">
                  <BookOpen className="w-12 h-12 text-gold mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Market Analysis Guide
                  </h3>
                  <p className="text-gray-300 mb-6">
                    Learn how to analyze property markets like a pro with our step-by-step guide.
                  </p>
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    Download Free
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border-gray-700 hover:bg-gray-700 transition-all duration-300">
                <CardContent className="p-8">
                  <Trophy className="w-12 h-12 text-gold mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-3">
                    Wealth Building Checklist
                  </h3>
                  <p className="text-gray-300 mb-6">
                    A comprehensive checklist to track your journey to financial freedom.
                  </p>
                  <Button variant="outline" className="w-full border-gold text-gold hover:bg-gold hover:text-black">
                    Download Free
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 bg-gradient-to-r from-gold/10 to-gold/5">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Start Your Investment Journey?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Book a free consultation to discuss your property investment goals.
            </p>
            <Button size="lg" className="bg-gold hover:bg-gold/90 text-black font-semibold px-8 py-3">
              Book Free Consultation
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default FreeResources;