
const ProcessSection = () => {
  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-sm font-medium text-[#85754E] mb-4 tracking-wider uppercase">
            Our Process
          </h2>
          <h3 className="text-4xl md:text-5xl font-playfair mb-6">
            A Formula With Undeniable Proof Of Success
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">1</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Foundations + Key Analysis</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Deep market research and comprehensive analysis that ensures strategic insights, 
              making us expert decision makers at every stage.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">2</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Setting-up Systems</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Creating key processes and systems for streamlined analytics, client communication, 
              and reporting that sets the stage for consistent excellence.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-red-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
              <span className="text-white font-bold text-xl">3</span>
            </div>
            <h4 className="text-xl font-semibold mb-3">Full-Gas</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              With the foundation and systems in place, we full throttle into implementation, 
              delivering results and ROI to the fullest.
            </p>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Market Analysis</span>
              <span>95%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{width: '95%'}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Client Satisfaction</span>
              <span>98%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 h-2 rounded-full" style={{width: '98%'}}></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>ROI Performance</span>
              <span>92%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-gradient-to-r from-pink-500 to-red-600 h-2 rounded-full" style={{width: '92%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessSection;
