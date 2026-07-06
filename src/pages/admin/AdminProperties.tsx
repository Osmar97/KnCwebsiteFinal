import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import PropertyEditor from "@/components/properties/PropertyEditor";
import { useSearchParams } from "react-router-dom";
import { useAdminProperties, useDeleteProperty, fetchPropertyById } from "@/hooks/admin/useAdminProperties";

const AdminProperties = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showList, setShowList] = useState(true);
  const [editingProperty, setEditingProperty] = useState(null);
  const queryClient = useQueryClient();

  const { data: properties, isLoading } = useAdminProperties();

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

  const deleteMutation = useDeleteProperty({ successTitle: "Imóvel eliminado com sucesso" });

  const handleEdit = async (property: any) => {
    const fresh = await fetchPropertyById(property.id);
    setEditingProperty(fresh || property);
    setShowList(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar este imóvel?")) {
      deleteMutation.mutate(id);
    }
  };

  // Show property editor if in edit mode - wrap it in AdminLayout so sidebar remains visible
  if (!showList) {
    return (
      <AdminLayout
        title={editingProperty ? "Edit Property" : "New Property"}
        description={editingProperty ? editingProperty.title : "Create a new property listing."}
      >
        <PropertyEditor
          key={editingProperty?.id || 'new'}
          property={editingProperty}
          onClose={() => {
            setShowList(true);
            setEditingProperty(null);
            setSearchParams({});
            queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
          }}
        />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title="Property Management"
      description="Create, edit, publish and archive properties. Changes appear live on the public site."
      actions={
        <Button
          onClick={() => { setEditingProperty(null); setShowList(false); }}
          className="bg-gold hover:bg-gold-dark text-black min-h-[44px]"
        >
          <Plus className="w-4 h-4 mr-1" /> Add Property
        </Button>
      }
    >
      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : properties && properties.length > 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {properties.map((property) => (
            <div key={property.id} className="bg-gray-950 border border-gray-800 hover:border-gold/50 rounded-lg p-4 transition-colors">
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Property Image */}
                <div className="w-full sm:w-40 h-32 flex-shrink-0 bg-gray-900 rounded overflow-hidden">
                  {property.images?.[0] ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 text-xs">
                      No image
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg sm:text-xl mb-1 break-words text-white">{property.title}</h3>
                  <p className="text-sm text-gray-400 mb-1 break-words">{property.location}</p>
                  <p className="text-gold font-bold text-lg mb-2">
                    {property.price.toLocaleString("pt-PT")} €
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    <span>{property.bedrooms}</span>
                    {property.bathrooms && <span>• {property.bathrooms} bathrooms</span>}
                    {property.private_area && <span>• {property.private_area}m²</span>}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex sm:flex-col flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(property)}
                    className="border-gold text-gold hover:bg-gold hover:text-black min-h-[40px]"
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(property.id)}
                    className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white min-h-[40px]"
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-gray-950 border border-gray-800 rounded-lg p-8 text-center text-gray-400">
          No properties found. Click "Add Property" to create one.
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProperties;
