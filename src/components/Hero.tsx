
const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <img 
              src="/lovable-uploads/c5d1ec68-72d2-41a4-abbf-7a3d34e321b3.png" 
              alt="Kings 'n Company Logo" 
              className="h-32 w-auto"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mx-auto">
            A real estate investment consultancy firm that seamlessly blends the strengths of regional market expertise 
            with an expansive network of international investors and partners.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
