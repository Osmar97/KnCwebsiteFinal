import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus } from "lucide-react";
import type { PropertyForm } from "./types";

interface Props {
  form: PropertyForm;
  bedroomCount: number;
  setBedroomCount: (n: number) => void;
  bathroomCount: number;
  setBathroomCount: (n: number) => void;
  floorCount: number;
  setFloorCount: (n: number) => void;
}

export function PropertyDetailsSection({
  form, bedroomCount, setBedroomCount, bathroomCount, setBathroomCount, floorCount, setFloorCount,
}: Props) {
  const { register, watch, setValue } = form;
  const propertyType = watch("property_type");
  const isHouse = propertyType === "Casa / Moradia";
  const isApartment = propertyType === "Apartamento";

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Operação e preço</h2>
      <div className="space-y-3 mb-6">
        <div className="flex items-center space-x-2">
          <Checkbox id="operation_sale" checked={watch("operation_sale") || false}
            onCheckedChange={(checked) => setValue("operation_sale", checked === true)} />
          <label htmlFor="operation_sale" className="text-sm">Venda</label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox id="operation_rent" checked={watch("operation_rent") || false}
            onCheckedChange={(checked) => setValue("operation_rent", checked === true)} />
          <label htmlFor="operation_rent" className="text-sm">Arrendamento</label>
        </div>
      </div>

      <div className="max-w-md mb-6">
        <Label className="text-sm font-semibold mb-2 block">Preço</Label>
        <div className="relative">
          <Input type="number" {...register("price", { valueAsNumber: true })}
            className="bg-[#FFFEF0] border-gray-300 pr-12" placeholder="0" />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">€</span>
        </div>
      </div>

      {isApartment && (
        <div className="mt-8 space-y-4">
          <div className="max-w-md">
            <Label className="text-sm font-semibold mb-2 block">Andar</Label>
            <Select value={watch("floor") ? String(watch("floor")) : undefined} onValueChange={(v) => setValue("floor", v)}>
              <SelectTrigger className="bg-[#FFFEF0] border-gray-300"><SelectValue placeholder="Selecionar opção" /></SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="ground">Rés-do-chão</SelectItem>
                {[1,2,3,4,5,6,7,8].map(n => <SelectItem key={n} value={String(n)}>{n}º Andar</SelectItem>)}
                <SelectItem value="9+">9º Andar ou superior</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="is_top_floor" checked={watch("is_top_floor") || false}
              onCheckedChange={(checked) => setValue("is_top_floor", checked === true)} />
            <label htmlFor="is_top_floor" className="text-sm">É o último andar do bloco</label>
          </div>
        </div>
      )}

      {isHouse && (
        <>
          <h2 className="text-xl font-semibold mb-4 mt-8">Tipologia</h2>
          <RadioGroup
            value={watch("house_subtype" as any) ? String(watch("house_subtype" as any)) : "moradia_banda"}
            onValueChange={(v) => setValue("house_subtype" as any, v)}
            className="space-y-2 mb-6"
          >
            {[
              ["moradia_banda", "Moradia em banda"],
              ["moradia_geminada", "Moradia geminada"],
              ["moradia_independente", "Moradia independente"],
              ["andar_moradia", "Andar de moradia"],
            ].map(([v, l]) => (
              <div key={v} className="flex items-center space-x-2">
                <RadioGroupItem value={v} id={v} />
                <label htmlFor={v} className="text-sm cursor-pointer">{l}</label>
              </div>
            ))}
          </RadioGroup>
        </>
      )}

      {isApartment && (
        <>
          <h3 className="text-xl font-semibold mb-4 mt-6">Característica adicional</h3>
          <div className="space-y-3 mb-6">
            <div className="flex items-center space-x-2">
              <Checkbox id="penthouse" checked={watch("penthouse") || false}
                onCheckedChange={(c) => setValue("penthouse", c === true)} />
              <label htmlFor="penthouse" className="text-sm">Penthouse</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="t0" checked={watch("t0") || false}
                onCheckedChange={(c) => setValue("t0", c === true)} />
              <label htmlFor="t0" className="text-sm">T0</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="duplex" checked={watch("duplex") || false}
                onCheckedChange={(c) => setValue("duplex", c === true)} />
              <label htmlFor="duplex" className="text-sm">Duplex</label>
            </div>
          </div>
        </>
      )}

      {(isHouse || isApartment) && (
        <>
          <h3 className="text-xl font-semibold mb-4">Tamanho</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">M² área bruta</Label>
              <div className="relative">
                <Input type="number" {...register("construction_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-semibold mb-2 block">M² úteis</Label>
              <div className="relative">
                <Input type="number" {...register("private_area")} className="bg-white border-gray-300 pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
              </div>
            </div>
          </div>

          {isHouse && (
            <div className="mb-6">
              <Label className="text-sm font-semibold mb-2 block">M² lote</Label>
              <div className="relative max-w-sm">
                <Input type="number" {...register("lot_area")} className="bg-[#FFFEF0] border-gray-300 pr-12" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">m²</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            <Counter label="Número de quartos" value={bedroomCount} setValue={setBedroomCount} />
            {isHouse && <Counter label="Andares da moradia" value={floorCount} setValue={setFloorCount} />}
            <Counter label="Número de casas de banho" value={bathroomCount} setValue={setBathroomCount} />
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Classificação do consumo de energia</h3>
            <div className="max-w-sm">
              <Label className="text-sm font-semibold mb-2 block">Classe energética</Label>
              <Select value={watch("energy_class") ? String(watch("energy_class")) : undefined} onValueChange={(v) => setValue("energy_class", v)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300"><SelectValue placeholder="Seleciona opção" /></SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {["A+","A","B","B-","C","D","E","F"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Estado de conservação</h3>
            <RadioGroup value={watch("condition") ? String(watch("condition")) : "good"} onValueChange={(v) => setValue("condition", v)} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="good" id="condition_good" />
                <label htmlFor="condition_good" className="text-sm cursor-pointer">Bom estado</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="to_recover" id="condition_recover" />
                <label htmlFor="condition_recover" className="text-sm cursor-pointer">Para recuperar</label>
              </div>
            </RadioGroup>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Orientação</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                ["orientation_north", "Norte"],
                ["orientation_south", "Sul"],
                ["orientation_east", "Este"],
                ["orientation_west", "Oeste"],
              ].map(([k, l]) => (
                <div key={k} className="flex items-center space-x-2">
                  <Checkbox id={k} checked={Boolean(watch(k as any))}
                    onCheckedChange={(c) => setValue(k as any, c === true)} />
                  <label htmlFor={k} className="text-sm">{l}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Outras características do imóvel</h3>
            <div className="space-y-3">
              {[
                ["built_in_wardrobes", "Armários embutidos"],
                ["air_conditioning", "Ar condicionado"],
                ["balcony_terrace", "Varanda/Terraço"],
                ["parking", "Lugar de garagem"],
                ["storage", "Arrecadação"],
                ["pool", "Piscina"],
                ["garden", "Jardim"],
              ].map(([k, l]) => (
                <div key={k} className="flex items-center space-x-2">
                  <Checkbox id={`d_${k}`} checked={Boolean(watch(k as any))}
                    onCheckedChange={(c) => setValue(k as any, c === true)} />
                  <label htmlFor={`d_${k}`} className="text-sm">{l}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Aquecimento</h3>
            <div className="max-w-sm">
              <Label className="text-sm font-semibold mb-2 block">Tipo de aquecimento</Label>
              <Select value={watch("heating_type") ? String(watch("heating_type")) : undefined} onValueChange={(v) => setValue("heating_type", v)}>
                <SelectTrigger className="bg-[#FFFEF0] border-gray-300"><SelectValue placeholder="Selecionar opção" /></SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="central">Aquecimento central</SelectItem>
                  <SelectItem value="individual">Aquecimento individual</SelectItem>
                  <SelectItem value="none">Sem aquecimento</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isApartment && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">Elevador<span className="text-red-600">*</span></h3>
              <RadioGroup value={watch("elevator") ? "yes" : "no"} onValueChange={(v) => setValue("elevator", v === "yes")} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="elevator_yes" />
                  <label htmlFor="elevator_yes" className="text-sm cursor-pointer">Sim</label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="elevator_no" />
                  <label htmlFor="elevator_no" className="text-sm cursor-pointer">Não</label>
                </div>
              </RadioGroup>
            </div>
          )}

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Prédio</h3>
            <div className="max-w-sm">
              <Label className="text-sm font-semibold mb-2 block">Ano de construção do prédio</Label>
              <Input type="number" {...register("building_year")} className="bg-white border-gray-300" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function Counter({ label, value, setValue }: { label: string; value: number; setValue: (n: number) => void }) {
  return (
    <div>
      <Label className="text-sm font-semibold mb-2 block">{label}</Label>
      <div className="flex items-center gap-4 max-w-sm">
        <Button type="button" variant="outline" size="icon" onClick={() => setValue(Math.max(0, value - 1))} aria-label="Decrease">
          <Minus className="w-4 h-4" />
        </Button>
        <Input type="number" value={value} onChange={(e) => setValue(parseInt(e.target.value) || 0)}
          className="text-center bg-white border-gray-300" />
        <Button type="button" variant="outline" size="icon" onClick={() => setValue(value + 1)} aria-label="Increase">
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}