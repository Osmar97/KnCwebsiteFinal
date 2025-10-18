import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { X } from "lucide-react";

interface PropertyEditorProps {
  property?: any;
  onClose: () => void;
}

export function PropertyEditor({ property, onClose }: PropertyEditorProps) {
  const [formData, setFormData] = useState({
    title: property?.title || "",
    description: property?.description || "",
    location: property?.location || "",
    city: property?.city || "",
    price: property?.price || "",
    transaction_type: property?.transaction_type || "Comprar",
    property_type: property?.property_type || "",
    private_area: property?.private_area || "",
    construction_area: property?.construction_area || "",
    bedrooms: property?.bedrooms || "",
    bathrooms: property?.bathrooms || "",
    condition: property?.condition || "",
    floor: property?.floor || "",
    total_floors: property?.total_floors || "",
    status: property?.status || "active",
    air_conditioning: property?.air_conditioning || false,
    built_in_wardrobes: property?.built_in_wardrobes || false,
    elevator: property?.elevator || false,
    balcony_terrace: property?.balcony_terrace || false,
    parking: property?.parking || false,
    garden: property?.garden || false,
    pool: property?.pool || false,
    storage: property?.storage || false,
    adapted_house: property?.adapted_house || false,
    luxury_house: property?.luxury_house || false,
    sea_view: property?.sea_view || false,
    images: property?.images || [],
  });

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      if (property?.id) {
        const { error } = await supabase
          .from("properties")
          .update(data)
          .eq("id", property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("properties").insert([data]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success(property ? "Propriedade atualizada" : "Propriedade criada");
      onClose();
    },
    onError: (error) => {
      toast.error("Erro ao salvar propriedade");
      console.error(error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <Card className="w-full max-w-4xl p-6 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {property ? "Editar Propriedade" : "Nova Propriedade"}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label>Título</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Descrição</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={5}
                required
              />
            </div>

            <div>
              <Label>Localização</Label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Cidade</Label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Preço (€)</Label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Tipo de transação</Label>
              <Select
                value={formData.transaction_type}
                onValueChange={(value) => setFormData({ ...formData, transaction_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Comprar">Comprar</SelectItem>
                  <SelectItem value="Arrendar">Arrendar</SelectItem>
                  <SelectItem value="Nova construção">Nova construção</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Tipo de propriedade</Label>
              <Select
                value={formData.property_type}
                onValueChange={(value) => setFormData({ ...formData, property_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Apartamentos">Apartamentos</SelectItem>
                  <SelectItem value="Penthouses">Penthouses</SelectItem>
                  <SelectItem value="Duplex">Duplex</SelectItem>
                  <SelectItem value="Casas">Casas</SelectItem>
                  <SelectItem value="Moradias">Moradias</SelectItem>
                  <SelectItem value="Lofts">Lofts</SelectItem>
                  <SelectItem value="Moradias térreas">Moradias térreas</SelectItem>
                  <SelectItem value="Quintas">Quintas</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Quartos</Label>
              <Select
                value={formData.bedrooms}
                onValueChange={(value) => setFormData({ ...formData, bedrooms: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="T0">T0</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4">T4</SelectItem>
                  <SelectItem value="T4+">T4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Área privativa (m²)</Label>
              <Input
                type="number"
                value={formData.private_area}
                onChange={(e) => setFormData({ ...formData, private_area: e.target.value })}
              />
            </div>

            <div>
              <Label>Área de construção (m²)</Label>
              <Input
                type="number"
                value={formData.construction_area}
                onChange={(e) => setFormData({ ...formData, construction_area: e.target.value })}
              />
            </div>

            <div>
              <Label>Casas de banho</Label>
              <Input
                type="number"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
              />
            </div>

            <div>
              <Label>Estado</Label>
              <Select
                value={formData.condition}
                onValueChange={(value) => setFormData({ ...formData, condition: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nova construção">Nova construção</SelectItem>
                  <SelectItem value="Bom estado">Bom estado</SelectItem>
                  <SelectItem value="Para recuperar">Para recuperar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block">Características</Label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { key: "air_conditioning", label: "Ar condicionado" },
                { key: "built_in_wardrobes", label: "Armários embutidos" },
                { key: "elevator", label: "Elevador" },
                { key: "balcony_terrace", label: "Varanda e terraço" },
                { key: "parking", label: "Lugar de garagem" },
                { key: "garden", label: "Jardim" },
                { key: "pool", label: "Piscina" },
                { key: "storage", label: "Arrecadação" },
                { key: "adapted_house", label: "Casa adaptada" },
                { key: "luxury_house", label: "Casa de luxo" },
                { key: "sea_view", label: "Vista mar" },
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    checked={formData[key as keyof typeof formData] as boolean}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, [key]: checked })
                    }
                  />
                  <label className="text-sm">{label}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
