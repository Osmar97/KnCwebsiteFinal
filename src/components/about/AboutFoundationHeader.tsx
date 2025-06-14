
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";

interface AboutFoundationHeaderProps {
  isVisible: boolean;
  scrolled: boolean;
}

export const AboutFoundationHeader = ({
  isVisible,
  scrolled
}: AboutFoundationHeaderProps) => {
  const slideshow1Images = [
    {
      src: "/lovable-uploads/Presidente.HEIC",
      caption: "Building Strategic partnerships across international markets"
    },
    {
      src: "/lovable-uploads/nuno_isma.HEIC",
      caption: "Building Strategic partnerships across international markets"
    },
    {
      src: "/lovable-uploads/Isma_CV.jpg", 
      caption: "Building Strategic partnerships across international markets"
    },
    {
      src: "/lovable-uploads/group.jpg", 
      caption: "Building Strategic partnerships across international markets"
    }
  ];

  const slideshow2Images = [
    {
      src: "/lovable-uploads/discurso.jpg",
      caption: "Focused on meaningful connections and long-term success"
    },
    {
      src: "/lovable-uploads/companyPic.JPG",
      caption: "Focused on meaningful connections and long-term success"
    },
    {
      src: "/lovable-uploads/isma_people.jpg",
      caption: "Focused on meaningful connections and long-term success"
    },
    {
      src: "/lovable-uploads/lessons.jpg",
      caption: "Focused on meaningful connections and long-term success"
    }
  ];

  // First slideshow carousel
  const [emblaRef1, emblaApi1] = useEmblaCarousel({ loop: true });
  
  // Second slideshow carousel
  const [emblaRef2, emblaApi2] = useEmblaCarousel({ loop: true });

  // Auto-play functionality for first slideshow
  useEffect(() => {
    if (!emblaApi1) return;

    const interval = setInterval(() => {
      emblaApi1.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi1]);

  // Auto-play functionality for second slideshow
  useEffect(() => {
    if (!emblaApi2) return;

    const interval = setInterval(() => {
      emblaApi2.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [emblaApi2]);

  return (
    <div className={`mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-100 translate-y-0'}`}>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
          OUR <span className="text-gold">STATEMENT</span>
        </h2>
        <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
        <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">
          Our foundation is built on trust, excellence, and a commitment to creating lasting value in every partnership.
        </p>
      </div>

      {/* Slideshows Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* First Slideshow */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef1}>
            <div className="flex">
              {slideshow1Images.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative overflow-hidden rounded-lg group">
                    <img 
                      src={image.src}
                      alt={image.caption}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white text-lg font-light">{image.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Second Slideshow */}
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef2}>
            <div className="flex">
              {slideshow2Images.map((image, index) => (
                <div key={index} className="flex-[0_0_100%] min-w-0">
                  <div className="relative overflow-hidden rounded-lg group">
                    <img 
                      src={image.src}
                      alt={image.caption}
                      className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white text-lg font-light">{image.caption}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
