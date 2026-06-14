import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import type { PropertyForm } from "./types";

export function PropertyLocationSection({ form }: { form: PropertyForm }) {
  const { register, watch, setValue } = form;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Localização do imóvel</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Localidade</Label>
          <Input {...register("city")} className="bg-[#FFFEF0] border-gray-300" />
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Nome da rua / via</Label>
          <Input {...register("location")} className="bg-[#FFFEF0] border-gray-300" />
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <Label className="text-sm font-semibold mb-2 block">Número</Label>
            <Input {...register("street_number")} className="bg-[#FFFEF0] border-gray-300" />
          </div>
          <div className="flex items-center space-x-2 pb-2">
            <Checkbox
              id="no_number"
              checked={watch("no_street_number") || false}
              onCheckedChange={(checked) => setValue("no_street_number", checked === true)}
            />
            <label htmlFor="no_number" className="text-sm">Sem número</label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Bloco / Lote</Label>
            <Input {...register("block")} className="bg-white border-gray-300" />
          </div>
          <div>
            <Label className="text-sm font-semibold mb-2 block">Porta</Label>
            <Input {...register("door")} className="bg-white border-gray-300" />
          </div>
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Nome da urbanização</Label>
          <Input {...register("urbanization_name")} className="bg-white border-gray-300" />
        </div>
      </div>
    </div>
  );
}