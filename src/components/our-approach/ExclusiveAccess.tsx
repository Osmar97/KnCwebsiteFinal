
import { Eye, Handshake, Zap } from "lucide-react";

export const ExclusiveAccess = () => {
  const access = [
    {
      icon: Eye,
      title: "Off-Market Opportunities",
      description: "Access to high-potential, non-public properties in prime European and West African locations."
    },
    {
      icon: Handshake,
      title: "Strategic Partnerships",
      description: "Tap into the KnC network for exclusive deals with trusted developers and institutional partners."
    },
    {
      icon: Zap,
      title: "First-Mover Advantage",
      description: "Early access to top-tier assets, ahead of the market, giving you competitive positioning."
    }
  ];

  return (
    <section 
      className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-gold"></div>
            <span className="text-gold text-sm tracking-widest font-light">OUR COMMITMENT</span>
            <div className="w-8 h-0.5 bg-gold"></div>
          </div>
          <h2 className="text-3xl md:text-4xl font-light text-white mb-6 tracking-wider">
            ACCESS TO PREMIUM <span className="text-gold">DEALS</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-3xl mx-auto">
            Unlock exclusive investment opportunities reserved for our network members, featuring premium properties and strategic partnerships.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {access.map((item, index) => (
            <div key={index} className="bg-white/10 backdrop-blur-sm p-8 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center mb-6">
                <item.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">{item.title}</h3>
              <p className="text-gray-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
