import { ShieldCheck, Landmark, Users, Globe } from "lucide-react";

interface AboutValuesProps {
  isVisible: boolean;
}

export const AboutValues = ({ isVisible }: AboutValuesProps) => {
  const values = [
    {
      icon: ShieldCheck,
      title: "Integrity",
      description: "Do what's right, even when no one is watching."
    },
    {
      icon: Users,
      title: "Unity",
      description: "Success is built through collaboration, shared purpose, and mutual respect."
    },
    {
      icon: Globe,
      title: "Empowerment",
      description: "Striving to leave a meaningful mark on our communities and future generations."
    }
  ];

  return (
    <div className="transition-all duration-1000 opacity-100 translate-x-0">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="text-gold">
            <Landmark className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-light text-gold tracking-wider">VALUES</h3>
        </div>
        
        <div className="space-y-6">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <div 
                key={index}
                className="p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gold/20 transition-all duration-700 hover:border-gold/40 opacity-100 translate-y-0"
              >
                <div className="flex items-start gap-4">
                  <Icon className="w-6 h-6 text-gold mt-1 flex-shrink-0" />
                  <div>
                    <h4 className="text-white font-medium mb-2 tracking-wider">{value.title}</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
