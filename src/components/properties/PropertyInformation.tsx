interface Division {
  name: string;
  area: number | string;
}

interface Props {
  privateArea?: number | null;
  constructionArea?: number | null;
  lotArea?: number | null;
  divisions: Division[];
  features: {
    air_conditioning?: boolean;
    built_in_wardrobes?: boolean;
    elevator?: boolean;
    balcony_terrace?: boolean;
    parking?: boolean;
    garden?: boolean;
    pool?: boolean;
    storage?: boolean;
    adapted_house?: boolean;
    sea_view?: boolean;
  };
}

const FEATURE_LABELS: Array<[keyof Props["features"], string]> = [
  ["air_conditioning", "Air conditioning"],
  ["built_in_wardrobes", "Built-in wardrobes"],
  ["elevator", "Lift"],
  ["balcony_terrace", "Balcony & terrace"],
  ["parking", "Parking space"],
  ["garden", "Garden"],
  ["pool", "Swimming pool"],
  ["storage", "Storage room"],
  ["adapted_house", "Adapted house"],
  ["sea_view", "Sea view"],
];

export const PropertyInformation = ({ privateArea, constructionArea, lotArea, divisions, features }: Props) => (
  <div className="mb-6 sm:mb-8">
    <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gold">Information</h2>

    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Areas</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {privateArea != null && (
          <AreaCard value={`${privateArea}m²`} label="Liveable Area" />
        )}
        {constructionArea != null && (
          <AreaCard value={`${constructionArea}m²`} label="Gross Construction Area" />
        )}
        {lotArea != null && (
          <AreaCard value={`${lotArea}m²`} label="Land Area" />
        )}
      </div>
    </div>

    {divisions.length > 0 && (
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Rooms</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {divisions.map((d, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-gray-800 py-2">
              <span className="text-xs sm:text-sm text-gray-300">{d.name}</span>
              <span className="text-xs sm:text-sm text-gray-400">{d.area}m²</span>
            </div>
          ))}
        </div>
      </div>
    )}

    <div>
      <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Features</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
        {FEATURE_LABELS.map(([key, label]) =>
          features[key] ? (
            <div key={key} className="text-xs sm:text-sm">✓ {label}</div>
          ) : null
        )}
      </div>
    </div>
  </div>
);

const AreaCard = ({ value, label }: { value: string; label: string }) => (
  <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
    <div className="text-xl sm:text-2xl font-bold text-gold">{value}</div>
    <div className="text-xs sm:text-sm text-gray-400">{label}</div>
  </div>
);