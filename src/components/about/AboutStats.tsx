
import { TrendingUp, Users, Globe, Award } from "lucide-react";

interface AboutStatsProps {
  isVisible: boolean;
  countUp: {
    projects: number;
    clients: number;
    years: number;
    satisfaction: number;
  };
}

export const AboutStats = ({ isVisible, countUp }: AboutStatsProps) => {
  const stats = [
    { icon: TrendingUp, label: "Properties Managed", value: countUp.projects, suffix: "+" },
    { icon: Users, label: "Happy Clients", value: countUp.clients, suffix: "+" },
    { icon: Globe, label: "Years Experience", value: countUp.years, suffix: "" },
    { icon: Award, label: "Satisfaction Rate", value: countUp.satisfaction, suffix: "%" }
  ];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '800ms' }}>
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="text-center p-6 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-lg border border-gold/20 transition-all duration-700 hover:border-gold/40"
        >
          <stat.icon className="w-8 h-8 text-gold mx-auto mb-3" />
          <div className="text-2xl font-light text-white mb-1">
            {stat.value}{stat.suffix}
          </div>
          <div className="text-xs text-gray-400 tracking-wider uppercase">
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
};
