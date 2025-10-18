import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PropertyFilters } from "@/components/properties/PropertyFilters";
import { PropertyCard } from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";

export default function Properties() {
  const [filters, setFilters] = useState({
    transactionType: "Comprar",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
    propertyTypes: [] as string[],
    bedrooms: [] as string[],
    bathrooms: [] as string[],
    condition: [] as string[],
    features: {
      airConditioning: false,
      builtInWardrobes: false,
      elevator: false,
      balconyTerrace: false,
      parking: false,
      garden: false,
      pool: false,
      storage: false,
      adaptedHouse: false,
      luxuryHouse: false,
      seaView: false,
    },
  });

  const [sortBy, setSortBy] = useState("relevance");

  const { data: properties, isLoading } = useQuery({
    queryKey: ["properties", filters],
    queryFn: async () => {
      let query = supabase
        .from("properties")
        .select("*")
        .eq("status", "active")
        .eq("transaction_type", filters.transactionType);

      if (filters.minPrice) {
        query = query.gte("price", parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        query = query.lte("price", parseFloat(filters.maxPrice));
      }
      if (filters.minSize) {
        query = query.gte("private_area", parseFloat(filters.minSize));
      }
      if (filters.maxSize) {
        query = query.lte("private_area", parseFloat(filters.maxSize));
      }
      if (filters.propertyTypes.length > 0) {
        query = query.in("property_type", filters.propertyTypes);
      }
      if (filters.bedrooms.length > 0) {
        query = query.in("bedrooms", filters.bedrooms);
      }
      if (filters.bathrooms.length > 0) {
        query = query.in("bathrooms", filters.bathrooms.map(b => parseInt(b.replace('+', ''))));
      }
      if (filters.condition.length > 0) {
        query = query.in("condition", filters.condition);
      }

      // Apply feature filters
      if (filters.features.airConditioning) query = query.eq("air_conditioning", true);
      if (filters.features.builtInWardrobes) query = query.eq("built_in_wardrobes", true);
      if (filters.features.elevator) query = query.eq("elevator", true);
      if (filters.features.balconyTerrace) query = query.eq("balcony_terrace", true);
      if (filters.features.parking) query = query.eq("parking", true);
      if (filters.features.garden) query = query.eq("garden", true);
      if (filters.features.pool) query = query.eq("pool", true);
      if (filters.features.storage) query = query.eq("storage", true);
      if (filters.features.adaptedHouse) query = query.eq("adapted_house", true);
      if (filters.features.luxuryHouse) query = query.eq("luxury_house", true);
      if (filters.features.seaView) query = query.eq("sea_view", true);

      if (sortBy === "price_asc") {
        query = query.order("price", { ascending: true });
      } else if (sortBy === "price_desc") {
        query = query.order("price", { ascending: false });
      } else if (sortBy === "recent") {
        query = query.order("created_at", { ascending: false });
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Propriedades</h1>
            <div className="flex gap-4">
              <Button
                variant={filters.transactionType === "Comprar" ? "default" : "ghost"}
                onClick={() => setFilters({ ...filters, transactionType: "Comprar" })}
              >
                Comprar
              </Button>
              <Button
                variant={filters.transactionType === "Arrendar" ? "default" : "ghost"}
                onClick={() => setFilters({ ...filters, transactionType: "Arrendar" })}
              >
                Arrendar
              </Button>
              <Button
                variant={filters.transactionType === "Nova construção" ? "default" : "ghost"}
                onClick={() => setFilters({ ...filters, transactionType: "Nova construção" })}
              >
                Nova construção
              </Button>
            </div>
          </div>
          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Ver no mapa
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <aside className="lg:col-span-1">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </aside>

          <main className="lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <p className="text-muted-foreground">
                {properties?.length || 0} propriedades encontradas
              </p>
              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border rounded-md bg-background"
                >
                  <option value="relevance">Por relevância</option>
                  <option value="price_asc">Baratos</option>
                  <option value="price_desc">Mais recentes</option>
                  <option value="recent">Mais</option>
                </select>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">Carregando...</div>
            ) : properties && properties.length > 0 ? (
              <div className="space-y-4">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                Nenhuma propriedade encontrada
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
