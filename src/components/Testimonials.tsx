import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote, ChevronLeft, ChevronRight, Play } from "lucide-react";

export const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const sectionRef = useRef<HTMLElement>(null);

  const testimonials = [{
    id: 1,
    name: "Osmar da Graça",
    role: "Software Engineer",
    location: "Portugal",
    image: "/lovable-uploads/bf8148de-409a-4bd5-88c1-11dca2d5bdab.png",
    rating: 5,
    text: "After following Ismael's sale of my parents' house, I decided to ask for advice on possible investments. He was tireless in the search for the best solutions for me and my family. Helped me at every stage of the process, from buying to remodeling and then selling. In less than 6 months I managed to quadruple the invested capital! He walked me through some of the biggest decisions I have had to make — for that I am forever grateful. We will certainly do more business together.",
    highlight: "Quadrupled capital in 6 months",
    videoTestimonial: false
  }, {
    id: 2,
    name: "Trevor Lyons",
    role: "International Investor",
    location: "USA",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Knowledgeable about all things Lisbon and surrounding areas. He worked hard to make sure I chose the right investment property. I highly recommend him.",
    highlight: "Perfect investment property",
    videoTestimonial: false
  }, {
    id: 3,
    name: "Neville Gayle",
    role: "CEO, Gayle Financial",
    location: "USA",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "My family and I moved to Lisbon in August 2022 and Ishmael was a major part of our move. We actually 'found' him by mistake after a poor experience with another agency — and it turned out to be the best thing. Ishmael went above and beyond expectations: securing an apartment, guiding us through public services, applying for our NIFs, even picking us up at the airport. He did countless video calls while we were still in the US. His service was professional, personal, and ongoing even after we settled. We highly recommend him. Fantastic human being! Bonus: He speaks several languages — communication was effortless.",
    highlight: "Complete relocation support",
    videoTestimonial: true
  }];

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setIsVisible(true);
      }
    }, {
      threshold: 0.2
    });
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const nextTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(prev => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentTestimonial(index);
  };

  return <section ref={sectionRef} className="py-20 bg-gradient-to-b from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background Animation */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl animate-pulse" style={{
        animationDelay: '3s'
      }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-6">
            <Quote className="w-6 h-6 text-gold animate-pulse" />
            <span className="text-gold text-sm tracking-widest font-light">SUCCESS STORIES</span>
            <Quote className="w-6 h-6 text-gold animate-pulse transform rotate-180" />
          </div>
          
          <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-wider">
            VOICES OF <span className="text-gold">SUCCESS</span>
          </h2>
          
          <div className="w-32 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent mx-auto mb-8"></div>
          
          <p className="text-gray-300 text-xl max-w-4xl mx-auto font-light leading-relaxed">Real stories from clients who transformed their property ownership journey with Kings 'n Company</p>
        </div>

        {/* Main Testimonial Display */}
        <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <Card className="bg-gradient-to-br from-gray-900/80 to-black/80 border-gray-700/50 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
                {/* Client Image & Info */}
                <div className="lg:col-span-2 p-8 lg:p-12 bg-gradient-to-br from-gold/10 to-gold/5 relative">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <div className="w-32 h-32 mx-auto mb-6 relative">
                      <img src={testimonials[currentTestimonial].image} alt={testimonials[currentTestimonial].name} className="w-full h-full rounded-full object-cover border-4 border-gray-600/50 shadow-2xl" />
                      {testimonials[currentTestimonial].videoTestimonial && <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-gold/90 rounded-full flex items-center justify-center cursor-pointer hover:bg-gold transition-colors">
                            <Play className="w-5 h-5 text-black ml-0.5" />
                          </div>
                        </div>}
                    </div>
                    
                    <div className="text-center">
                      <h3 className="text-xl font-medium text-white mb-2">{testimonials[currentTestimonial].name}</h3>
                      <p className="text-gold text-sm mb-1">{testimonials[currentTestimonial].role}</p>
                      <p className="text-gray-400 text-xs mb-4">{testimonials[currentTestimonial].location}</p>
                      
                      {/* Rating */}
                      <div className="flex justify-center mb-4">
                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => <Star key={i} className="w-4 h-4 text-gold fill-current" />)}
                      </div>
                      
                      {/* Highlight Badge */}
                      <div className="inline-flex items-center px-4 py-2 bg-gold/20 rounded-full border border-gray-600/50">
                        <span className="text-gold text-xs font-medium">{testimonials[currentTestimonial].highlight}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Testimonial Content */}
                <div className="lg:col-span-3 p-8 lg:p-12 flex flex-col justify-center">
                  <div className="relative">
                    <Quote className="w-12 h-12 text-gold/30 mb-6" />
                    
                    <blockquote className="text-white text-lg lg:text-xl font-light leading-relaxed mb-8">
                      "{testimonials[currentTestimonial].text}"
                    </blockquote>
                    
                    <Quote className="w-12 h-12 text-gold/30 ml-auto transform rotate-180" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between mt-8">
            <button onClick={prevTestimonial} className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <ChevronLeft className="w-5 h-5 text-gold" />
            </button>

            {/* Dots Indicator */}
            <div className="flex space-x-3">
              {testimonials.map((_, index) => <button key={index} onClick={() => goToTestimonial(index)} className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-gold scale-125' : 'bg-gray-600 hover:bg-gray-500'}`} />)}
            </div>

            <button onClick={nextTestimonial} className="w-12 h-12 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600/50 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
              <ChevronRight className="w-5 h-5 text-gold" />
            </button>
          </div>
        </div>

        {/* Additional Testimonials Grid */}
        <div className={`mt-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
        transitionDelay: '500ms'
      }}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((testimonial, index) => <Card key={testimonial.id} className={`bg-gradient-to-br from-gray-900/50 to-black/50 border-gray-700/30 hover:border-gray-600/50 transition-all duration-500 cursor-pointer group ${index === currentTestimonial ? 'ring-2 ring-gray-600/50' : ''}`} onClick={() => goToTestimonial(index)}>
                <CardContent className="p-6 bg-stone-600">
                  <div className="flex items-center mb-4">
                    <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover border-2 border-gray-600/50" />
                    <div className="ml-3">
                      <h4 className="text-white text-sm font-medium">{testimonial.name}</h4>
                      <p className="text-gold text-xs">{testimonial.role}</p>
                    </div>
                    {testimonial.videoTestimonial && <Play className="w-4 h-4 text-gold ml-auto" />}
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 group-hover:text-white transition-colors">
                    "{testimonial.text.substring(0, 120)}..."
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => <Star key={i} className="w-3 h-3 text-gold fill-current" />)}
                    </div>
                    <span className="text-gold text-xs">{testimonial.highlight}</span>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>
      </div>
    </section>;
};
