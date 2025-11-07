import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { Loader2, Plus, X, Minus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { propertySchema, PropertyFormData } from "@/schemas/propertySchema";
import { useGeocoding } from "@/hooks/useGeocoding";

interface PropertyEditorProps {
  property?: any;
  onClose: () => void;
}

const PropertyEditor = ({ property, onClose }: PropertyEditorProps) => {
  const { register, handleSubmit, watch, setValue, control, formState: { errors, isValid, dirtyFields, isValidating } } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: "onChange",
    reValidateMode: "onChange",
    defaultValues: property || {
      title: "",
      location: "",
      city: "",
      transaction_type: "Comprar",
      property_type: "",
      price: 0,
      operation_sale: false,
      operation_rent: false,
      condition: "good",
      agent_captador: "kings_n_company",
      agent_comercializador: "kings_n_company",
      notes_visibility: "coordinator",
    },
  });

  const propertyType = watch("property_type");
  const [descriptions, setDescriptions] = useState<Record<string, string>>({
    en: property?.description_en || ""
  });
  const [currentLang, setCurrentLang] = useState("en");
  const [additionalLangs, setAdditionalLangs] = useState<string[]>([]);
  const [bedroomCount, setBedroomCount] = useState(property?.bedrooms || 0);
  const [floorCount, setFloorCount] = useState(property?.floors || 0);
  const [bathroomCount, setBathroomCount] = useState(property?.bathrooms || 0);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { verifyAddress, isVerifying } = useGeocoding();
  const [imageUrls, setImageUrls] = useState<string[]>(property?.images || []);
  const [pdfUrls, setPdfUrls] = useState<string[]>(property?.pdf_urls || []);
  const [videoUrls, setVideoUrls] = useState<string[]>(property?.video_urls || []);
  const [uploading, setUploading] = useState(false);

  const saveMutation = useMutation({
    mutationFn: async (data: PropertyFormData) => {
      const propertyData = {
        ...data,
        images: imageUrls,
        pdf_urls: pdfUrls,
        video_urls: videoUrls,
        bedrooms: bedroomCount.toString(),
        bathrooms: bathroomCount,
        floors: floorCount,
        description: descriptions.pt || descriptions.en,
        description_en: descriptions.en,
        descriptions: descriptions,
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
      toast({ 
        title: "Imóvel guardado com sucesso",
        description: "O imóvel foi adicionado à lista"
      });
      onClose();
    },
    onError: (error) => {
      console.error(error);
      toast({ 
        title: "Erro ao guardar imóvel", 
        description: "Por favor, tente novamente",
        variant: "destructive" 
      });
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
      const { error } = await supabase.storage
        .from("property-images")
        .upload(fileName, file);

      if (error) {
        toast({ title: "Erro ao carregar imagem", variant: "destructive" });
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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    const newPdfUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileName = `${Math.random()}.pdf`;
      const { error } = await supabase.storage
        .from("pdfs")
        .upload(fileName, file);

      if (error) {
        toast({ title: "Erro ao carregar PDF", variant: "destructive" });
      } else {
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

    setUploading(true);
    const newVideoUrls: string[] = [];

    for (const file of Array.from(files)) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage
        .from("videos")
        .upload(fileName, file);

      if (error) {
        toast({ title: "Erro ao carregar vídeo", variant: "destructive" });
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
      const { data, error } = await supabase.functions.invoke("translate-text", {
        body: { text: descriptions.en, targetLang: lang },
      });

      if (error) throw error;

      setDescriptions({ ...descriptions, [lang]: data.translatedText });
      setAdditionalLangs([...additionalLangs, lang]);
      setCurrentLang(lang);
      toast({ title: "Tradução concluída" });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na tradução", variant: "destructive" });
      setDescriptions({ ...descriptions, [lang]: descriptions.en });
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
          <h1 className="text-3xl font-bold">Novo imóvel</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit((data) => saveMutation.mutate(data))} className="container mx-auto px-4 space-y-6">
        {/* Property Type Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Tipo de imóvel *</h2>
            <div className="max-w-md">
                <Controller
                name="property_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
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
                )}
              />
              {errors.property_type && <p className="text-sm text-red-600 mt-1">{errors.property_type.message}</p>}
            </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Localização do imóvel</h2>
          <div className="space-y-4 max-w-md">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Localidade *</Label>
              <Input {...register("city")} className="bg-[#FFFEF0] border-gray-300" />
              {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">Nome da rua / via *</Label>
              <Input {...register("location")} className="bg-[#FFFEF0] border-gray-300" />
              {errors.location && <p className="text-sm text-red-600 mt-1">{errors.location.message}</p>}
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label className="text-sm font-semibold mb-2 block">Número</Label>
                <Input {...register("street_number")} className="bg-[#FFFEF0] border-gray-300" />
              </div>
              <div className="flex items-center space-x-2 pb-2">
                <Checkbox id="no_number" {...register("no_street_number")} />
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

          {/* Portal Visibility */}
          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Visibilidade em portais</h3>
            <RadioGroup defaultValue="exact_address" className="space-y-3">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="exact_address" id="exact_address" className="mt-1" />
                <div>
                  <label htmlFor="exact_address" className="text-sm font-semibold cursor-pointer">Morada exata</label>
                  <p className="text-sm text-gray-600">Recomendado</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="street_only" id="street_only" className="mt-1" />
                <div>
                  <label htmlFor="street_only" className="text-sm font-semibold cursor-pointer">Mostrar só a rua</label>
                  <p className="text-sm text-gray-600">Mantém a confidencialidade e ajuda o utilizador a localizar o teu imóvel</p>
                </div>
              </div>
            </RadioGroup>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Operação e preço *</h2>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="operation_sale" {...register("operation_sale")} />
              <label htmlFor="operation_sale" className="text-sm">Venda</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="operation_rent" {...register("operation_rent")} />
              <label htmlFor="operation_rent" className="text-sm">Arrendamento</label>
            </div>
          </div>

          <div className="max-w-md mb-6">
            <Label className="text-sm font-semibold mb-2 block">Preço *</Label>
            <div className="relative">
              <Input 
                type="number" 
                {...register("price", { 
                  valueAsNumber: true,
                })} 
                className="bg-[#FFFEF0] border-gray-300 pr-12" 
                placeholder="0"
                min="0"
                step="0.01"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">€</span>
            </div>
            {errors.price && <p className="text-sm text-red-600 mt-1">O preço é obrigatório</p>}
          </div>

          {propertyType === "Casa / Moradia" && (
            <>
              <h2 className="text-xl font-semibold mb-4 mt-8">Tipologia *</h2>
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

              <h3 className="text-xl font-semibold mb-4">Categoria</h3>
              <div className="flex items-center space-x-2 mb-6">
                <Checkbox id="bank_property" {...register("bank_property")} />
                <label htmlFor="bank_property" className="text-sm">Imóvel do banco</label>
              </div>

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
                    <Input type="number" {...register("private_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <Label className="text-sm font-semibold mb-2 block">M² lote</Label>
                <div className="relative max-w-sm">
                  <Input type="number" {...register("lot_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
                </div>
              </div>

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
              <Controller
                name="energy_class"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
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
                    )}
                  />
                </div>
              </div>

              {/* Conservation State */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Estado de conservação *</h3>
                <Controller
                  name="condition"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup value={field.value || "good"} onValueChange={field.onChange} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="good" id="condition_good" />
                        <label htmlFor="condition_good" className="text-sm cursor-pointer">Bom estado</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="to_recover" id="condition_recover" />
                        <label htmlFor="condition_recover" className="text-sm cursor-pointer">Para recuperar</label>
                      </div>
                    </RadioGroup>
                  )}
                />
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
                    <Checkbox id="orientation_north" {...register("orientation_north")} />
                    <label htmlFor="orientation_north" className="text-sm">Norte</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="orientation_south" {...register("orientation_south")} />
                    <label htmlFor="orientation_south" className="text-sm">Sul</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="orientation_east" {...register("orientation_east")} />
                    <label htmlFor="orientation_east" className="text-sm">Este</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="orientation_west" {...register("orientation_west")} />
                    <label htmlFor="orientation_west" className="text-sm">Oeste</label>
                  </div>
                </div>
              </div>

              {/* Other Characteristics */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Outras características do imóvel</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="built_in_wardrobes" {...register("built_in_wardrobes")} />
                    <label htmlFor="built_in_wardrobes" className="text-sm">Armários embutidos</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="air_conditioning" {...register("air_conditioning")} />
                    <label htmlFor="air_conditioning" className="text-sm">Ar condicionado</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terrace" {...register("terrace")} />
                    <label htmlFor="terrace" className="text-sm">Terraço</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="balcony" {...register("balcony")} />
                    <label htmlFor="balcony" className="text-sm">Varanda</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="parking" {...register("parking")} />
                    <label htmlFor="parking" className="text-sm">Lugar de garagem</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="storage" {...register("storage")} />
                    <label htmlFor="storage" className="text-sm">Arrecadação</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="pool" {...register("pool")} />
                    <label htmlFor="pool" className="text-sm">Piscina</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="garden" {...register("garden")} />
                    <label htmlFor="garden" className="text-sm">Jardim</label>
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="mt-6">
                <p className="text-sm mb-3">
                  Acesso adaptado a pessoas com mobilidade reduzida{" "}
                  <a href="#" className="text-blue-600">Como saber se está adaptado?</a>
                </p>
                <div className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <Checkbox id="adapted_exterior" {...register("adapted_exterior")} />
                    <div className="flex-1">
                      <label htmlFor="adapted_exterior" className="text-sm block">
                        Acesso exterior à casa adaptado (rampas, elevador de 6 pessoas...)
                      </label>
                      <p className="text-xs text-gray-500">Não indicaste se o imóvel tem elevador</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="adapted_wheelchair" {...register("adapted_wheelchair")} />
                    <label htmlFor="adapted_wheelchair" className="text-sm">
                      Adaptado para uso de cadeira de rodas (corredores, portas, barras dobráveis...)
                    </label>
                  </div>
                </div>
              </div>

              {/* Heating Type */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4">Aquecimento</h3>
                <div className="max-w-sm">
                  <Label className="text-sm font-semibold mb-2 block">Tipo de aquecimento</Label>
              <Controller
                name="heating_type"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                        <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
                          <SelectValue placeholder="Selecionar opção" />
                        </SelectTrigger>
                        <SelectContent className="bg-white z-50">
                          <SelectItem value="central">Aquecimento central</SelectItem>
                          <SelectItem value="individual">Aquecimento individual</SelectItem>
                          <SelectItem value="none">Sem aquecimento</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>

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
              <Label className="text-sm font-semibold mb-2 block">Título *</Label>
              <Input {...register("title")} className="bg-[#FFFEF0] border-gray-300" />
              {errors.title && <p className="text-sm text-red-600 mt-1">{errors.title.message}</p>}
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
              <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
                <input 
                  type="file" 
                  multiple
                  accept=".pdf" 
                  onChange={handlePdfUpload}
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
              <Label className="text-sm font-semibold mb-2 block">Agente angariador</Label>
              <Controller
                name="agent_captador"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="kings_n_company">Kings 'n Company</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <p className="text-sm text-gray-600 mt-1">O agente que capta o imóvel. Registo a nível interno da agência.</p>
            </div>
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Agente comercializador</Label>
              <Controller
                name="agent_comercializador"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="kings_n_company">Kings 'n Company</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
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
            
            <div>
              <Label className="text-sm font-semibold mb-2 block">Notas privadas</Label>
              <Textarea {...register("private_notes")} rows={4} className="bg-white border-gray-300" />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Visibilidade das notas</Label>
              <Controller
                name="notes_visibility"
                control={control}
                render={({ field }) => (
                  <Select value={field.value || undefined} onValueChange={field.onChange}>
                    <SelectTrigger className="bg-white border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white z-50">
                      <SelectItem value="coordinator">Visível para ti e para o teu coordenador</SelectItem>
                      <SelectItem value="all">Visível para todos</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="px-8">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={saveMutation.isPending || !isValid} 
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
        
        {!isValid && Object.keys(errors).length > 0 && (
          <div className="text-sm text-red-600 text-right mt-2">
            <p className="font-semibold mb-1">Campos obrigatórios em falta:</p>
            <ul className="list-disc list-inside">
              {errors.title && <li>Título</li>}
              {errors.property_type && <li>Tipo de imóvel</li>}
              {errors.city && <li>Localidade</li>}
              {errors.location && <li>Nome da rua</li>}
              {errors.price && <li>Preço</li>}
            </ul>
          </div>
        )}
      </form>
    </div>
  );
};

export default PropertyEditor;
