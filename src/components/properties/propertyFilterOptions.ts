export const PROPERTY_TYPES = [
  "Apartments",
  "Penthouses",
  "Duplex",
  "Houses",
  "Villas",
  "Lofts",
  "Ground floor houses",
  "Estates",
];

export const PROPERTY_FEATURES = [
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

const baseAmounts = ["60000", "80000", "100000", "120000", "140000", "150000", "160000", "180000", "200000", "250000", "300000", "400000", "500000"];
export const PRICE_MIN_OPTIONS = baseAmounts;
export const PRICE_MAX_OPTIONS = [...baseAmounts, "750000", "1000000", "1500000", "2000000"];

const baseSizes = ["50", "75", "100", "125", "150", "200", "250", "300", "400", "500"];
export const SIZE_MIN_OPTIONS = baseSizes;
export const SIZE_MAX_OPTIONS = [...baseSizes, "750", "1000"];

export const formatNumber = (v: string) => Number(v).toLocaleString();