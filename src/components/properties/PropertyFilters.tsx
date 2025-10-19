import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

interface PropertyFiltersProps {
  filters: any;
  setFilters: (filters: any) => void;
}

const PropertyFilters = ({ filters, setFilters }: PropertyFiltersProps) => {
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

  const features = [
    { id: "air_conditioning", label: "Ar condicionado" },
    { id: "built_in_wardrobes", label: "Armários embutidos" },
    { id: "elevator", label: "Elevador" },
    { id: "balcony_terrace", label: "Varanda e terraço" },
    { id: "parking", label: "Lugar de garagem" },
    { id: "garden", label: "Jardim" },
    { id: "pool", label: "Piscina" },
    { id: "storage", label: "Arrecadação" },
    { id: "adapted_house", label: "Casa adaptada" },
    { id: "luxury_house", label: "Casa de luxo" },
    { id: "sea_view", label: "Vista mar" },
  ];

  const togglePropertyType = (type: string) => {
    setFilters({
      ...filters,
      propertyTypes: filters.propertyTypes.includes(type)
        ? filters.propertyTypes.filter((t: string) => t !== type)
        : [...filters.propertyTypes, type],
    });
  };

  const toggleFeature = (feature: string) => {
    setFilters({
      ...filters,
      features: filters.features.includes(feature)
        ? filters.features.filter((f: string) => f !== feature)
        : [...filters.features, feature],
    });
  };

  return (
    <div className="bg-card border rounded-lg p-6 space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Tipo de transação</h3>
        <div className="flex gap-2">
          <Button
            variant={filters.transactionType === "Comprar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Comprar" })}
            className="flex-1"
          >
            Comprar
          </Button>
          <Button
            variant={filters.transactionType === "Arrendar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Arrendar" })}
            className="flex-1"
          >
            Arrendar
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Preço</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Mín</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div>
            <Label>Máx</Label>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Tamanho (m²)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Mín</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minSize}
              onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
            />
          </div>
          <div>
            <Label>Máx</Label>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxSize}
              onChange={(e) => setFilters({ ...filters, maxSize: e.target.value })}
            />
          </div>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Tipo de casa</h3>
        <div className="space-y-2">
          {propertyTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => togglePropertyType(type)}
              />
              <label htmlFor={type} className="text-sm cursor-pointer">
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Quartos</h3>
        <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
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

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Casas de banho</h3>
        <Select value={filters.bathrooms} onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4">4</SelectItem>
            <SelectItem value="4+">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Estado</h3>
        <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nova construção">Nova construção</SelectItem>
            <SelectItem value="Bom estado">Bom estado</SelectItem>
            <SelectItem value="Para recuperar">Para recuperar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Características</h3>
        <div className="space-y-2">
          {features.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={filters.features.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
              />
              <label htmlFor={feature.id} className="text-sm cursor-pointer">
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyFilters;
