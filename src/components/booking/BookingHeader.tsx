
interface BookingHeaderProps {}

const BookingHeader = ({}: BookingHeaderProps) => {
  return (
    <div className="text-center mb-12">
      <div className="inline-block px-6 py-2 border border-gold rounded-full text-gold text-sm mb-6">
        GET STARTED
      </div>
      <h1 className="text-4xl md:text-5xl font-bold mb-6">
        Tell Us More About Your Business
      </h1>
      <p className="text-gray-300 text-lg mb-4 max-w-2xl mx-auto">
        Before booking a demo call, fill in the form with your company's info
        so we can curate the perfect fit.
      </p>
      <p className="text-gray-400">
        We'll get back to you ASAP to confirm our meeting.
      </p>
    </div>
  );
};

export default BookingHeader;
