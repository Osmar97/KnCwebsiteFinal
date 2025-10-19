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
    "Apartments",
    "Penthouses",
    "Duplex",
    "Houses",
    "Villas",
    "Lofts",
    "Ground floor houses",
    "Estates",
  ];

  const features = [
    { id: "air_conditioning", label: "Air conditioning" },
    { id: "built_in_wardrobes", label: "Built-in wardrobes" },
    { id: "elevator", label: "Lift" },
    { id: "balcony_terrace", label: "Balcony & terrace" },
    { id: "parking", label: "Parking space" },
    { id: "garden", label: "Garden" },
    { id: "pool", label: "Swimming pool" },
    { id: "storage", label: "Storage room" },
    { id: "adapted_house", label: "Adapted house" },
    { id: "luxury_house", label: "Luxury house" },
    { id: "sea_view", label: "Sea view" },
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
        <h3 className="font-semibold mb-4">Transaction type</h3>
        <div className="flex gap-2">
          <Button
            variant={filters.transactionType === "Comprar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Comprar" })}
            className="flex-1"
          >
            Buy
          </Button>
          <Button
            variant={filters.transactionType === "Arrendar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Arrendar" })}
            className="flex-1"
          >
            Rent
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Price</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Min</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
            />
          </div>
          <div>
            <Label>Max</Label>
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
        <h3 className="font-semibold mb-4">Size (m²)</h3>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label>Min</Label>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minSize}
              onChange={(e) => setFilters({ ...filters, minSize: e.target.value })}
            />
          </div>
          <div>
            <Label>Max</Label>
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
        <h3 className="font-semibold mb-4">Property type</h3>
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
        <h3 className="font-semibold mb-4">Bedrooms</h3>
        <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
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

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Bathrooms</h3>
        <Select value={filters.bathrooms} onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
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
        <h3 className="font-semibold mb-4">Condition</h3>
        <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Nova construção">New construction</SelectItem>
            <SelectItem value="Bom estado">Good condition</SelectItem>
            <SelectItem value="Para recuperar">To renovate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div>
        <h3 className="font-semibold mb-4">Features</h3>
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
