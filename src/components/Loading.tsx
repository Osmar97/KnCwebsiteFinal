
import logo from '../assets/logo.png';

export const Loading = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        {/* Logo with pulse animation */}
        <div className="relative">
          <img 
            src={logo} 
            alt="Kings 'n Company" 
            className="w-24 h-24 object-contain animate-pulse drop-shadow-[0_0_20px_rgba(160,143,42,0.8)]" 
          />
        </div>
        
        {/* Company name */}
        <div className="text-center">
          <h1 className="text-gold font-light text-2xl tracking-wider mb-2">
            Kings 'n Company
          </h1>
          <p className="text-gray-400 text-sm tracking-widest">
            REAL ESTATE NETWORK
          </p>
        </div>
        
        {/* Loading indicator */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse"></div>
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-2 h-2 bg-gold rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        </div>
      </div>
    </div>
  );
};
