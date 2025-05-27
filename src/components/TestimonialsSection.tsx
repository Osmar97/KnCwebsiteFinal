
const TestimonialsSection = () => {
  const testimonials = [
    {
      quote: "Kings 'n Company transformed our investment approach. Their strategic insights and market expertise delivered exceptional returns while maintaining our risk tolerance.",
      author: "Sarah Mitchell",
      title: "Private Investor"
    },
    {
      quote: "The team's dedication to building generational wealth is unmatched. They don't just manage investments; they create legacies.",
      author: "Robert Chen",
      title: "Family Office"
    },
    {
      quote: "Professional, transparent, and results-driven. Our portfolio has never been stronger since partnering with Kings 'n Company.",
      author: "Maria Rodriguez",
      title: "Real Estate Developer"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-playfair text-gray-900 mb-4">
            Testimonies
          </h2>
          <p className="text-lg text-gray-600">
            What our partners say about working with us
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gray-50 p-8 rounded-lg">
              <div className="mb-6">
                <svg className="w-8 h-8 text-[#85754E] mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                </svg>
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-900">{testimonial.author}</p>
                <p className="text-sm text-[#85754E]">{testimonial.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
