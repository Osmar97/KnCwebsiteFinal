import ScrollExpandMedia from "@/components/ScrollExpandMedia";

const HeroContent = () => {
  return null; // Nothing rendered
};

export const Hero = () => {
  return (
    <>
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png"
        bgImageSrc="/lovable-uploads/337220a5-f9c3-4004-8340-e9f3d28e4466.png"
        subtitle=""
        scrollToExpand=""
      >
        <HeroContent />
      </ScrollExpandMedia>
      {/* Marks the bottom of the hero — drives navbar transparency. */}
      <div data-hero-sentinel aria-hidden className="h-px w-full" />
    </>
  );
};
