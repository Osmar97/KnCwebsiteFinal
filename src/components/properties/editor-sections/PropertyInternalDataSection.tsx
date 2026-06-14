import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ADMIN_PROFILES } from "@/lib/adminConfig";
import type { PropertyForm } from "./types";

export function PropertyInternalDataSection({ form }: { form: PropertyForm }) {
  const { register, watch, setValue } = form;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Dados internos</h2>
      <div className="space-y-4 max-w-md">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Agente angariador</Label>
          <Select value={watch("agent_captador")} onValueChange={(v) => setValue("agent_captador", v)}>
            <SelectTrigger className="bg-white border-gray-300"><SelectValue placeholder="Selecionar agente" /></SelectTrigger>
            <SelectContent className="bg-white z-50">
              {ADMIN_PROFILES.map((a) => (
                <SelectItem key={a.email} value={a.email}>{a.shortName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600 mt-1">O agente que capta o imóvel. Registo a nível interno da agência.</p>
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Agente comercializador</Label>
          <Select value={watch("agent_comercializador")} onValueChange={(v) => setValue("agent_comercializador", v)}>
            <SelectTrigger className="bg-white border-gray-300"><SelectValue placeholder="Selecionar agente" /></SelectTrigger>
            <SelectContent className="bg-white z-50">
              {ADMIN_PROFILES.map((a) => (
                <SelectItem key={a.email} value={a.email}>{a.shortName}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-gray-600 mt-1">O imóvel é atribuído ao agente comercializador.</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm">Telefone: 967333803</p>
          <p className="text-sm">Email: services@kingsncompany.com</p>
        </div>
        <div>
          <Label className="text-sm font-semibold mb-2 block">Referência interna</Label>
          <Input {...register("internal_reference")} className="bg-white border-gray-300" />
        </div>
      </div>
    </div>
  );
}