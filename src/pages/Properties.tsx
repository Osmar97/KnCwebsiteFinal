import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { GlobalCTA } from "@/components/GlobalCTA";

import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const Properties = () => {
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    document.title = "Properties — Kings 'n Company";
  }, []);

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", sortBy],
    queryFn: async () => {
      let query = supabase
        .from("properties_public" as any)
        .select("*") as any;

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
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-[76px] sm:pt-20 pb-12 sm:pb-16">
        <div className="mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">Exclusive Properties</h1>
          <div className="h-1 w-24 bg-gold"></div>
        </div>

        <div>
          {/* Properties Grid */}
          <main>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden">
                    <Skeleton className="h-56 w-full bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-5 w-3/4 bg-gray-800" />
                      <Skeleton className="h-4 w-1/2 bg-gray-800" />
                      <Skeleton className="h-3 w-full bg-gray-800" />
                    </div>
                  </div>
                ))}
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

      <GlobalCTA />
      <Footer />
    </div>
  );
};

export default Properties;
