
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { GenerationalWealthHero } from "@/components/GenerationalWealthHero";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const ContactPage = () => {
  useScrollToTop();

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <Contact />
      </div>
      <GenerationalWealthHero />
      <Footer />
    </div>
  );
};

export default ContactPage;
