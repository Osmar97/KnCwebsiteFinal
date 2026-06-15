import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { propertySchema, PropertyFormData } from "@/schemas/propertySchema";
import { useAdmin } from "@/contexts/AdminContext";
import { usePropertyMediaUploads } from "@/hooks/properties/usePropertyMediaUploads";
import { usePropertyDescriptions } from "@/hooks/properties/usePropertyDescriptions";
import { buildPropertyPayload, useSaveProperty } from "@/hooks/properties/useSaveProperty";
import type { Tables } from "@/integrations/supabase/types";
import { PropertyTypeSection } from "./editor-sections/PropertyTypeSection";
import { PropertyLocationSection } from "./editor-sections/PropertyLocationSection";
import { PropertyDetailsSection } from "./editor-sections/PropertyDetailsSection";
import { PropertyDescriptionSection } from "./editor-sections/PropertyDescriptionSection";
import { PropertyMediaSection } from "./editor-sections/PropertyMediaSection";
import { PropertyFeaturesSection } from "./editor-sections/PropertyFeaturesSection";
import { PropertyInternalDataSection } from "./editor-sections/PropertyInternalDataSection";

/**
 * The editor accepts a property row from Supabase plus a few legacy/extension
 * fields that aren't (yet) part of the generated `properties` schema.
 */
type PropertyRow = Tables<"properties"> & {
  house_subtype?: string;
  floors?: number;
  video_urls?: string[];
  descriptions?: Record<string, string> | null;
};

interface PropertyEditorProps {
  property?: PropertyRow;
  onClose: () => void;
}

function getPropertyDefaultValues(property?: PropertyRow): PropertyFormData {
  const p = (property ?? {}) as Partial<PropertyRow>;
  return {
    title: p.title || "",
    location: p.location || "",
    city: p.city || "",
    street_number: p.street_number ?? "",
    no_street_number: p.no_street_number ?? false,
    block: p.block ?? "",
    door: p.door ?? "",
    urbanization_name: p.urbanization_name ?? "",
    transaction_type: p.transaction_type || "Comprar",
    property_type: p.property_type || "",
    price: p.price || 0,
    operation_sale: p.operation_sale !== undefined ? p.operation_sale : true,
    operation_rent: p.operation_rent || false,
    condition: p.condition || "",
    construction_area: p.construction_area || 0,
    private_area: p.private_area || 0,
    lot_area: p.lot_area || 0,
    building_year: p.building_year || 0,
    heating_type: p.heating_type || "",
    energy_class: p.energy_class || "",
    orientation_north: p.orientation_north ?? false,
    orientation_south: p.orientation_south ?? false,
    orientation_east: p.orientation_east ?? false,
    orientation_west: p.orientation_west ?? false,
    built_in_wardrobes: p.built_in_wardrobes ?? false,
    air_conditioning: p.air_conditioning ?? false,
    balcony_terrace: p.balcony_terrace ?? false,
    parking: p.parking ?? false,
    storage: p.storage ?? false,
    pool: p.pool ?? false,
    garden: p.garden ?? false,
    elevator: p.elevator ?? false,
    adapted_house: p.adapted_house ?? false,
    luxury_house: p.luxury_house ?? false,
    sea_view: p.sea_view ?? false,
    floor: p.floor?.toString() || "",
    total_floors: p.total_floors || 0,
    is_top_floor: p.is_top_floor ?? false,
    penthouse: p.penthouse ?? false,
    t0: p.t0 ?? false,
    duplex: p.duplex ?? false,
    bathrooms: p.bathrooms || 0,
    bedrooms: p.bedrooms || "",
    description: p.description || "",
    video_url: p.video_url || "",
    floor_plan_url: p.floor_plan_url || "",
    virtual_tour_url: p.virtual_tour_url || "",
    status: p.status || "active",
    featured: p.featured || false,
    internal_reference: p.internal_reference || "",
    private_notes: p.private_notes || "",
    notes_visibility: p.notes_visibility || "",
    agent_captador: p.agent_captador || "",
    agent_comercializador: p.agent_comercializador || "",
    house_subtype: p.house_subtype || "moradia_banda",
  } as PropertyFormData;
}

