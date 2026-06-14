import { Checkbox } from "@/components/ui/checkbox";
import type { PropertyForm } from "./types";

const FEATURES: [string, string][] = [
  ["air_conditioning", "Ar condicionado"],
  ["built_in_wardrobes", "Roupeiros embutidos"],
  ["elevator", "Elevador"],
  ["balcony_terrace", "Varanda/Terraço"],
  ["parking", "Estacionamento"],
  ["garden", "Jardim"],
  ["pool", "Piscina"],
  ["storage", "Arrecadação"],
  ["adapted_house", "Casa adaptada"],
  ["luxury_house", "Casa de luxo"],
  ["sea_view", "Vista mar"],
];

export function PropertyFeaturesSection({ form }: { form: PropertyForm }) {
  const { watch, setValue } = form;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Características</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {FEATURES.map(([k, label]) => (
          <div key={k} className="flex items-center space-x-2">
            <Checkbox
              id={k}
              checked={Boolean(watch(k as any))}
              onCheckedChange={(checked) => setValue(k as any, checked === true)}
            />
            <label htmlFor={k} className="text-sm">{label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}