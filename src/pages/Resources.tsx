
import { Navigation } from "@/components/Navigation";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <Testimonials />
        <Contact />
      </div>
    </div>
  );
};

export default ResourcesPage;
