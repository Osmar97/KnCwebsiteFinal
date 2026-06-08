import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { PropertyFormData } from "@/schemas/propertySchema";

interface MediaPayload {
  images: string[];
  floorPlans: string[];
  bedrooms: number;
  bathrooms: number;
  descriptions: Record<string, string>;
}

/** Builds the row payload sent to Supabase from the form + side state. */
export function buildPropertyPayload(data: PropertyFormData, media: MediaPayload) {
  return {
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
    images: media.images,
    floor_plans: media.floorPlans,
    bedrooms: media.bedrooms.toString(),
    bathrooms: media.bathrooms || null,
    total_floors: data.total_floors ? Number(data.total_floors) : null,
    description: media.descriptions.pt || media.descriptions.en || "",
    descriptions: media.descriptions,
    video_url: data.video_url || null,
    floor_plan_url: data.floor_plan_url || null,
    virtual_tour_url: data.virtual_tour_url || null,
    status: "active",
    featured: data.featured || false,
    internal_reference: data.internal_reference || null,
    private_notes: data.private_notes || null,
    notes_visibility: data.notes_visibility || null,
    floor: data.floor ? parseInt(data.floor) : null,
    is_top_floor: data.is_top_floor || false,
    penthouse: data.penthouse || false,
    t0: data.t0 || false,
    duplex: data.duplex || false,
    agent_captador: data.agent_captador || null,
    agent_comercializador: data.agent_comercializador || null,
  };
}

interface SaveOptions {
  existingId: string | null;
  onSuccess?: () => void;
}

export function useSaveProperty({ existingId, onSuccess }: SaveOptions) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (payload: ReturnType<typeof buildPropertyPayload>): Promise<string> => {
      if (existingId) {
        const { error } = await supabase
          .from("properties" as any)
          .update(payload)
          .eq("id", existingId);
        if (error) throw error;
        return existingId;
      }
      const { data: created, error } = await supabase
        .from("properties" as any)
        .insert([payload])
        .select()
        .single();
      if (error) throw error;
      return (created as any).id as string;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-properties"] });
      toast({
        title: "Imóvel guardado com sucesso",
        description: existingId ? "O imóvel foi atualizado" : "Novo imóvel criado",
      });
      onSuccess?.();
    },
    onError: (error: Error) => {
      toast({
        title: "Erro ao guardar imóvel",
        description: error?.message || "Por favor, tente novamente",
        variant: "destructive",
      });
    },
  });
}