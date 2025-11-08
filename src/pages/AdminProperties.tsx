import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PropertyEditor from "@/components/properties/PropertyEditor";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";

const AdminProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showList, setShowList] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  // Handle edit query parameter
  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && properties) {
      const propertyToEdit = properties.find(p => p.id === editId);
      if (propertyToEdit) {
        setEditingProperty(propertyToEdit);
        setShowList(false);
      }
    }
  }, [searchParams, properties]);

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("properties" as any).delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast({ title: "Imóvel eliminado com sucesso" });
    },
  });

  const handleEdit = (property: any) => {
    setEditingProperty(property);
    setShowList(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este imóvel?")) {
      deleteMutation.mutate(id);
    }
  };

  if (!showList) {
    return (
      <PropertyEditor
        property={editingProperty}
        onClose={() => {
          setShowList(true);
          setEditingProperty(null);
          setSearchParams({});
          queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-28">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold">Property Management</h1>
          <Button 
            onClick={() => { setEditingProperty(null); setShowList(false); }}
            className="w-full sm:w-auto min-h-[44px] bg-gold hover:bg-gold-dark text-black"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading...</div>
        ) : (
          <div className="grid gap-4 sm:gap-6">
            {properties?.map((property) => (
              <div key={property.id} className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 hover:border-gold/50 transition-all">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Property Image */}
                  <div className="w-full sm:w-40 md:w-48 h-48 sm:h-32 flex-shrink-0">
                    {property.images?.[0] ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-800 rounded flex items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  
                  {/* Property Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg sm:text-xl mb-2 break-words text-white">{property.title}</h3>
                    <p className="text-sm text-gray-400 mb-2 break-words">{property.location}</p>
                    <p className="text-gold font-bold text-xl mb-3">
                      {property.price.toLocaleString("pt-PT")} €
                    </p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-400">
                      <span>{property.bedrooms}</span>
                      {property.bathrooms && <span>• {property.bathrooms} bathrooms</span>}
                      {property.private_area && <span>• {property.private_area}m²</span>}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => handleEdit(property)}
                      className="min-h-[44px] min-w-[44px] flex-1 sm:flex-initial border-gold text-gold hover:bg-gold hover:text-black"
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(property.id)}
                      className="min-h-[44px] min-w-[44px] flex-1 sm:flex-initial border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProperties;
