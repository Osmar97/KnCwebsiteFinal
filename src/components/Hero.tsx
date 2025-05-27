
const Hero = () => {
  return (
    <section className="bg-gradient-to-b from-gray-50 to-white py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Logo */}
        <div className="mb-12">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <path
                  d="M15 25 L35 15 L55 25 L75 15 L85 35 L75 55 L85 75 L65 85 L45 75 L25 85 L15 65 L25 45 Z"
                  fill="none"
                  stroke="#85754E"
                  strokeWidth="1.5"
                />
                <circle cx="30" cy="30" r="2" fill="#85754E" />
                <circle cx="50" cy="25" r="2" fill="#85754E" />
                <circle cx="70" cy="30" r="2" fill="#85754E" />
                <circle cx="35" cy="50" r="2" fill="#85754E" />
                <circle cx="65" cy="50" r="2" fill="#85754E" />
                <circle cx="30" cy="70" r="2" fill="#85754E" />
                <circle cx="50" cy="75" r="2" fill="#85754E" />
                <circle cx="70" cy="70" r="2" fill="#85754E" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-playfair text-[#85754E] mb-4">
            Kings 'n Company
          </h1>
          <p className="text-xl text-gray-600 font-light">
            Real Estate Network
          </p>
        </div>

        {/* Tagline */}
        <div className="mb-16">
          <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
            A real estate investment firm delivering wealth building strategies of superior income potential 
            and asset management services to investment partners.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
