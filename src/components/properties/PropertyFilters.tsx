import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PropertyRangeSelect } from "./PropertyRangeSelect";
import {
  PROPERTY_TYPES,
  PROPERTY_FEATURES,
  PRICE_MIN_OPTIONS,
  PRICE_MAX_OPTIONS,
  SIZE_MIN_OPTIONS,
  SIZE_MAX_OPTIONS,
} from "./propertyFilterOptions";

export interface PropertyFilterState {
  transactionType: "Comprar" | "Arrendar";
  minPrice: string;
  maxPrice: string;
  minSize: string;
  maxSize: string;
  propertyTypes: string[];
  bedrooms: string;
  bathrooms: string;
  condition: string;
  features: string[];
}

interface PropertyFiltersProps {
  filters: PropertyFilterState;
  setFilters: (filters: PropertyFilterState) => void;
}

const PropertyFilters = ({ filters, setFilters }: PropertyFiltersProps) => {
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
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-primary mb-2">Filters</h2>
        <div className="h-0.5 w-16 bg-gold"></div>
      </div>

      {/* Transaction Type */}
      <div className="pb-6 border-b border-gray-200">
        <h3 className="font-medium text-gray-700 mb-3">Transaction type</h3>
        <div className="flex gap-2">
          <Button
            variant={filters.transactionType === "Comprar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Comprar" })}
            className={`flex-1 ${
              filters.transactionType === "Comprar"
                ? "bg-gold hover:bg-gold-dark text-white"
                : "border-gray-300 hover:border-gold hover:text-gold"
            }`}
          >
            Buy
          </Button>
          <Button
            variant={filters.transactionType === "Arrendar" ? "default" : "outline"}
            onClick={() => setFilters({ ...filters, transactionType: "Arrendar" })}
            className={`flex-1 ${
              filters.transactionType === "Arrendar"
                ? "bg-gold hover:bg-gold-dark text-white"
                : "border-gray-300 hover:border-gold hover:text-gold"
            }`}
          >
            Rent
          </Button>
        </div>
      </div>

      {/* Price */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Price</h3>
        <div className="grid grid-cols-2 gap-3">
          <PropertyRangeSelect
            label="Min"
            unitSuffix="€"
            placeholder="Min"
            value={filters.minPrice}
            options={PRICE_MIN_OPTIONS}
            customPlaceholder="Enter amount"
            onChange={(v) => setFilters({ ...filters, minPrice: v })}
          />
          <PropertyRangeSelect
            label="Max"
            unitSuffix="€"
            placeholder="Max"
            value={filters.maxPrice}
            options={PRICE_MAX_OPTIONS}
            customPlaceholder="Enter amount"
            onChange={(v) => setFilters({ ...filters, maxPrice: v })}
          />
        </div>
      </div>

      {/* Size */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Size (m²)</h3>
        <div className="grid grid-cols-2 gap-3">
          <PropertyRangeSelect
            label="Min"
            unitSuffix="m²"
            placeholder="Min"
            value={filters.minSize}
            options={SIZE_MIN_OPTIONS}
            customPlaceholder="Enter size"
            onChange={(v) => setFilters({ ...filters, minSize: v })}
          />
          <PropertyRangeSelect
            label="Max"
            unitSuffix="m²"
            placeholder="Max"
            value={filters.maxSize}
            options={SIZE_MAX_OPTIONS}
            customPlaceholder="Enter size"
            onChange={(v) => setFilters({ ...filters, maxSize: v })}
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Property type</h3>
        <div className="space-y-2.5">
          {PROPERTY_TYPES.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.propertyTypes.includes(type)}
                onCheckedChange={() => togglePropertyType(type)}
                className="border-gray-300 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <label
                htmlFor={type}
                className="text-sm cursor-pointer text-gray-700 hover:text-gold transition-colors"
              >
                {type}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Bedrooms */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Bedrooms</h3>
        <Select value={filters.bedrooms} onValueChange={(value) => setFilters({ ...filters, bedrooms: value })}>
          <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="T0">Studio</SelectItem>
            <SelectItem value="T1">1 bed</SelectItem>
            <SelectItem value="T2">2 beds</SelectItem>
            <SelectItem value="T3">3 beds</SelectItem>
            <SelectItem value="T4+">4+ beds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bathrooms */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Bathrooms</h3>
        <Select value={filters.bathrooms} onValueChange={(value) => setFilters({ ...filters, bathrooms: value })}>
          <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="1">1</SelectItem>
            <SelectItem value="2">2</SelectItem>
            <SelectItem value="3">3</SelectItem>
            <SelectItem value="4+">4+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Condition */}
      <div className="pb-6 border-b border-gray-200 pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Condition</h3>
        <Select value={filters.condition} onValueChange={(value) => setFilters({ ...filters, condition: value })}>
          <SelectTrigger className="border-gray-300 focus:border-gold focus:ring-gold">
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="any">Any</SelectItem>
            <SelectItem value="Nova construção">New construction</SelectItem>
            <SelectItem value="Bom estado">Good condition</SelectItem>
            <SelectItem value="Para recuperar">To renovate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Features */}
      <div className="pt-6">
        <h3 className="font-medium text-gray-700 mb-3">Features</h3>
        <div className="space-y-2.5">
          {PROPERTY_FEATURES.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox
                id={feature.id}
                checked={filters.features.includes(feature.id)}
                onCheckedChange={() => toggleFeature(feature.id)}
                className="border-gray-300 data-[state=checked]:bg-gold data-[state=checked]:border-gold"
              />
              <label
                htmlFor={feature.id}
                className="text-sm cursor-pointer text-gray-700 hover:text-gold transition-colors"
              >
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
