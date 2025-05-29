
import { Navigation } from "@/components/Navigation";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";
import { AdminPostsFeed } from "@/components/AdminPostsFeed";
import { useAdmin } from "@/contexts/AdminContext";

const ResourcesPage = () => {
  const { isAdminLoggedIn } = useAdmin();

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        {isAdminLoggedIn && (
          <div className="py-8 px-4">
            <AdminPostsFeed />
          </div>
        )}
        {!isAdminLoggedIn && (
          <div className="py-20 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-light text-gray-900 mb-6 tracking-wider">
                RESOURCES
              </h1>
              <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
              <p className="text-gray-600 text-xl font-light leading-relaxed">
                Discover insights and updates from Kings 'n Company
              </p>
            </div>
          </div>
        )}
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default ResourcesPage;
