
import { Target, Eye } from "lucide-react";

interface AboutMissionVisionProps {
  isVisible: boolean;
}

export const AboutMissionVision = ({ isVisible }: AboutMissionVisionProps) => {
  return (
    <div className={`space-y-12 transition-all duration-1000 opacity-100 translate-x-0`}>
      {/* Mission */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Target className="w-8 h-8 text-gold" />
          <h3 className="text-2xl font-light text-gold tracking-wider">MISSION</h3>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed font-light">
          We are committed to being your reliable allies in the real estate market, uncovering lucrative investments, 
          building consistent value, and assuring long-term returns.
        </p>
      </div>

      {/* Vision */}
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Eye className="w-8 h-8 text-gold" />
          <h3 className="text-2xl font-light text-gold tracking-wider">VISION</h3>
        </div>
        <p className="text-gray-300 text-lg leading-relaxed font-light">
          To grow from a local enterprise to a global force, setting the benchmark in the real estate investment 
          industry in Portugal and West Africa.
        </p>
      </div>
    </div>
  );
};
