
import { About } from "@/components/About";
import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <About />
        <Contact />
      </div>
    </div>
  );
};

export default AboutPage;
