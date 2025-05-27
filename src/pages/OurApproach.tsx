
import { Navigation } from "@/components/Navigation";
import { Markets } from "@/components/Markets";
import { Network } from "@/components/Network";
import { Team } from "@/components/Team";
import { Footer } from "@/components/Footer";

const OurApproachPage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Navigation />
      <div className="pt-16">
        <Markets />
        <Network />
        <Team />
      </div>
      <Footer />
    </div>
  );
};

export default OurApproachPage;
