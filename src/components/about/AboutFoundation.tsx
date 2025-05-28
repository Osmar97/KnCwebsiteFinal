
import { AboutFoundationHeader } from "./AboutFoundationHeader";
import { AboutMissionVision } from "./AboutMissionVision";
import { AboutValues } from "./AboutValues";

interface AboutFoundationProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundation = ({
  isVisible,
  scrolled
}: AboutFoundationProps) => {
  return (
    <>
      <AboutFoundationHeader isVisible={isVisible} scrolled={scrolled} />

      {/* Mission, Vision, Values Grid */}
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '600ms' }}>
        {/* Left Column - Mission & Vision */}
        <AboutMissionVision isVisible={isVisible} />
        
        {/* Right Column - Values */}
        <AboutValues isVisible={isVisible} />
      </div>
    </>
  );
};
