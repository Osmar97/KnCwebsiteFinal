
import { Network } from "@/components/Network";
import { Team } from "@/components/Team";
import { Navigation } from "@/components/Navigation";
import { Contact } from "@/components/Contact";

const NetworkPage = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="pt-16">
        <Network />
        <Team />
        <Contact />
      </div>
    </div>
  );
};

export default NetworkPage;
