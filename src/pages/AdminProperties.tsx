import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PropertyEditor from "@/components/properties/PropertyEditor";
import { useToast } from "@/hooks/use-toast";

const AdminProperties = () => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
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
    setIsEditorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este imóvel?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Property Management</h1>
          <Button onClick={() => { setEditingProperty(null); setIsEditorOpen(true); }}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>

        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div className="grid gap-4">
            {properties?.map((property) => (
              <div key={property.id} className="bg-card border rounded-lg p-6 flex justify-between items-start">
                <div className="flex gap-4 flex-1">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-32 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-semibold text-lg">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <p className="text-primary font-bold mt-2">{property.price.toLocaleString("pt-PT")} €</p>
                    <p className="text-sm text-muted-foreground">
                      {property.bedrooms} • {property.bathrooms} bathrooms • {property.private_area}m²
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" onClick={() => handleEdit(property)}>
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDelete(property.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isEditorOpen && (
        <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
          <PropertyEditor
            property={editingProperty}
            onClose={() => {
              setIsEditorOpen(false);
              setEditingProperty(null);
              queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
            }}
          />
        </div>
      )}
    </div>
  );
};

export default AdminProperties;
