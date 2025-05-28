
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

export const AboutStats = ({
  isVisible,
  countUp
}: AboutStatsProps) => {
  const stats = [{
    icon: TrendingUp,
    label: "Properties Managed",
    value: countUp.projects,
    suffix: "+"
  }, {
    icon: Users,
    label: "Happy Clients",
    value: countUp.clients,
    suffix: "+"
  }, {
    icon: Globe,
    label: "Years Experience",
    value: countUp.years,
    suffix: ""
  }, {
    icon: Award,
    label: "Satisfaction Rate",
    value: countUp.satisfaction,
    suffix: "%"
  }];

  return (
    <div className={`grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{
      transitionDelay: '800ms'
    }}>
      {stats.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <div key={index} className="text-center group">
            <div className="w-16 h-16 bg-gradient-to-br from-gold/20 to-gold/40 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <IconComponent className="w-8 h-8 text-gold" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-gray-300 text-sm tracking-wide">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
