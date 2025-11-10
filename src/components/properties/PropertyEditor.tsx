import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, Minus, ArrowLeft, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { propertySchema, PropertyFormData } from "@/schemas/propertySchema";
import { useGeocoding } from "@/hooks/useGeocoding";
import { useNavigate } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

interface PropertyEditorProps {
  property?: any;
  onClose: () => void;
}

const PropertyEditor = ({ property, onClose }: PropertyEditorProps) => {
  const navigate = useNavigate();
  const { supabaseUser } = useAdmin();
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });

  const propertyType = watch("property_type");
  const [descriptions, setDescriptions] = useState<Record<string, string>>(() => {
    if (property?.descriptions && typeof property.descriptions === 'object') {
      return property.descriptions;
    }
    return { pt: property?.description || "" };
  });
  const [currentLang, setCurrentLang] = useState("pt");
  const [additionalLangs, setAdditionalLangs] = useState<string[]>([]);
  const [bedroomCount, setBedroomCount] = useState(property?.bedrooms ? parseInt(property.bedrooms) : 0);
  const [floorCount, setFloorCount] = useState(property?.floors || 0);
  const [bathroomCount, setBathroomCount] = useState(property?.bathrooms || 0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Reset form when property data changes or on mount
  useEffect(() => {
    console.log("PropertyEditor useEffect - property:", property);
    if (property) {
      console.log("Resetting form with property data:", property);
      const formValues = {
        title: property.title || "",
        location: property.location || "",
        city: property.city || "",
        street_number: property.street_number ?? "",
        no_street_number: property.no_street_number ?? false,
        block: property.block ?? "",
        door: property.door ?? "",
        urbanization_name: property.urbanization_name ?? "",
        transaction_type: property.transaction_type || "Comprar",
        property_type: property.property_type || "",
        price: property.price || 0,
        operation_sale: property.operation_sale !== undefined ? property.operation_sale : true,
        operation_rent: property.operation_rent || false,
        condition: property.condition || "",
        construction_area: property.construction_area || 0,
        private_area: property.private_area || 0,
        lot_area: property.lot_area || 0,
        building_year: property.building_year || 0,
        heating_type: property.heating_type || "",
        energy_class: property.energy_class || "",
        orientation_north: property.orientation_north ?? false,
        orientation_south: property.orientation_south ?? false,
        orientation_east: property.orientation_east ?? false,
        orientation_west: property.orientation_west ?? false,
        built_in_wardrobes: property.built_in_wardrobes ?? false,
        air_conditioning: property.air_conditioning ?? false,
        balcony_terrace: property.balcony_terrace ?? false,
        parking: property.parking ?? false,
        storage: property.storage ?? false,
        pool: property.pool ?? false,
        garden: property.garden ?? false,
        elevator: property.elevator ?? false,
        adapted_house: property.adapted_house ?? false,
        luxury_house: property.luxury_house ?? false,
        sea_view: property.sea_view ?? false,
        floor: property.floor?.toString() || "",
        total_floors: property.total_floors || 0,
        is_top_floor: property.is_top_floor ?? false,
        penthouse: property.penthouse ?? false,
        t0: property.t0 ?? false,
        duplex: property.duplex ?? false,
        bathrooms: property.bathrooms || 0,
        bedrooms: property.bedrooms || "",
        description: property.description || "",
        video_url: property.video_url || "",
        floor_plan_url: property.floor_plan_url || "",
        virtual_tour_url: property.virtual_tour_url || "",
        status: property.status || "active",
        featured: property.featured || false,
        internal_reference: property.internal_reference || "",
        private_notes: property.private_notes || "",
        notes_visibility: property.notes_visibility || "",
        agent_captador: property.agent_captador || "",
        agent_comercializador: property.agent_comercializador || "",
      };
      console.log("Form values for reset:", formValues);
      
      // Force reset with new values
      reset(formValues, { keepDefaultValues: false });
      
      // Also update related state
      if (property.descriptions && typeof property.descriptions === 'object') {
        setDescriptions(property.descriptions);
        // Set additional languages based on what's in descriptions
        const langs = Object.keys(property.descriptions).filter(lang => lang !== 'pt');
        setAdditionalLangs(langs);
      } else {
        setDescriptions({ pt: property.description || "" });
        setAdditionalLangs([]);
      }
      setBedroomCount(property.bedrooms ? parseInt(property.bedrooms) : 0);
      setBathroomCount(property.bathrooms || 0);
      setImageUrls(property.images || []);
    } else {
      // New property - reset to empty form
      reset({
        title: "",
        location: "",
        city: "",
        street_number: "",
        no_street_number: false,
        block: "",
        door: "",
        urbanization_name: "",
        transaction_type: "Comprar",
        property_type: "",
        price: 0,
        operation_sale: true,
        operation_rent: false,
        condition: "",
        construction_area: 0,
        private_area: 0,
        lot_area: 0,
        building_year: 0,
        heating_type: "",
        energy_class: "",
        orientation_north: false,
        orientation_south: false,
        orientation_east: false,
        orientation_west: false,
        built_in_wardrobes: false,
        air_conditioning: false,
        balcony_terrace: false,
        parking: false,
        storage: false,
        pool: false,
        garden: false,
        elevator: false,
        adapted_house: false,
        luxury_house: false,
        sea_view: false,
        floor: "",
        total_floors: 0,
        is_top_floor: false,
        penthouse: false,
        t0: false,
        duplex: false,
        bathrooms: 0,
        bedrooms: "",
        description: "",
        video_url: "",
        floor_plan_url: "",
        virtual_tour_url: "",
        status: "active",
        featured: false,
        internal_reference: "",
        private_notes: "",
        notes_visibility: "",
        agent_captador: "",
        agent_comercializador: "",
      });
      setDescriptions({ pt: "", en: "" });
      setBedroomCount(0);
      setBathroomCount(0);
      setImageUrls([]);
    }
  }, [property]);
  const { verifyAddress, isVerifying } = useGeocoding();
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);
  const [pdfUrls, setPdfUrls] = useState<string[]>(property?.pdf_urls || []);
  const [videoUrls, setVideoUrls] = useState<string[]>(property?.video_urls || []);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const saveMutation = useMutation({
    mutationFn: async (data: PropertyFormData): Promise<string> => {
      console.log("Starting save mutation with data:", data);
      
      const propertyData = {
        title: data.title || "",
        property_type: data.property_type || "",
        city: data.city || "",
        location: data.location || "",
        street_number: data.street_number || null,
        no_street_number: data.no_street_number || false,
        block: data.block || null,
        door: data.door || null,
        urbanization_name: data.urbanization_name || null,
        price: Number(data.price) || 0,
        operation_sale: data.operation_sale !== undefined ? data.operation_sale : true,
        operation_rent: data.operation_rent || false,
        transaction_type: data.transaction_type || "Comprar",
        condition: data.condition || "",
        construction_area: Number(data.construction_area) || null,
        private_area: Number(data.private_area) || null,
        lot_area: Number(data.lot_area) || null,
        building_year: Number(data.building_year) || null,
        heating_type: data.heating_type || null,
        energy_class: data.energy_class || null,
        orientation_north: data.orientation_north || false,
        orientation_south: data.orientation_south || false,
        orientation_east: data.orientation_east || false,
        orientation_west: data.orientation_west || false,
        built_in_wardrobes: data.built_in_wardrobes || false,
        air_conditioning: data.air_conditioning || false,
        balcony_terrace: data.balcony_terrace || false,
        parking: data.parking || false,
        storage: data.storage || false,
        pool: data.pool || false,
        garden: data.garden || false,
        elevator: data.elevator || false,
        adapted_house: data.adapted_house || false,
        luxury_house: data.luxury_house || false,
        sea_view: data.sea_view || false,
        images: imageUrls,
        bedrooms: bedroomCount.toString(),
        bathrooms: bathroomCount || null,
        total_floors: data.total_floors ? Number(data.total_floors) : null,
        description: descriptions.pt || descriptions.en || "",
        descriptions: descriptions,
        video_url: data.video_url || null,
        floor_plan_url: data.floor_plan_url || null,
        virtual_tour_url: data.virtual_tour_url || null,
        status: "active",
        featured: data.featured || false,
        internal_reference: data.internal_reference || null,
        private_notes: data.private_notes || null,
        notes_visibility: data.notes_visibility || null,
        // Apartment-specific fields
        floor: data.floor ? parseInt(data.floor) : null,
        is_top_floor: data.is_top_floor || false,
        penthouse: data.penthouse || false,
        t0: data.t0 || false,
        duplex: data.duplex || false,
        // Agent fields
        agent_captador: data.agent_captador || null,
        agent_comercializador: data.agent_comercializador || null,
      };

      console.log("Property data to save:", propertyData);

      if (property) {
        console.log("Updating existing property:", property.id);
        const { error } = await supabase
          .from("properties" as any)
          .update(propertyData)
          .eq("id", property.id);
        if (error) {
          console.error("Update error:", error);
          throw error;
        }
        console.log("Property updated successfully");
        return property.id as string;
      } else {
        console.log("Creating new property");
        const { data: newProperty, error } = await supabase
          .from("properties" as any)
          .insert([propertyData])
          .select()
          .single();
        
        if (error) {
          console.error("Insert error:", error);
          throw error;
        }
        
        console.log("New property created:", newProperty);
        return (newProperty as any).id as string;
      }
    },
    onSuccess: async (propertyId) => {
      console.log("Save successful, property ID:", propertyId);
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      
      toast({ 
        title: "Imóvel guardado com sucesso",
        description: property ? "O imóvel foi atualizado" : "Novo imóvel criado"
      });
      
      // Always redirect to property management page after save
      onClose();
    },
    onError: (error: any) => {
      console.error("Save mutation error:", error);
      toast({ 
        title: "Erro ao guardar imóvel", 
        description: error?.message || "Por favor, tente novamente",
        variant: "destructive" 
      });
    },
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newImageUrls: string[] = [];

    try {
      for (const file of Array.from(files)) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error } = await supabase.storage
          .from("property-images")
          .upload(fileName, file);

        if (error) {
          toast({ 
            title: "Erro ao carregar imagem", 
            description: error.message,
            variant: "destructive" 
          });
        } else {
          const { data: urlData } = supabase.storage
            .from("property-images")
            .getPublicUrl(fileName);
          newImageUrls.push(urlData.publicUrl);
        }
      }

      if (newImageUrls.length > 0) {
        setImageUrls([...imageUrls, ...newImageUrls]);
        toast({ 
          title: "Imagens carregadas com sucesso",
          description: `${newImageUrls.length} imagem(ns) adicionada(s)`
        });
      }
    } catch (error) {
      console.error(error);
      toast({ 
        title: "Erro ao carregar imagens", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
    }
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    const newIndex = direction === "left" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= imageUrls.length) return;
    
    const newImageUrls = [...imageUrls];
    [newImageUrls[index], newImageUrls[newIndex]] = [newImageUrls[newIndex], newImageUrls[index]];
    setImageUrls(newImageUrls);
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;

    const newImageUrls = [...imageUrls];
    const draggedItem = newImageUrls[draggedIndex];
    newImageUrls.splice(draggedIndex, 1);
    newImageUrls.splice(dropIndex, 0, draggedItem);
    
    setImageUrls(newImageUrls);
    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("PDF upload triggered");
    const files = e.target.files;
    if (!files) {
      console.log("No files selected");
      return;
    }

    console.log("Files selected:", files.length, "User ID:", supabaseUser?.id);
    
    if (!supabaseUser?.id) {
      console.error("User not authenticated - supabaseUser:", supabaseUser);
      toast({ title: "Erro: Usuário não autenticado", variant: "destructive" });
      return;
    }

    setUploading(true);
    const newPdfUrls: string[] = [];

    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${supabaseUser.id}/${timestamp}_${sanitizedName}`;
      
      console.log("Uploading PDF to:", fileName);
      
      const { error } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);

      if (error) {
        console.error("PDF upload error:", error);
        toast({ title: "Erro ao carregar PDF", description: error.message, variant: "destructive" });
      } else {
        console.log("PDF uploaded successfully");
        const { data: urlData } = supabase.storage.from("pdfs").getPublicUrl(fileName);
        newPdfUrls.push(urlData.publicUrl);
      }
    }

    setPdfUrls([...pdfUrls, ...newPdfUrls]);
    setUploading(false);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (!supabaseUser?.id) {
      toast({ title: "Erro: Usuário não autenticado", variant: "destructive" });
      return;
    }

    setUploading(true);
    const newVideoUrls: string[] = [];

    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${supabaseUser.id}/${timestamp}_${sanitizedName}`;
      
      const { error } = await supabase.storage
        .from("videos")
        .upload(fileName, file);

      if (error) {
        console.error("Video upload error:", error);
        toast({ title: "Erro ao carregar vídeo", description: error.message, variant: "destructive" });
      } else {
        const { data: urlData } = supabase.storage.from("videos").getPublicUrl(fileName);
        newVideoUrls.push(urlData.publicUrl);
      }
    }

    setVideoUrls([...videoUrls, ...newVideoUrls]);
    setUploading(false);
  };

  const handleAddLanguage = async (lang: string) => {
    if (additionalLangs.includes(lang)) return;
    
    setIsTranslating(true);
    try {
      // Translate from the current language if it has content
      const sourceText = descriptions[currentLang];
      if (sourceText && sourceText.trim()) {
        const { data, error } = await supabase.functions.invoke("translate-text", {
          body: { text: sourceText, targetLang: lang },
        });

        if (error) throw error;

        setDescriptions({ ...descriptions, [lang]: data.translatedText });
        toast({ title: "Tradução concluída" });
      } else {
        // Add empty language field if no source text
        setDescriptions({ ...descriptions, [lang]: "" });
        toast({ title: "Idioma adicionado sem tradução", description: "Não há texto para traduzir" });
      }
      
      setAdditionalLangs([...additionalLangs, lang]);
      setCurrentLang(lang);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na tradução", variant: "destructive" });
      // Add the language anyway with the English description or empty
      setDescriptions({ ...descriptions, [lang]: descriptions.en || "" });
      setAdditionalLangs([...additionalLangs, lang]);
      setCurrentLang(lang);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImproveText = async () => {
    setIsImproving(true);
    try {
      const { data, error } = await supabase.functions.invoke("improve-text", {
        body: { text: descriptions[currentLang], language: currentLang },
      });

      if (error) throw error;

      setDescriptions({ ...descriptions, [currentLang]: data.improvedText });
      toast({ title: "Texto melhorado com sucesso" });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao melhorar texto", variant: "destructive" });
    } finally {
      setIsImproving(false);
    }
  };

  const handleVerifyAddress = async () => {
    const city = watch("city");
    const location = watch("location");
    const streetNumber = watch("street_number");
    
    const fullAddress = `${location} ${streetNumber || ""}, ${city}, Portugal`;
    await verifyAddress(fullAddress);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b py-6 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{property ? property.title : "Novo imóvel"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => {
        console.log("Form submitted with data:", data);
        console.log("Form errors:", errors);
        saveMutation.mutate(data);
      })} className="container mx-auto px-4 space-y-6">
        {/* Property Type Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tipo de imóvel</h2>
            <div className="max-w-md">
              <Select defaultValue={property?.property_type} onValueChange={(value) => setValue("property_type", value)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                  <SelectValue placeholder="Selecionar opção" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="Casa / Moradia">Casa / Moradia</SelectItem>
                  <SelectItem value="Apartamento">Apartamento</SelectItem>
                  <SelectItem value="Casa rústica">Casa rústica</SelectItem>
                  <SelectItem value="Quarto">Quarto</SelectItem>
                  <SelectItem value="Espaço comercial ou armazém">Espaço comercial ou armazém</SelectItem>
                  <SelectItem value="Trespasse">Trespasse</SelectItem>
                  <SelectItem value="Garagem">Garagem</SelectItem>
                  <SelectItem value="Escritório">Escritório</SelectItem>
                  <SelectItem value="Terreno">Terreno</SelectItem>
                  <SelectItem value="Arrecadação">Arrecadação</SelectItem>
                  <SelectItem value="Prédio">Prédio</SelectItem>
                </SelectContent>
              </Select>
              {errors.property_type && <p className="text-sm text-red-600 mt-1">{errors.property_type.message}</p>}
            </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Localização do imóvel</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Localidade</Label>
              <Input {...register("city")} className="bg-[#FFFEF0] border-gray-300" />
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Nome da rua / via</Label>
              <Input {...register("location")} className="bg-[#FFFEF0] border-gray-300" />
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-sm font-semibold mb-2 block">Número</Label>
                <Input {...register("street_number")} className="bg-[#FFFEF0] border-gray-300" />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox 
                  id="no_number" 
                  checked={watch("no_street_number") || false} 
                  onCheckedChange={(checked) => setValue("no_street_number", checked === true)} 
                />
                <label htmlFor="no_number" className="text-sm">Sem número</label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-semibold mb-2 block">Bloco / Lote</Label>
                <Input {...register("block")} className="bg-white border-gray-300" />
              </div>
              <div>
                <Label className="text-sm font-semibold mb-2 block">Porta</Label>
                <Input {...register("door")} className="bg-white border-gray-300" />
              </div>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Nome da urbanização</Label>
              <Input {...register("urbanization_name")} className="bg-white border-gray-300" />
            </div>
          </div>

        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Operação e preço</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operation_sale" 
                checked={watch("operation_sale") || false} 
                onCheckedChange={(checked) => setValue("operation_sale", checked === true)} 
              />
              <label htmlFor="operation_sale" className="text-sm">Venda</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="operation_rent" 
                checked={watch("operation_rent") || false} 
                onCheckedChange={(checked) => setValue("operation_rent", checked === true)} 
              />
              <label htmlFor="operation_rent" className="text-sm">Arrendamento</label>
            </div>
          </div>

          <div className="max-w-md mb-6">
            <Label className="text-sm font-semibold mb-2 block">Preço</Label>
            <div className="relative">
              <Input 
                type="number" 
                {...register("price", { valueAsNumber: true })} 
                className="bg-[#FFFEF0] border-gray-300 pr-12" 
                placeholder="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">€</span>
            </div>
          </div>

          {/* Apartment-specific floor selection */}
          {propertyType === "Apartamento" && (
            <div className="mt-8 space-y-4">
              <div className="max-w-md">
                <Label className="text-sm font-semibold mb-2 block">Andar</Label>
                <Select value={watch("floor") ? String(watch("floor")) : undefined} onValueChange={(value) => setValue("floor", value)}>
                  <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                    <SelectValue placeholder="Selecionar opção" />
                  </SelectTrigger>
                  <SelectContent className="bg-white z-50">
                    <SelectItem value="ground">Rés-do-chão</SelectItem>
                    <SelectItem value="1">1º Andar</SelectItem>
                    <SelectItem value="2">2º Andar</SelectItem>
                    <SelectItem value="3">3º Andar</SelectItem>
                    <SelectItem value="4">4º Andar</SelectItem>
                    <SelectItem value="5">5º Andar</SelectItem>
                    <SelectItem value="6">6º Andar</SelectItem>
                    <SelectItem value="7">7º Andar</SelectItem>
                    <SelectItem value="8">8º Andar</SelectItem>
                    <SelectItem value="9+">9º Andar ou superior</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="is_top_floor" 
                  checked={watch("is_top_floor") || false} 
                  onCheckedChange={(checked) => setValue("is_top_floor", checked === true)} 
                />
                <label htmlFor="is_top_floor" className="text-sm">É o último andar do bloco</label>
              </div>
            </div>
          )}

          {propertyType === "Casa / Moradia" && (
            <>
              <h2 className="text-xl font-semibold mb-4 mt-8">Tipologia</h2>
              <RadioGroup defaultValue="moradia_banda" className="space-y-2 mb-6">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moradia_banda" id="moradia_banda" />
                  <label htmlFor="moradia_banda" className="text-sm cursor-pointer">Moradia em banda</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moradia_geminada" id="moradia_geminada" />
                  <label htmlFor="moradia_geminada" className="text-sm cursor-pointer">Moradia geminada</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="moradia_independente" id="moradia_independente" />
                  <label htmlFor="moradia_independente" className="text-sm cursor-pointer">Moradia independente</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="andar_moradia" id="andar_moradia" />
                  <label htmlFor="andar_moradia" className="text-sm cursor-pointer">Andar de moradia</label>
                </div>
              </RadioGroup>
            </>
          )}

          {/* Additional characteristics for Apartments */}
          {propertyType === "Apartamento" && (
            <>
              <h3 className="text-xl font-semibold mb-4 mt-6">Característica adicional</h3>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="penthouse" 
                    checked={watch("penthouse") || false} 
                    onCheckedChange={(checked) => setValue("penthouse", checked === true)} 
                  />
                  <label htmlFor="penthouse" className="text-sm">Penthouse</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="t0" 
                    checked={watch("t0") || false} 
                    onCheckedChange={(checked) => setValue("t0", checked === true)} 
                  />
                  <label htmlFor="t0" className="text-sm">T0</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="duplex" 
                    checked={watch("duplex") || false} 
                    onCheckedChange={(checked) => setValue("duplex", checked === true)} 
                  />
                  <label htmlFor="duplex" className="text-sm">Duplex</label>
                </div>
              </div>
            </>
          )}

          {(propertyType === "Casa / Moradia" || propertyType === "Apartamento") && (
            <>

              <h3 className="text-xl font-semibold mb-4">Tamanho</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">M² área bruta</Label>
                  <div className="relative">
                    <Input type="number" {...register("construction_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-semibold mb-2 block">M² úteis</Label>
                  <div className="relative">
                    <Input type="number" {...register("private_area")} className="bg-white border-gray-300 pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
                  </div>
                </div>
              </div>

              {/* Lot area only for houses */}
              {propertyType === "Casa / Moradia" && (
                <div className="mb-6">
                  <Label className="text-sm font-semibold mb-2 block">M² lote</Label>
                  <div className="relative max-w-sm">
                    <Input type="number" {...register("lot_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
                  </div>
                </div>
              )}

              {/* Counters */}
              <div className="space-y-6">
                <div>
                  <Label className="text-sm font-semibold mb-2 block">Número de quartos</Label>
                  <div className="flex items-center gap-4 max-w-sm">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setBedroomCount(Math.max(0, bedroomCount - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={bedroomCount} 
                      onChange={(e) => setBedroomCount(parseInt(e.target.value) || 0)}
                      className="text-center bg-white border-gray-300"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setBedroomCount(bedroomCount + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Villa floors - only for houses */}
                {propertyType === "Casa / Moradia" && (
                  <div>
                    <Label className="text-sm font-semibold mb-2 block">Andares da moradia</Label>
                    <div className="flex items-center gap-4 max-w-sm">
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setFloorCount(Math.max(0, floorCount - 1))}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <Input 
                        type="number" 
                        value={floorCount} 
                        onChange={(e) => setFloorCount(parseInt(e.target.value) || 0)}
                        className="text-center bg-white border-gray-300"
                      />
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        onClick={() => setFloorCount(floorCount + 1)}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}

                <div>
                  <Label className="text-sm font-semibold mb-2 block">Número de casas de banho</Label>
                  <div className="flex items-center gap-4 max-w-sm">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setBathroomCount(Math.max(0, bathroomCount - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input 
                      type="number" 
                      value={bathroomCount} 
                      onChange={(e) => setBathroomCount(parseInt(e.target.value) || 0)}
                      className="text-center bg-white border-gray-300"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setBathroomCount(bathroomCount + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Energy Classification */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Classificação do consumo de energia</h3>
                <div className="max-w-sm">
                  <Label className="text-sm font-semibold mb-2 block">Classe energética</Label>
                  <Select value={watch("energy_class") ? String(watch("energy_class")) : undefined} onValueChange={(value) => setValue("energy_class", value)}>
                    <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                      <SelectValue placeholder="Seleciona opção" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A">A</SelectItem>
                      <SelectItem value="B">B</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="C">C</SelectItem>
                      <SelectItem value="D">D</SelectItem>
                      <SelectItem value="E">E</SelectItem>
                      <SelectItem value="F">F</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Conservation State */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Estado de conservação</h3>
                <RadioGroup value={watch("condition") ? String(watch("condition")) : "good"} onValueChange={(value) => setValue("condition", value)} className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="good" id="condition_good" />
                    <label htmlFor="condition_good" className="text-sm cursor-pointer">Bom estado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="to_recover" id="condition_recover" />
                    <label htmlFor="condition_recover" className="text-sm cursor-pointer">Para recuperar</label>
                  </div>
                </RadioGroup>
                <p className="text-sm text-gray-600 mt-2">
                  Também administras imóveis de nova construção? Para publicar uma nova construção no idealista{" "}
                  <a href="#" className="text-blue-600">Contacta o teu gestor</a>
                </p>
              </div>

              {/* Orientation */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Orientação</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orientation_north" 
                      checked={watch("orientation_north") || false} 
                      onCheckedChange={(checked) => setValue("orientation_north", checked === true)} 
                    />
                    <label htmlFor="orientation_north" className="text-sm">Norte</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orientation_south" 
                      checked={watch("orientation_south") || false} 
                      onCheckedChange={(checked) => setValue("orientation_south", checked === true)} 
                    />
                    <label htmlFor="orientation_south" className="text-sm">Sul</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orientation_east" 
                      checked={watch("orientation_east") || false} 
                      onCheckedChange={(checked) => setValue("orientation_east", checked === true)} 
                    />
                    <label htmlFor="orientation_east" className="text-sm">Este</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="orientation_west" 
                      checked={watch("orientation_west") || false} 
                      onCheckedChange={(checked) => setValue("orientation_west", checked === true)} 
                    />
                    <label htmlFor="orientation_west" className="text-sm">Oeste</label>
                  </div>
                </div>
              </div>

              {/* Other Characteristics */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Outras características do imóvel</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="built_in_wardrobes" 
                      checked={watch("built_in_wardrobes") || false} 
                      onCheckedChange={(checked) => setValue("built_in_wardrobes", checked === true)} 
                    />
                    <label htmlFor="built_in_wardrobes" className="text-sm">Armários embutidos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="air_conditioning" 
                      checked={watch("air_conditioning") || false} 
                      onCheckedChange={(checked) => setValue("air_conditioning", checked === true)} 
                    />
                    <label htmlFor="air_conditioning" className="text-sm">Ar condicionado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="balcony_terrace" 
                      checked={watch("balcony_terrace") || false} 
                      onCheckedChange={(checked) => setValue("balcony_terrace", checked === true)} 
                    />
                    <label htmlFor="balcony_terrace" className="text-sm">Varanda/Terraço</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parking" 
                      checked={watch("parking") || false} 
                      onCheckedChange={(checked) => setValue("parking", checked === true)} 
                    />
                    <label htmlFor="parking" className="text-sm">Lugar de garagem</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="storage" 
                      checked={watch("storage") || false} 
                      onCheckedChange={(checked) => setValue("storage", checked === true)} 
                    />
                    <label htmlFor="storage" className="text-sm">Arrecadação</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="pool" 
                      checked={watch("pool") || false} 
                      onCheckedChange={(checked) => setValue("pool", checked === true)} 
                    />
                    <label htmlFor="pool" className="text-sm">Piscina</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="garden" 
                      checked={watch("garden") || false} 
                      onCheckedChange={(checked) => setValue("garden", checked === true)} 
                    />
                    <label htmlFor="garden" className="text-sm">Jardim</label>
                  </div>
                </div>
              </div>


              {/* Heating Type */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Aquecimento</h3>
                <div className="max-w-sm">
                  <Label className="text-sm font-semibold mb-2 block">Tipo de aquecimento</Label>
                  <Select value={watch("heating_type") ? String(watch("heating_type")) : undefined} onValueChange={(value) => setValue("heating_type", value)}>
                    <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                      <SelectValue placeholder="Selecionar opção" />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="central">Aquecimento central</SelectItem>
                      <SelectItem value="individual">Aquecimento individual</SelectItem>
                      <SelectItem value="none">Sem aquecimento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Building Year */}
              {/* Elevator - for Apartments */}
              {propertyType === "Apartamento" && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Elevador<span className="text-red-600">*</span></h3>
                  <RadioGroup value={watch("elevator") ? "yes" : "no"} onValueChange={(value) => setValue("elevator", value === "yes")} className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="elevator_yes" />
                      <label htmlFor="elevator_yes" className="text-sm cursor-pointer">Sim</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="elevator_no" />
                      <label htmlFor="elevator_no" className="text-sm cursor-pointer">Não</label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              {/* Building Year */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Prédio</h3>
                <div className="max-w-sm">
                  <Label className="text-sm font-semibold mb-2 block">Ano de construção do prédio</Label>
                  <Input type="number" {...register("building_year")} className="bg-white border-gray-300" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Descrição da propriedade</h2>
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Título</Label>
              <Input {...register("title")} className="bg-[#FFFEF0] border-gray-300" placeholder="Ex: Apartamento T4 + 3 com vista, Chiado, Lisboa" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-sm font-semibold">
                  Descrição ({currentLang === "en" ? "English" : currentLang === "pt" ? "Português" : currentLang})
                </Label>
                <div className="flex gap-2">
                  {additionalLangs.map((lang) => (
                    <Button
                      key={lang}
                      type="button"
                      variant={currentLang === lang ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentLang(lang)}
                    >
                      {lang === "pt" ? "PT" : lang === "es" ? "ES" : lang.toUpperCase()}
                    </Button>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentLang("en")}
                    disabled={currentLang === "en"}
                  >
                    EN
                  </Button>
                </div>
              </div>
              <Textarea 
                value={descriptions[currentLang] || ""} 
                onChange={(e) => {
                  const newDescriptions = { ...descriptions, [currentLang]: e.target.value };
                  setDescriptions(newDescriptions);
                }}
                rows={6} 
                className="bg-white border-gray-300"
                placeholder="Esta secção é muito importante. Presta especial atenção aos detalhes que não são visíveis nas fotos."
              />
              <div className="flex gap-2 mt-2 items-center">
                <Button 
                  type="button" 
                  variant="outline" 
                  className="text-sm"
                  onClick={handleImproveText}
                  disabled={isImproving || !descriptions[currentLang]}
                >
                  {isImproving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  Melhorar texto com IA
                </Button>
              </div>
              
              <Select onValueChange={(lang) => handleAddLanguage(lang)} disabled={isTranslating}>
                <SelectTrigger className="w-48 mt-2">
                  <SelectValue placeholder="Adicionar outro idioma" />
                </SelectTrigger>
                <SelectContent>
                  {!additionalLangs.includes("pt") && <SelectItem value="pt">Português</SelectItem>}
                  {!additionalLangs.includes("es") && <SelectItem value="es">Espanhol</SelectItem>}
                  {!additionalLangs.includes("fr") && <SelectItem value="fr">Francês</SelectItem>}
                  {!additionalLangs.includes("de") && <SelectItem value="de">Alemão</SelectItem>}
                  {!additionalLangs.includes("it") && <SelectItem value="it">Italiano</SelectItem>}
                </SelectContent>
              </Select>
              {isTranslating && (
                <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  A traduzir...
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photos and Videos Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Fotos e vídeos</h2>
          
          {/* Photos */}
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Fotos ({imageUrls.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {imageUrls.map((url, idx) => (
                <div 
                  key={idx} 
                  className={`relative group cursor-move ${draggedIndex === idx ? 'opacity-50' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, idx)}
                  onDragEnd={handleDragEnd}
                >
                  <img src={url} alt="" className="w-full h-32 object-cover rounded border pointer-events-none" />
                  <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {idx > 0 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "left")}
                        className="bg-blue-500 text-white p-1 rounded-full"
                        title="Mover para a esquerda"
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </button>
                    )}
                    {idx < imageUrls.length - 1 && (
                      <button
                        type="button"
                        onClick={() => moveImage(idx, "right")}
                        className="bg-blue-500 text-white p-1 rounded-full"
                        title="Mover para a direita"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrls(imageUrls.filter((_, i) => i !== idx));
                      toast({ title: "Imagem removida" });
                    }}
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
              <h3 className="font-semibold">Planimetrias ({pdfUrls.length})</h3>
              <span className="text-sm text-gray-600">Já podes carregar plantas em PDF</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {pdfUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <div className="w-full h-32 border rounded flex items-center justify-center bg-gray-100">
                    <span className="text-sm">PDF {idx + 1}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPdfUrls(pdfUrls.filter((_, i) => i !== idx))}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <label 
                onClick={() => console.log("Label clicked for PDF upload")}
                className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50"
              >
                <input 
                  type="file" 
                  multiple
                  accept=".pdf" 
                  onChange={(e) => {
                    console.log("File input onChange triggered", e.target.files);
                    handlePdfUpload(e);
                  }}
                  onClick={(e) => console.log("File input clicked", e)}
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-600">Novo</span>
              </label>
            </div>
          </div>

          {/* Videos */}
          <div>
            <h3 className="font-semibold mb-3">Vídeos ({videoUrls.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {videoUrls.map((url, idx) => (
                <div key={idx} className="relative group">
                  <video src={url} className="w-full h-32 object-cover rounded border" controls />
                  <button
                    type="button"
                    onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== idx))}
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
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <Plus className="w-8 h-8 text-gray-400 mb-1" />
                <span className="text-sm text-gray-600">Novo</span>
              </label>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Características</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="air_conditioning" 
                checked={watch("air_conditioning") || false} 
                onCheckedChange={(checked) => setValue("air_conditioning", checked === true)} 
              />
              <label htmlFor="air_conditioning" className="text-sm">Ar condicionado</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="built_in_wardrobes" 
                checked={watch("built_in_wardrobes") || false} 
                onCheckedChange={(checked) => setValue("built_in_wardrobes", checked === true)} 
              />
              <label htmlFor="built_in_wardrobes" className="text-sm">Roupeiros embutidos</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="elevator" 
                checked={watch("elevator") || false} 
                onCheckedChange={(checked) => setValue("elevator", checked === true)} 
              />
              <label htmlFor="elevator" className="text-sm">Elevador</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="balcony_terrace" 
                checked={watch("balcony_terrace") || false} 
                onCheckedChange={(checked) => setValue("balcony_terrace", checked === true)} 
              />
              <label htmlFor="balcony_terrace" className="text-sm">Varanda/Terraço</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="parking" 
                checked={watch("parking") || false} 
                onCheckedChange={(checked) => setValue("parking", checked === true)} 
              />
              <label htmlFor="parking" className="text-sm">Estacionamento</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="garden" 
                checked={watch("garden") || false} 
                onCheckedChange={(checked) => setValue("garden", checked === true)} 
              />
              <label htmlFor="garden" className="text-sm">Jardim</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="pool" 
                checked={watch("pool") || false} 
                onCheckedChange={(checked) => setValue("pool", checked === true)} 
              />
              <label htmlFor="pool" className="text-sm">Piscina</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="storage" 
                checked={watch("storage") || false} 
                onCheckedChange={(checked) => setValue("storage", checked === true)} 
              />
              <label htmlFor="storage" className="text-sm">Arrecadação</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="adapted_house" 
                checked={watch("adapted_house") || false} 
                onCheckedChange={(checked) => setValue("adapted_house", checked === true)} 
              />
              <label htmlFor="adapted_house" className="text-sm">Casa adaptada</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="luxury_house" 
                checked={watch("luxury_house") || false} 
                onCheckedChange={(checked) => setValue("luxury_house", checked === true)} 
              />
              <label htmlFor="luxury_house" className="text-sm">Casa de luxo</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="sea_view" 
                checked={watch("sea_view") || false} 
                onCheckedChange={(checked) => setValue("sea_view", checked === true)} 
              />
              <label htmlFor="sea_view" className="text-sm">Vista mar</label>
            </div>
          </div>
        </div>

        {/* Internal Data Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Dados internos</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Agente angariador</Label>
              <Select defaultValue={property?.agent_captador} onValueChange={(value) => setValue("agent_captador", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Selecionar agente" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="ismael@kingsncompany.com">Ismael</SelectItem>
                  <SelectItem value="joey@kingsncompany.com">Joey</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">O agente que capta o imóvel. Registo a nível interno da agência.</p>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Agente comercializador</Label>
              <Select defaultValue={property?.agent_comercializador} onValueChange={(value) => setValue("agent_comercializador", value)}>
                <SelectTrigger className="bg-white border-gray-300">
                  <SelectValue placeholder="Selecionar agente" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="ismael@kingsncompany.com">Ismael</SelectItem>
                  <SelectItem value="joey@kingsncompany.com">Joey</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-gray-600 mt-1">O imóvel é atribuído ao agente comercializador.</p>
            </div>

            <div className="space-y-1">
              <p className="text-sm">Telefone: 967333803</p>
              <p className="text-sm">Email: services@kingsncompany.com</p>
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Referência interna</Label>
              <Input {...register("internal_reference")} className="bg-white border-gray-300" />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="px-8">
            Cancelar
          </Button>
          <Button 
            type="button"
            onClick={() => {
              console.log("Guardar button clicked");
              const formData = watch();
              console.log("Current form data:", formData);
              
              const propertyData = {
                title: formData.title || "",
                property_type: formData.property_type || "",
                city: formData.city || "",
                location: formData.location || "",
                street_number: formData.street_number || null,
                no_street_number: formData.no_street_number || false,
                block: formData.block || null,
                door: formData.door || null,
                urbanization_name: formData.urbanization_name || null,
                price: Number(formData.price) || 0,
                operation_sale: formData.operation_sale !== undefined ? formData.operation_sale : true,
                operation_rent: formData.operation_rent || false,
                transaction_type: formData.transaction_type || "Comprar",
                condition: formData.condition || "",
                construction_area: Number(formData.construction_area) || 0,
                private_area: Number(formData.private_area) || 0,
                lot_area: Number(formData.lot_area) || null,
                building_year: Number(formData.building_year) || null,
                heating_type: formData.heating_type || null,
                energy_class: formData.energy_class || null,
                orientation_north: formData.orientation_north || false,
                orientation_south: formData.orientation_south || false,
                orientation_east: formData.orientation_east || false,
                orientation_west: formData.orientation_west || false,
                built_in_wardrobes: formData.built_in_wardrobes || false,
                air_conditioning: formData.air_conditioning || false,
                balcony_terrace: formData.balcony_terrace || false,
                parking: formData.parking || false,
                storage: formData.storage || false,
                pool: formData.pool || false,
                garden: formData.garden || false,
                elevator: formData.elevator || false,
                adapted_house: formData.adapted_house || false,
                luxury_house: formData.luxury_house || false,
                sea_view: formData.sea_view || false,
                bathrooms: formData.bathrooms ? Number(formData.bathrooms) : null,
                bedrooms: formData.bedrooms || "",
                total_floors: formData.total_floors ? Number(formData.total_floors) : null,
                description: formData.description || "",
                video_url: formData.video_url || null,
                floor_plan_url: formData.floor_plan_url || null,
                virtual_tour_url: formData.virtual_tour_url || null,
                status: formData.status || "active",
                featured: formData.featured || false,
                internal_reference: formData.internal_reference || null,
                private_notes: formData.private_notes || null,
                notes_visibility: formData.notes_visibility || null,
                agent_captador: formData.agent_captador || null,
                agent_comercializador: formData.agent_comercializador || null,
                // Apartment-specific fields
                floor: formData.floor || null,
                is_top_floor: formData.is_top_floor || false,
                penthouse: formData.penthouse || false,
                t0: formData.t0 || false,
                duplex: formData.duplex || false,
              };
              
              console.log("Submitting property data:", propertyData);
              saveMutation.mutate(propertyData as PropertyFormData);
            }}
            disabled={saveMutation.isPending} 
            className="px-8"
          >
            {saveMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                A guardar...
              </>
            ) : "Guardar"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PropertyEditor;
