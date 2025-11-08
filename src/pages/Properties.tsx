import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const Properties = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAdmin();
  
  const [sortBy, setSortBy] = useState("relevance");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("properties" as any)
        .select("*")
        .eq("status", "active") as any;

      // Apply sorting
      if (sortBy === "price_asc") query = query.order("price", { ascending: true });
      else if (sortBy === "price_desc") query = query.order("price", { ascending: false });
      else if (sortBy === "recent") query = query.order("created_at", { ascending: false });

      const { data, error } = await query;
      if (error) throw error;
      return data as any[];
    },
  });

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 pt-20 sm:pt-24">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-12">
          <div className="w-full sm:w-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Exclusive Properties</h1>
            <div className="h-1 w-24 bg-gold"></div>
          </div>
          {isAdminLoggedIn && (
            <Button 
              onClick={() => navigate("/admin/properties")}
              className="bg-gold hover:bg-gold-dark text-white w-full sm:w-auto min-h-[44px]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>

        <div>
          {/* Properties Grid */}
          <main>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <p className="text-base sm:text-lg text-gray-300">
                {properties?.length || 0} Properties found
              </p>
              
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Button
                  variant={sortBy === "relevance" ? "default" : "outline"}
                  onClick={() => setSortBy("relevance")}
                  className={`min-h-[44px] ${sortBy === "relevance" ? "bg-gold hover:bg-gold-dark text-white" : "hover:border-gold"}`}
                >
                  By relevance
                </Button>
                <Button
                  variant={sortBy === "price_asc" ? "default" : "outline"}
                  onClick={() => setSortBy("price_asc")}
                  className={`min-h-[44px] ${sortBy === "price_asc" ? "bg-gold hover:bg-gold-dark text-white" : "hover:border-gold"}`}
                >
                  Cheapest
                </Button>
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  onClick={() => setSortBy("recent")}
                  className={`min-h-[44px] ${sortBy === "recent" ? "bg-gold hover:bg-gold-dark text-white" : "hover:border-gold"}`}
                >
                  Most recent
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-gold" />
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="space-y-4 sm:space-y-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 sm:py-16 bg-gray-800/50 rounded-lg">
                <p className="text-gray-300 text-base sm:text-lg px-4">No properties found with the selected filters.</p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Properties;
