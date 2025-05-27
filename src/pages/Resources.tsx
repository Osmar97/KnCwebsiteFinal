
import { Contact } from "@/components/Contact";
import { Navigation } from "@/components/Navigation";

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <Contact />
      </div>
    </div>
  );
};

export default ResourcesPage;