const PropertyEditor = ({ property, onClose }: PropertyEditorProps) => {
  const { supabaseUser } = useAdmin();
  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    mode: "onChange",
    reValidateMode: "onSubmit",
  });
  const { handleSubmit, watch, reset } = form;

  const descObj =
    property?.descriptions && typeof property.descriptions === "object" && !Array.isArray(property.descriptions)
      ? (property.descriptions as Record<string, string>)
      : null;
  const initialDescriptions: Record<string, string> = descObj ?? { pt: property?.description || "" };
  const initialAdditionalLangs = descObj ? Object.keys(descObj).filter((l) => l !== "pt") : [];

  const descState = usePropertyDescriptions({ initialDescriptions, initialAdditionalLangs });

  const [bedroomCount, setBedroomCount] = useState(property?.bedrooms ? parseInt(property.bedrooms) : 0);
  const [floorCount, setFloorCount] = useState(property?.floors || 0);
  const [bathroomCount, setBathroomCount] = useState(property?.bathrooms || 0);

  const media = usePropertyMediaUploads({
    images: property?.images ?? [],
    floorPlans: property?.floor_plans ?? [],
    videos: property?.video_urls ?? [],
    userId: supabaseUser?.id ?? null,
  });

  // Reset form when property changes
  useEffect(() => {
    reset(getPropertyDefaultValues(property), { keepDefaultValues: false });

    if (property) {
      const d = property.descriptions;
      if (d && typeof d === 'object' && !Array.isArray(d)) {
        const dMap = d as Record<string, string>;
        descState.setDescriptions(dMap);
        descState.setAdditionalLangs(Object.keys(dMap).filter((lang) => lang !== 'pt'));
      } else {
        descState.setDescriptions({ pt: property.description || "" });
        descState.setAdditionalLangs([]);
      }
      setBedroomCount(property.bedrooms ? parseInt(property.bedrooms) : 0);
      setBathroomCount(property.bathrooms || 0);
      media.setImageUrls(property.images || []);
      media.setFloorPlanUrls(property.floor_plans || []);
      media.setVideoUrls(property.video_urls || []);
    } else {
      descState.setDescriptions({ pt: "", en: "" });
      setBedroomCount(0);
      setBathroomCount(0);
      media.setImageUrls([]);
      media.setFloorPlanUrls([]);
      media.setVideoUrls([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [property]);

  const saveMutation = useSaveProperty({
    existingId: property?.id ?? null,
    onSuccess: onClose,
  });

  const submitSave = (data: PropertyFormData) => {
    saveMutation.mutate(
      buildPropertyPayload(data, {
        images: media.imageUrls,
        floorPlans: media.floorPlanUrls,
        bedrooms: bedroomCount,
        bathrooms: bathroomCount,
        descriptions: descState.descriptions,
      }),
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-8">
      <div className="bg-white border-b py-6 mb-6">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">{property ? property.title : "Novo imóvel"}</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(submitSave)} className="container mx-auto px-4 space-y-6">
        <PropertyTypeSection form={form} />
        <PropertyLocationSection form={form} />
        <PropertyDetailsSection
          form={form}
          bedroomCount={bedroomCount} setBedroomCount={setBedroomCount}
          bathroomCount={bathroomCount} setBathroomCount={setBathroomCount}
          floorCount={floorCount} setFloorCount={setFloorCount}
        />
        <PropertyDescriptionSection
          form={form}
          descriptions={descState.descriptions}
          setDescriptions={descState.setDescriptions}
          currentLang={descState.currentLang}
          setCurrentLang={descState.setCurrentLang}
          additionalLangs={descState.additionalLangs}
          isTranslating={descState.isTranslating}
          isImproving={descState.isImproving}
          handleAddLanguage={descState.handleAddLanguage}
          handleImproveText={descState.handleImproveText}
        />
        <PropertyMediaSection
          imageUrls={media.imageUrls} setImageUrls={media.setImageUrls}
          floorPlanUrls={media.floorPlanUrls} setFloorPlanUrls={media.setFloorPlanUrls}
          videoUrls={media.videoUrls} setVideoUrls={media.setVideoUrls}
          uploading={media.uploading}
          draggedIndex={media.draggedIndex}
          handleImageUpload={media.handleImageUpload}
          handleFloorPlanUpload={media.handleFloorPlanUpload}
          handleVideoUpload={media.handleVideoUpload}
          moveImage={media.moveImage}
          handleDragStart={media.handleDragStart}
          handleDragOver={media.handleDragOver}
          handleDrop={media.handleDrop}
          handleDragEnd={media.handleDragEnd}
        />
        <PropertyFeaturesSection form={form} />
        <PropertyInternalDataSection form={form} />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="px-8">
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={() => submitSave(watch() as PropertyFormData)}
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