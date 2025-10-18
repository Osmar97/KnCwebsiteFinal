import { useState, useEffect, ReactNode } from "react";

interface ScrollExpandMediaProps {
  mediaType: "image" | "video";
  mediaSrc: string;
  bgImageSrc?: string;
  subtitle?: string;
  scrollToExpand?: string;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType,
  mediaSrc,
  bgImageSrc,
  subtitle,
  scrollToExpand,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      const progress = Math.min(scrollPosition / (windowHeight * 0.5), 1);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scale = 0.6 + scrollProgress * 0.4;
  const opacity = 0.3 + scrollProgress * 0.7;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background Image */}
      {bgImageSrc && (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${bgImageSrc})`,
            opacity: opacity * 0.3,
          }}
        />
      )}

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Media Container */}
        <div
          className="relative w-full max-w-4xl mx-auto transition-transform duration-300"
          style={{
            transform: `scale(${scale})`,
          }}
        >
          {/* Logo/Media */}
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            {mediaType === "image" ? (
              <img
                src={mediaSrc}
                alt="Hero Media"
                className="w-full h-full object-contain bg-black"
              />
            ) : (
              <video
                src={mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            )}
          </div>

          {/* Decorative Line */}
          <div className="w-32 h-px bg-gold mt-8 mx-auto" />

          {/* Subtitle */}
          {subtitle && (
            <p className="text-center text-gray-400 text-lg mt-4 font-light tracking-wide">
              {subtitle}
            </p>
          )}

          {/* Scroll Indicator */}
          {scrollToExpand && scrollProgress < 0.5 && (
            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-gray-400 text-sm animate-bounce">
              {scrollToExpand}
            </div>
          )}
        </div>

        {/* Children Content */}
        {children}
      </div>
    </section>
  );
};

export default ScrollExpandMedia;
