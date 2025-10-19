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
    <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Title *</Label>
          <Input {...register("title", { required: true })} />
        </div>

        <div className="col-span-2">
          <Label>Description *</Label>
          <Textarea {...register("description", { required: true })} rows={4} />
        </div>

        <div>
          <Label>Location *</Label>
          <Input {...register("location", { required: true })} />
        </div>

        <div>
          <Label>City *</Label>
          <Input {...register("city", { required: true })} />
        </div>

        <div>
          <Label>Price (€) *</Label>
          <Input type="number" {...register("price", { required: true })} />
        </div>

        <div>
          <Label>Transaction Type</Label>
          <Select {...register("transaction_type")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Comprar">Buy</SelectItem>
              <SelectItem value="Arrendar">Rent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Property Type *</Label>
          <Input {...register("property_type", { required: true })} />
        </div>

        <div>
          <Label>Bedrooms</Label>
          <Select {...register("bedrooms")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="T0">Studio</SelectItem>
              <SelectItem value="T1">1 bed</SelectItem>
              <SelectItem value="T2">2 beds</SelectItem>
              <SelectItem value="T3">3 beds</SelectItem>
              <SelectItem value="T4">4 beds</SelectItem>
              <SelectItem value="T4+">4+ beds</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Bathrooms</Label>
          <Input type="number" {...register("bathrooms")} />
        </div>

        <div>
          <Label>Private Area (m²)</Label>
          <Input type="number" {...register("private_area")} />
        </div>

        <div>
          <Label>Construction Area (m²)</Label>
          <Input type="number" {...register("construction_area")} />
        </div>

        <div>
          <Label>Condition</Label>
          <Select {...register("condition")}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Nova construção">New construction</SelectItem>
              <SelectItem value="Bom estado">Good condition</SelectItem>
              <SelectItem value="Para recuperar">To renovate</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Floor</Label>
          <Input type="number" {...register("floor")} />
        </div>

        <div className="col-span-2">
          <Label>Images</Label>
          <Input type="file" multiple accept="image/*" onChange={handleImageUpload} />
          {uploading && <Loader2 className="w-4 h-4 animate-spin mt-2" />}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {imageUrls.map((url, idx) => (
              <img key={idx} src={url} alt="" className="w-full h-24 object-cover rounded" />
            ))}
          </div>
        </div>

        <div className="col-span-2">
          <Label className="mb-2 block">Features</Label>
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center space-x-2">
              <Checkbox {...register("air_conditioning")} />
              <label className="text-sm">Air conditioning</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("built_in_wardrobes")} />
              <label className="text-sm">Built-in wardrobes</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("elevator")} />
              <label className="text-sm">Lift</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("balcony_terrace")} />
              <label className="text-sm">Balcony/Terrace</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("parking")} />
              <label className="text-sm">Parking</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("garden")} />
              <label className="text-sm">Garden</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("pool")} />
              <label className="text-sm">Swimming pool</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("storage")} />
              <label className="text-sm">Storage room</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("adapted_house")} />
              <label className="text-sm">Adapted house</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("luxury_house")} />
              <label className="text-sm">Luxury house</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox {...register("sea_view")} />
              <label className="text-sm">Sea view</label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={saveMutation.isPending}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default PropertyEditor;
