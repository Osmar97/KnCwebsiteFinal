
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
          <div key={index} className="text-center">
            <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <IconComponent className="w-8 h-8 text-gold" />
            </div>
            <div className="text-3xl font-light text-white mb-2">
              {stat.value}{stat.suffix}
            </div>
            <div className="text-gray-400 text-sm tracking-wider">
              {stat.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};
