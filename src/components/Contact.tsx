import { Card } from "@/components/ui/card";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { ContactEmailDialog } from "@/components/ContactEmailDialog";

export const Contact = () => {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-[#181C23] via-[#191B20] to-black relative pt-8 pb-14 px-2">
      {/* Decorative element, optional */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
      </div>
      {/* Hero */}
      <div className="relative z-10 mt-8 mb-12 flex flex-col items-center">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-gold text-sm tracking-widest font-light">LET&apos;S CONNECT</span>
          <span className="text-gold animate-pulse text-lg -mt-1">✧</span>
        </div>
        <h1 className="text-[2.3rem] leading-tight sm:text-5xl md:text-6xl font-light tracking-wider text-center text-white mb-3">
          BEGIN YOUR <span className="text-gold font-normal">JOURNEY</span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg text-center font-light max-w-xl">
          Every extraordinary investment story begins with a conversation. <br className="hidden sm:inline" />
          Let&apos;s start writing yours.
        </p>
      </div>

      {/* Contact Card */}
      <Card className="relative z-10 max-w-2xl w-full mx-auto rounded-xl sm:rounded-2xl bg-[#2C2D32]/90 backdrop-blur-lg shadow-2xl px-6 py-8 sm:px-10 sm:py-10 border-none flex flex-col animate-fade-in">
        <div className="text-center mb-7">
          <div className="flex flex-col items-center">
            <div className="w-40 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent my-2"></div>
            <div className="text-gold text-lg tracking-wider font-light mb-3">CONNECT WITH US</div>
          </div>
        </div>
        <div className="space-y-8">
          {/* Email */}
          <div className="flex items-start gap-5">
            <div>
              <div className="rounded-full bg-gold/15 h-12 w-12 flex items-center justify-center">
                <Mail className="w-7 h-7 text-gold" />
              </div>
            </div>
            <div>
              <div className="font-semibold text-white text-lg">Direct Contact</div>
              <ContactEmailDialog>
                <span className="text-gold hover:underline transition text-base cursor-pointer">
                  services@kingsncompany.com
                </span>
              </ContactEmailDialog>
              <div className="text-gray-400 text-xs mt-1">
                Get a response within 24 hours
              </div>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-start gap-5">
            <div>
              <div className="rounded-full bg-gold/15 h-12 w-12 flex items-center justify-center">
                <Phone className="w-7 h-7 text-gold" />
              </div>
            </div>
            <div>
              <div className="font-semibold text-white text-lg">Consultation Line</div>
              <a
                href="tel:+351939953609"
                className="text-gold hover:underline transition text-base"
              >
                +351 939 953 609
              </a>
              <div className="text-gray-400 text-xs mt-1">
                Available Mon-Fri
              </div>
            </div>
          </div>
          {/* Booking */}
          <div className="flex items-start gap-5">
            <div>
              <div className="rounded-full bg-gold/15 h-12 w-12 flex items-center justify-center">
                <Mail className="w-7 h-7 text-gold" /> 
              </div>
            </div>
            <div>
              <div className="font-semibold text-white text-lg">Schedule a Consultation</div>
              <Link
                to="/booking"
                className="text-gold hover:underline transition text-base"
              >
                Book your appointment
              </Link>
              <div className="text-gray-400 text-xs mt-1">
                Choose your preferred time slot
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
};
