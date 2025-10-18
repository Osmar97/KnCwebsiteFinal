import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface PropertyFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

export function PropertyFilters({ filters, setFilters }: PropertyFiltersProps) {
  const [openSections, setOpenSections] = useState<string[]>(["type", "rooms"]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const propertyTypes = [
    "Apartamentos",
    "Penthouses",
    "Duplex",
    "Casas",
    "Moradias",
    "Lofts",
    "Moradias térreas",
    "Quintas",
  ];

  const bedroomOptions = ["T0", "T1", "T2", "T3", "T4", "T4+"];
  const bathroomOptions = ["1", "2", "3", "4", "4+"];
  const conditionOptions = ["Nova construção", "Bom estado", "Para recuperar"];

  return (
    <Card className="p-4 space-y-4">
      <div>
        <Label>Preço</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
          />
        </div>
      </div>

      <div>
        <Label>Tamanho (m²)</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minSize}
            onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxSize}
            onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
          />
        </div>
      </div>

      <Collapsible open={openSections.includes("type")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("type")}
          className="flex items-center justify-between w-full"
        >
          <Label>Tipo de casa</Label>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes("type") ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      propertyTypes: [...filters.propertyTypes, type],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      propertyTypes: filters.propertyTypes.filter((t: string) => t !== type),
                    });
                  }
                }}
              />
              <label className="text-sm">{type}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={openSections.includes("rooms")}>
        <CollapsibleTrigger
          onClick={() => toggleSection("rooms")}
          className="flex items-center justify-between w-full"
        >
          <Label>Quartos</Label>
          <ChevronDown className={`w-4 h-4 transition-transform ${openSections.includes("rooms") ? "rotate-180" : ""}`} />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-2">
            {bedroomOptions.map((option) => (
              <Button
                key={option}
                variant={filters.bedrooms.includes(option) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (filters.bedrooms.includes(option)) {
                    setFilters({
                      ...filters,
                      bedrooms: filters.bedrooms.filter((b: string) => b !== option),
                    });
                  } else {
                    setFilters({
                      ...filters,
                      bedrooms: [...filters.bedrooms, option],
                    });
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label>Casas de banho</Label>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          <div className="flex flex-wrap gap-2">
            {bathroomOptions.map((option) => (
              <Button
                key={option}
                variant={filters.bathrooms.includes(option) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (filters.bathrooms.includes(option)) {
                    setFilters({
                      ...filters,
                      bathrooms: filters.bathrooms.filter((b: string) => b !== option),
                    });
                  } else {
                    setFilters({
                      ...filters,
                      bathrooms: [...filters.bathrooms, option],
                    });
                  }
                }}
              >
                {option}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label>Estado</Label>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {conditionOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.condition.includes(option)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      condition: [...filters.condition, option],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      condition: filters.condition.filter((c: string) => c !== option),
                    });
                  }
                }}
              />
              <label className="text-sm">{option}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Collapsible>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <Label>Características</Label>
          <ChevronDown className="w-4 h-4" />
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-2 mt-2">
          {Object.entries({
            airConditioning: "Ar condicionado",
            builtInWardrobes: "Armários embutidos",
            elevator: "Elevador",
            balconyTerrace: "Varanda e terraço",
            parking: "Lugar de garagem",
            garden: "Jardim",
            pool: "Piscina",
            storage: "Arrecadação",
            adaptedHouse: "Casa adaptada",
            luxuryHouse: "Casa de luxo",
            seaView: "Vista mar",
          }).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                checked={filters.features[key]}
                onCheckedChange={(checked) => {
                  setFilters({
                    ...filters,
                    features: { ...filters.features, [key]: checked },
                  });
                }}
              />
              <label className="text-sm">{label}</label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Button
        variant="outline"
        className="w-full"
        onClick={() =>
          setFilters({
            transactionType: "Comprar",
            minPrice: "",
            maxPrice: "",
            minSize: "",
            maxSize: "",
            propertyTypes: [],
            bedrooms: [],
            bathrooms: [],
            condition: [],
            features: {
              airConditioning: false,
              builtInWardrobes: false,
              elevator: false,
              balconyTerrace: false,
              parking: false,
              garden: false,
              pool: false,
              storage: false,
              adaptedHouse: false,
              luxuryHouse: false,
              seaView: false,
            },
          })
        }
      >
        Limpar filtros
      </Button>
    </Card>
  );
}
