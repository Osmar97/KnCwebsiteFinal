
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

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
      src: "/lovable-uploads/6878dbbf-107a-49b2-9f83-8b5f80475ec3.png",
      caption: "Building Strategic partnerships across international markets"
    },
    {
      src: "/lovable-uploads/b5d3fba7-8c85-468e-8be4-e95cfa450c3d.png", 
      caption: "Building Strategic partnerships across international markets"
    }
  ];

  const slideshow2Images = [
    {
      src: "/lovable-uploads/bfa967c7-41be-465d-b365-f92e8bfe1157.png",
      caption: "Focused on meaningful connections and long-term success"
    },
    {
      src: "/lovable-uploads/8d600b5d-8c96-4531-a554-b94a8fda9ceb.png",
      caption: "Focused on meaningful connections and long-term success"
    }
  ];

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
          <Carousel className="w-full">
            <CarouselContent>
              {slideshow1Images.map((image, index) => (
                <CarouselItem key={index}>
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        
        {/* Second Slideshow */}
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {slideshow2Images.map((image, index) => (
                <CarouselItem key={index}>
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
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </div>
  );
};
