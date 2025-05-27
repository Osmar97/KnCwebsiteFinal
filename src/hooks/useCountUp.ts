
import { useState, useEffect } from "react";

export const useCountUp = (isVisible: boolean) => {
  const [countUp, setCountUp] = useState({ projects: 0, clients: 0, years: 0, satisfaction: 0 });

  useEffect(() => {
    if (isVisible) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        setCountUp({
          projects: Math.floor(150 * progress),
          clients: Math.floor(500 * progress),
          years: Math.floor(12 * progress),
          satisfaction: Math.floor(98 * progress)
        });
        
        if (step >= steps) clearInterval(timer);
      }, interval);

      return () => clearInterval(timer);
    }
  }, [isVisible]);

  return countUp;
};
