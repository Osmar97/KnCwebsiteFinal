import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface PropertyEditorProps {
  property?: any;
  onClose: () => void;
}

const PropertyEditor = ({ property, onClose }: PropertyEditorProps) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: property || {
      title: "",
      description: "",
      location: "",
      city: "",
      price: "",
      transaction_type: "Comprar",
      property_type: "",
      bedrooms: "",
      bathrooms: "",
      private_area: "",
      construction_area: "",
      condition: "",
      images: [],
      features: {},
    },
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);
  const [uploading, setUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data: any) => {
      const propertyData = {
        ...data,
        images: imageUrls,
        price: parseFloat(data.price),
        bathrooms: parseInt(data.bathrooms),
        private_area: data.private_area ? parseFloat(data.private_area) : null,
        construction_area: data.construction_area ? parseFloat(data.construction_area) : null,
        floor: data.floor ? parseInt(data.floor) : null,
        total_floors: data.total_floors ? parseInt(data.total_floors) : null,
      };

      if (property) {
        const { error } = await supabase
          .from("properties" as any)
          .update(propertyData)
          .eq("id", property.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("properties" as any).insert([propertyData]);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast({ title: "Imóvel guardado com sucesso" });
      onClose();
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error, data } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (error) {
        toast({ title: "Erro ao fazer upload da imagem", variant: "destructive" });
      } else {
        const { data: urlData } = supabase.storage
          .from("property-images")
          .getPublicUrl(fileName);
        newImageUrls.push(urlData.publicUrl);
      }
    }

    setImageUrls([...imageUrls, ...newImageUrls]);
    setUploading(false);
  };

  return (
    <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Título *</Label>
          <Input {...register("title", { required: true })} />
        </div>

        <div className="col-span-2">
          <Label>Descrição *</Label>
          <Textarea {...register("description", { required: true })} rows={4} />
        </div>

        <div>
          <Label>Localização *</Label>
          <Input {...register("location", { required: true })} />
        </div>

        <div>
          <Label>Cidade *</Label>
          <Input {...register("city", { required: true })} />
        </div>

        <div>
          <Label>Preço (€) *</Label>
          <Input type="number" {...register("price", { required: true })} />
        </div>

        <div>
          <Label>Tipo de Transação</Label>
          <Select {...register("transaction_type")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comprar">Comprar</SelectItem>
              <SelectItem value="Arrendar">Arrendar</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Tipo de Imóvel *</Label>
          <Input {...register("property_type", { required: true })} />
        </div>

        <div>
          <Label>Quartos</Label>
          <Select {...register("bedrooms")}>
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
          <Label>Casas de banho</Label>
          <Input type="number" {...register("bathrooms")} />
        </div>

        <div>
          <Label>Área Privativa (m²)</Label>
          <Input type="number" {...register("private_area")} />
        </div>

        <div>
          <Label>Área Construção (m²)</Label>
          <Input type="number" {...register("construction_area")} />
        </div>

        <div>
          <Label>Estado</Label>
          <Select {...register("condition")}>
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

        <div>
          <Label>Andar</Label>
          <Input type="number" {...register("floor")} />
        </div>

        <div className="col-span-2">
          <Label>Imagens</Label>
          <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {uploading && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {imageUrls.map((url, idx) => (
              <img key={idx} src={url} alt="" className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <Label className="mb-2 block">Características</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("air_conditioning")} />
              <label className="text-sm">Ar condicionado</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("built_in_wardrobes")} />
              <label className="text-sm">Armários embutidos</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("elevator")} />
              <label className="text-sm">Elevador</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("balcony_terrace")} />
              <label className="text-sm">Varanda/Terraço</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("parking")} />
              <label className="text-sm">Garagem</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("garden")} />
              <label className="text-sm">Jardim</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("pool")} />
              <label className="text-sm">Piscina</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("storage")} />
              <label className="text-sm">Arrecadação</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("adapted_house")} />
              <label className="text-sm">Casa adaptada</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("luxury_house")} />
              <label className="text-sm">Casa de luxo</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("sea_view")} />
              <label className="text-sm">Vista mar</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
        </Button>
      </div>
    </form>
  );
};

export default PropertyEditor;
