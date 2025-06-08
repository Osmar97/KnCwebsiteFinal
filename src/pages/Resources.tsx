
import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AdminPostsFeed } from "@/components/AdminPostsFeed";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/contexts/AdminContext";
import { ResourcesGrid } from "@/components/resources/ResourcesGrid";

const ResourcesPage = () => {
  const { isAdminLoggedIn } = useAdmin();
  const [activeTab, setActiveTab] = useState<"articles" | "resources">("articles");
  
  if (isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-white text-gray-900">
        <Navigation />
        <div className="pt-16 bg-neutral-900">
          <div className="py-8 px-4">
            <AdminPostsFeed />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-light mb-6 tracking-wider">
              Resource <span className="text-gold">Hub</span>
            </h1>
            <p className="text-gray-300 text-lg max-w-3xl mx-auto leading-relaxed">
              Your gateway to expert insights, guides, and tools for successful property investment and relocation in Portugal.
            </p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-2 border border-gray-700">
              <Button
                variant={activeTab === "articles" ? "default" : "ghost"}
                onClick={() => setActiveTab("articles")}
                className={`px-8 py-3 rounded-md transition-all ${
                  activeTab === "articles"
                    ? "bg-gold text-black hover:bg-gold/90"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Articles
              </Button>
              <Button
                variant={activeTab === "resources" ? "default" : "ghost"}
                onClick={() => setActiveTab("resources")}
                className={`px-8 py-3 rounded-md transition-all ${
                  activeTab === "resources"
                    ? "bg-gold text-black hover:bg-gold/90"
                    : "text-gray-300 hover:text-white hover:bg-gray-700"
                }`}
              >
                Resources
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {activeTab === "articles" ? (
              <ResourcesGrid category="article" title="Latest Articles" />
            ) : (
              <ResourcesGrid category="resource" title="Essential Resources" />
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
