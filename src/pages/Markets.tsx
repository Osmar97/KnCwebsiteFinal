
import { Markets } from "@/components/Markets";
import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";

const MarketsPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <Markets />
        <Contact />
      </div>
    </div>
  );
};

export default MarketsPage;
