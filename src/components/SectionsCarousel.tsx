import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const sections = [
  {
    title: "Our Approach",
    description: "Discover our strategic methodology for identifying and securing premium property investments.",
    image: "/lovable-uploads/empresa.png",
    link: "/our-approach",
  },
  {
    title: "Services",
    description: "From property tours to co-investment opportunities, explore our comprehensive service offerings.",
    image: "/lovable-uploads/companyPic.JPG",
    link: "/services",
  },
  {
    title: "Resources",
    description: "Access our curated collection of insights, guides, and market intelligence.",
    image: "/lovable-uploads/group.jpg",
    link: "/resources",
  },
];

export const SectionsCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % sections.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const current = sections[currentIndex];

  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px] md:min-h-[600px] overflow-visible">
          {/* Image */}
          <div className="relative h-[400px] md:h-[500px] rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover transition-opacity duration-500"
            />
          </div>

          {/* Content */}
          <div className="text-white space-y-6">
            <h2 className="text-4xl md:text-5xl font-light">
              {current.title}
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed">
              {current.description}
            </p>
            <Link to={current.link}>
              <Button className="bg-gold hover:bg-gold/90 text-black font-medium px-6 py-2 md:px-8 md:py-3 text-base md:text-lg">
                Learn More
              </Button>
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-4 pt-8">
              <button
                onClick={prev}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                aria-label="Previous"
              >
                <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
              </button>
              <div className="flex gap-2">
                {sections.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentIndex ? "bg-gold" : "bg-gray-600"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              <button
                onClick={next}
                className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gray-800 hover:bg-gold hover:text-black transition-colors flex items-center justify-center"
                aria-label="Next"
              >
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
