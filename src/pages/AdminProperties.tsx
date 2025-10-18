import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAdmin } from "@/contexts/AdminContext";
import { Button } from "@/components/ui/button";
import { PropertyEditor } from "@/components/properties/PropertyEditor";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AdminProperties() {
  const { isAdminLoggedIn } = useAdmin();
  const navigate = useNavigate();
  const [showEditor, setShowEditor] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const { data: properties, isLoading, refetch } = useQuery({
    queryKey: ["admin-properties"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: isAdminLoggedIn,
  });

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Acesso negado. Por favor, faça login como administrador.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Gestão de Propriedades</h1>
          <Button
            onClick={() => {
              setEditingProperty(null);
              setShowEditor(true);
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Propriedade
          </Button>
        </div>

        {showEditor && (
          <PropertyEditor
            property={editingProperty}
            onClose={() => {
              setShowEditor(false);
              setEditingProperty(null);
              refetch();
            }}
          />
        )}

        {isLoading ? (
          <div className="text-center py-12">Carregando...</div>
        ) : (
          <div className="grid gap-4">
            {properties?.map((property) => (
              <div
                key={property.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex gap-4">
                  {property.images?.[0] && (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                  )}
                  <div>
                    <h3 className="font-bold">{property.title}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                    <p className="font-semibold">{property.price.toLocaleString("pt-PT")}€</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      property.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                    }`}>
                      {property.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/properties/${property.id}`)}
                  >
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingProperty(property);
                      setShowEditor(true);
                    }}
                  >
                    Editar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
