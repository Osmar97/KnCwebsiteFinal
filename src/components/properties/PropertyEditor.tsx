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
import { Loader2, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
      toast({ title: "Property saved successfully" });
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
        toast({ title: "Error uploading image", variant: "destructive" });
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
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b py-6 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Novo imóvel</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="container mx-auto px-4 space-y-6">
        {/* Property Type Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tipo de imóvel *</h2>
          <div className="max-w-md">
            <Select defaultValue={property?.property_type} onValueChange={(value) => setValue("property_type", value)}>
              <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                <SelectValue placeholder="Selecionar opção" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="Apartamento">Apartamento</SelectItem>
                <SelectItem value="Moradia">Moradia</SelectItem>
                <SelectItem value="Terreno">Terreno</SelectItem>
                <SelectItem value="Loja">Loja</SelectItem>
                <SelectItem value="Escritório">Escritório</SelectItem>
                <SelectItem value="Garagem">Garagem</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Localização do imóvel</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Localidade</Label>
              <Input {...register("city", { required: true })} className="bg-[#FFFEF0] border-gray-300" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Nome da rua / via</Label>
              <Input {...register("location", { required: true })} className="bg-[#FFFEF0] border-gray-300" />
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Detalhes do imóvel</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Tipo de transação *</Label>
              <Select defaultValue={property?.transaction_type || "Comprar"} onValueChange={(value) => setValue("transaction_type", value)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Comprar">Comprar</SelectItem>
                  <SelectItem value="Arrendar">Arrendar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Preço (€) *</Label>
              <Input type="number" {...register("price", { required: true })} className="bg-[#FFFEF0] border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Quartos</Label>
              <Select defaultValue={property?.bedrooms} onValueChange={(value) => setValue("bedrooms", value)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="T0">Studio</SelectItem>
                  <SelectItem value="T1">T1</SelectItem>
                  <SelectItem value="T2">T2</SelectItem>
                  <SelectItem value="T3">T3</SelectItem>
                  <SelectItem value="T4+">T4+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Casas de banho</Label>
              <Input type="number" {...register("bathrooms")} className="bg-[#FFFEF0] border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Área privativa (m²)</Label>
              <Input type="number" {...register("private_area")} className="bg-[#FFFEF0] border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Área de construção (m²)</Label>
              <Input type="number" {...register("construction_area")} className="bg-[#FFFEF0] border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Andar</Label>
              <Input type="number" {...register("floor")} className="bg-[#FFFEF0] border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Estado</Label>
              <Select defaultValue={property?.condition} onValueChange={(value) => setValue("condition", value)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                  <SelectValue placeholder="Selecionar" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Nova construção">Nova construção</SelectItem>
                  <SelectItem value="Bom estado">Bom estado</SelectItem>
                  <SelectItem value="Para recuperar">Para recuperar</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Descrição da propriedade</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Título *</Label>
              <Input {...register("title", { required: true })} className="bg-[#FFFEF0] border-gray-300" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Português</Label>
              <Textarea 
                {...register("description", { required: true })} 
                rows={6} 
                className="bg-white border-gray-300"
                placeholder="Esta secção é muito importante. Presta especial atenção aos detalhes que não são visíveis nas fotos."
              />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Site web</Label>
              <Input {...register("video_url")} placeholder="http://" className="bg-[#FFFEF0] border-gray-300" />
            </div>
          </div>
        </div>

        {/* Photos and Videos Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Fotos e vídeos</h2>
          
          {/* Photos */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Fotos ({imageUrls.length})</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <img src={url} alt="" className="w-full h-32 object-cover rounded border" />
                  <button
                    type="button"
                    onClick={() => setImageUrls(imageUrls.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-600">Novo</span>
              </label>
            </div>
            {uploading && <div className="flex items-center gap-2 mt-2 text-sm text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> A carregar...</div>}
          </div>

          {/* Floor Plans */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="font-semibold">Planimetrias (0)</h3>
              <Badge className="bg-green-600">Novidade!</Badge>
              <span className="text-sm text-gray-600">Já podes carregar plantas em PDF</span>
            </div>
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
              <input 
                type="file" 
                accept=".pdf" 
                className="hidden"
              />
              <Plus className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">Novo</span>
            </label>
          </div>

          {/* Videos */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Vídeos (0)</h3>
            <label className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
              <Plus className="w-8 h-8 text-gray-400 mb-1" />
              <span className="text-sm text-gray-600">Novo</span>
            </label>
          </div>

          {/* Virtual Tours */}
          <div>
            <h3 className="font-semibold mb-3">Virtual Tours 3D/360 (0)</h3>
            <div>
              <Label className="text-sm mb-2 block">URL do tour virtual</Label>
              <Input {...register("virtual_tour_url")} placeholder="https://" className="bg-[#FFFEF0] border-gray-300 max-w-md" />
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Características</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox id="air_conditioning" {...register("air_conditioning")} />
              <label htmlFor="air_conditioning" className="text-sm">Ar condicionado</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="built_in_wardrobes" {...register("built_in_wardrobes")} />
              <label htmlFor="built_in_wardrobes" className="text-sm">Roupeiros embutidos</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="elevator" {...register("elevator")} />
              <label htmlFor="elevator" className="text-sm">Elevador</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="balcony_terrace" {...register("balcony_terrace")} />
              <label htmlFor="balcony_terrace" className="text-sm">Varanda/Terraço</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="parking" {...register("parking")} />
              <label htmlFor="parking" className="text-sm">Estacionamento</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="garden" {...register("garden")} />
              <label htmlFor="garden" className="text-sm">Jardim</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="pool" {...register("pool")} />
              <label htmlFor="pool" className="text-sm">Piscina</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="storage" {...register("storage")} />
              <label htmlFor="storage" className="text-sm">Arrecadação</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="adapted_house" {...register("adapted_house")} />
              <label htmlFor="adapted_house" className="text-sm">Casa adaptada</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="luxury_house" {...register("luxury_house")} />
              <label htmlFor="luxury_house" className="text-sm">Casa de luxo</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="sea_view" {...register("sea_view")} />
              <label htmlFor="sea_view" className="text-sm">Vista mar</label>
            </div>
          </div>
        </div>

        {/* Internal Data Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Dados internos</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Referência interna</Label>
              <Input className="bg-[#FFFEF0] border-gray-300" placeholder="REF-001" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Notas privadas</Label>
              <Textarea rows={4} className="bg-white border-gray-300" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="px-8">
            Cancelar
          </Button>
          <Button type="submit" disabled={saveMutation.isPending} className="px-8">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditor;
