import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const Properties = () => {
  const [filters, setFilters] = useState({
    transactionType: "Comprar",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    propertyTypes: [] as string[],
    bedrooms: "",
    bathrooms: "",
    condition: "",
    features: [] as string[],
  });

  const [sortBy, setSortBy] = useState("relevance");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters, sortBy],
    queryFn: async () => {
      let query = supabase
        .from("properties" as any)
        .select("*")
        .eq("status", "active")
        .eq("transaction_type", filters.transactionType) as any;

      if (filters.minPrice) query = query.gte("price", parseFloat(filters.minPrice));
      if (filters.maxPrice) query = query.lte("price", parseFloat(filters.maxPrice));
      if (filters.minSize) query = query.gte("private_area", parseFloat(filters.minSize));
      if (filters.maxSize) query = query.lte("private_area", parseFloat(filters.maxSize));
      if (filters.bedrooms) query = query.eq("bedrooms", filters.bedrooms);
      if (filters.bathrooms) {
        const bathroomsNum = parseInt(filters.bathrooms.replace("+", ""));
        if (filters.bathrooms.includes("+")) {
          query = query.gte("bathrooms", bathroomsNum);
        } else {
          query = query.eq("bathrooms", bathroomsNum);
        }
      }
      if (filters.condition) query = query.eq("condition", filters.condition);
      if (filters.propertyTypes.length > 0) {
        query = query.in("property_type", filters.propertyTypes);
      }

      // Apply feature filters
      filters.features.forEach((feature) => {
        query = query.eq(feature, true);
      });

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
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-foreground">
                {properties?.length || 0} Imóveis encontrados
              </h1>
              
              <div className="flex gap-2">
                <Button
                  variant={sortBy === "relevance" ? "default" : "outline"}
                  onClick={() => setSortBy("relevance")}
                >
                  Por relevância
                </Button>
                <Button
                  variant={sortBy === "price_asc" ? "default" : "outline"}
                  onClick={() => setSortBy("price_asc")}
                >
                  Baratos
                </Button>
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  onClick={() => setSortBy("recent")}
                >
                  Mais recentes
                </Button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : properties && properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum imóvel encontrado com os filtros selecionados.</p>
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
