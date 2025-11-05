import { useState } from "react";
import { useToast } from "./use-toast";

export const useGeocoding = () => {
  const [isVerifying, setIsVerifying] = useState(false);
  const { toast } = useToast();

  const verifyAddress = async (address: string) => {
    setIsVerifying(true);
    try {
      // Using OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`,
        {
          headers: {
            'User-Agent': 'KingsNCompany Property Management'
          }
        }
      );

      if (!response.ok) {
        throw new Error("Failed to verify address");
      }

      const data = await response.json();
      
      if (data && data.length > 0) {
        const result = data[0];
        toast({
          title: "Morada verificada",
          description: `${result.display_name}`,
        });
        return {
          latitude: parseFloat(result.lat),
          longitude: parseFloat(result.lon),
          formatted_address: result.display_name,
        };
      } else {
        toast({
          title: "Morada não encontrada",
          description: "Por favor, verifique os dados inseridos",
          variant: "destructive",
        });
        return null;
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      toast({
        title: "Erro ao verificar morada",
        description: "Tente novamente mais tarde",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsVerifying(false);
    }
  };

  return { verifyAddress, isVerifying };
};
