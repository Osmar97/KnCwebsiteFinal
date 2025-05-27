
export const GenerationalWealthHero = () => {
  return (
    <section className="relative h-96 bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src="/lovable-uploads/dcced678-3441-4351-aaa5-a61d24aaef79.png" 
          alt="Generational Wealth" 
          className="w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-light text-white mb-4 tracking-wider leading-tight">
            IT'S ABOUT BUILDING GENERATIONAL
          </h2>
          <p className="text-2xl md:text-4xl font-light text-gold tracking-wider">
            WEALTH, BRICK BY BRICK.
          </p>
        </div>
      </div>
    </section>
  );
};
