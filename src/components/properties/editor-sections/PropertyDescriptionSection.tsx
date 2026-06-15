import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { PropertyForm } from "./types";

interface Props {
  form: PropertyForm;
  descriptions: Record<string, string>;
  setDescriptions: (d: Record<string, string>) => void;
  currentLang: string;
  setCurrentLang: (l: string) => void;
  additionalLangs: string[];
  isTranslating: boolean;
  isImproving: boolean;
  handleAddLanguage: (lang: string) => void;
  handleImproveText: () => void;
}

export function PropertyDescriptionSection({
  form, descriptions, setDescriptions, currentLang, setCurrentLang,
  additionalLangs, isTranslating, isImproving, handleAddLanguage, handleImproveText,
}: Props) {
  const { register } = form;
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Descrição da propriedade</h2>
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-semibold mb-2 block">Título</Label>
          <Input {...register("title")} className="bg-[#FFFEF0] border-gray-300" placeholder="Ex: Apartamento T4 + 3 com vista, Chiado, Lisboa" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-sm font-semibold">
              Descrição ({currentLang === "en" ? "English" : currentLang === "pt" ? "Português" : currentLang})
            </Label>
            <div className="flex gap-2">
              {additionalLangs.map((lang) => (
                <Button
                  key={lang}
                  type="button"
                  variant={currentLang === lang ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentLang(lang)}
                >
                  {lang === "pt" ? "PT" : lang === "es" ? "ES" : lang.toUpperCase()}
                </Button>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setCurrentLang("en")} disabled={currentLang === "en"}>EN</Button>
            </div>
          </div>
          <Textarea
            value={descriptions[currentLang] || ""}
            onChange={(e) => setDescriptions({ ...descriptions, [currentLang]: e.target.value })}
            rows={6}
            className="bg-white border-gray-300"
            placeholder="Esta secção é muito importante. Presta especial atenção aos detalhes que não são visíveis nas fotos."
          />
          <div className="flex gap-2 mt-2 items-center">
            <Button
              type="button"
              variant="outline"
              className="text-sm"
              onClick={handleImproveText}
              disabled={isImproving || !descriptions[currentLang]}
            >
              {isImproving && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Melhorar texto com IA
            </Button>
          </div>
          <Select onValueChange={(lang) => handleAddLanguage(lang)} disabled={isTranslating}>
            <SelectTrigger className="w-48 mt-2"><SelectValue placeholder="Adicionar outro idioma" /></SelectTrigger>
            <SelectContent>
              {!additionalLangs.includes("pt") && <SelectItem value="pt">Português</SelectItem>}
              {!additionalLangs.includes("es") && <SelectItem value="es">Espanhol</SelectItem>}
              {!additionalLangs.includes("fr") && <SelectItem value="fr">Francês</SelectItem>}
              {!additionalLangs.includes("de") && <SelectItem value="de">Alemão</SelectItem>}
              {!additionalLangs.includes("it") && <SelectItem value="it">Italiano</SelectItem>}
            </SelectContent>
          </Select>
          {isTranslating && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
              <Loader2 className="w-4 h-4 animate-spin" /> A traduzir...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}