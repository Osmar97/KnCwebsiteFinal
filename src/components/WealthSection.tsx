
const WealthSection = () => {
  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900"></div>
      
      {/* Background decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full border border-[#85754E]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full border border-[#85754E]"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Decorative line */}
        <div className="flex items-center justify-center mb-8">
          <div className="h-px bg-[#85754E] flex-1 max-w-24"></div>
          <div className="w-3 h-3 bg-[#85754E] rounded-full mx-4"></div>
          <div className="h-px bg-[#85754E] flex-1 max-w-24"></div>
        </div>

        <h2 className="text-4xl md:text-6xl font-playfair mb-8 leading-tight">
          IT'S ABOUT BUILDING GENERATIONAL<br />
          <span className="text-[#85754E]">WEALTH, BRICK BY BRICK.</span>
        </h2>

        <p className="text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
          Our commitment goes beyond immediate returns. We focus on creating sustainable, 
          long-term wealth that can be passed down through generations, building a legacy 
          that stands the test of time.
        </p>
      </div>
    </section>
  );
};

export default WealthSection;
