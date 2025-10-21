import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyCard from "@/components/properties/PropertyCard";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const Properties = () => {
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAdmin();
  
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

      if (filters.minPrice && filters.minPrice !== "no_limit") query = query.gte("price", parseFloat(filters.minPrice));
      if (filters.maxPrice && filters.maxPrice !== "no_limit") query = query.lte("price", parseFloat(filters.maxPrice));
      if (filters.minSize && filters.minSize !== "no_limit") query = query.gte("private_area", parseFloat(filters.minSize));
      if (filters.maxSize && filters.maxSize !== "no_limit") query = query.lte("private_area", parseFloat(filters.maxSize));
      if (filters.bedrooms && filters.bedrooms !== "any") query = query.eq("bedrooms", filters.bedrooms);
      if (filters.bathrooms && filters.bathrooms !== "any") {
        const bathroomsNum = parseInt(filters.bathrooms.replace("+", ""));
        if (filters.bathrooms.includes("+")) {
          query = query.gte("bathrooms", bathroomsNum);
        } else {
          query = query.eq("bathrooms", bathroomsNum);
        }
      }
      if (filters.condition && filters.condition !== "any") query = query.eq("condition", filters.condition);
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
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="container mx-auto px-4 py-16 mt-20">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl font-bold text-primary mb-2">Exclusive Properties</h1>
            <div className="h-1 w-24 bg-gold"></div>
          </div>
          {isAdminLoggedIn && (
            <Button 
              onClick={() => navigate("/admin/properties")}
              className="bg-gold hover:bg-gold-dark text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          )}
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </aside>

          {/* Properties Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-8">
              <p className="text-lg text-gray-600">
                {properties?.length || 0} Properties found
              </p>
              
              <div className="flex gap-3">
                <Button
                  variant={sortBy === "relevance" ? "default" : "outline"}
                  onClick={() => setSortBy("relevance")}
                  className={sortBy === "relevance" ? "bg-gold hover:bg-gold-dark text-white" : "border-gray-300 hover:border-gold"}
                >
                  By relevance
                </Button>
                <Button
                  variant={sortBy === "price_asc" ? "default" : "outline"}
                  onClick={() => setSortBy("price_asc")}
                  className={sortBy === "price_asc" ? "bg-gold hover:bg-gold-dark text-white" : "border-gray-300 hover:border-gold"}
                >
                  Cheapest
                </Button>
                <Button
                  variant={sortBy === "recent" ? "default" : "outline"}
                  onClick={() => setSortBy("recent")}
                  className={sortBy === "recent" ? "bg-gold hover:bg-gold-dark text-white" : "border-gray-300 hover:border-gold"}
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
              <div className="space-y-6">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-lg">
                <p className="text-gray-500 text-lg">No properties found with the selected filters.</p>
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
