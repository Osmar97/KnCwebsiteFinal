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
  return <>
      <AboutFoundationHeader isVisible={isVisible} scrolled={scrolled} />

      {/* Mission, Vision, Values Grid */}
      
    </>;
};