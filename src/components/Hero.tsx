
import ScrollExpandMedia from "@/components/ScrollExpandMedia";

const HeroContent = () => {
  return (
    <div className="max-w-6xl mx-auto text-center">
      <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
      
      <p className="text-gray-300 text-lg md:text-xl mb-3 max-w-3xl mx-auto leading-relaxed font-bold">
        Connecting Visionary Investors to Remarkable Properties
      </p>
      
      <p className="text-white text-xl mb-12 max-w-3xl mx-auto leading-relaxed md:text-base font-extralight py-[2px]">
        Welcome to Kings 'n Company
      </p>
    </div>
  );
};

export const Hero = () => {
  return (
    <ScrollExpandMedia
      mediaType="image"
      mediaSrc="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png"
      bgImageSrc="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png"
      title="Kings Company"
      subtitle="Scroll to Explore"
      scrollToExpand="Scroll to Expand"
    >
      <HeroContent />
    </ScrollExpandMedia>
  );
};
