import { Navigation } from "@/components/Navigation";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { Footer } from "@/components/Footer";
import { AdminPostsFeed } from "@/components/AdminPostsFeed";
import { useAdmin } from "@/contexts/AdminContext";
const ResourcesPage = () => {
  const {
    isAdminLoggedIn
  } = useAdmin();
  return <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16 bg-neutral-900">
        {isAdminLoggedIn && <div className="py-8 px-4">
            <AdminPostsFeed />
          </div>}
        <Testimonials />
        <Contact />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>;
};
export default ResourcesPage;