import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { PropertyForm } from "./types";

const TYPES = [
  "Casa / Moradia", "Apartamento", "Casa rústica", "Quarto",
  "Espaço comercial ou armazém", "Trespasse", "Garagem", "Escritório",
  "Terreno", "Arrecadação", "Prédio",
];

export function PropertyTypeSection({ form }: { form: PropertyForm }) {
  const { watch, setValue, formState: { errors } } = form;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Tipo de imóvel</h2>
      <div className="max-w-md">
        <Select value={watch("property_type")} onValueChange={(value) => setValue("property_type", value)}>
          <SelectTrigger className="bg-[#FFFEF0] border-gray-300">
            <SelectValue placeholder="Selecionar opção" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            {TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        {errors.property_type && <p className="text-sm text-red-600 mt-1">{errors.property_type.message}</p>}
      </div>
    </div>
  );
}