import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Init {
  initialDescriptions?: Record<string, string>;
  initialAdditionalLangs?: string[];
  initialCurrentLang?: string;
}

/**
 * State + AI helpers (translate, improve) for the multi-language property
 * description editor.
 */
export function usePropertyDescriptions(init: Init = {}) {
  const { toast } = useToast();
  const [descriptions, setDescriptions] = useState<Record<string, string>>(
    init.initialDescriptions ?? { pt: "" },
  );
  const [currentLang, setCurrentLang] = useState(init.initialCurrentLang ?? "pt");
  const [additionalLangs, setAdditionalLangs] = useState<string[]>(init.initialAdditionalLangs ?? []);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const handleAddLanguage = async (lang: string) => {
    if (additionalLangs.includes(lang)) return;
    setIsTranslating(true);
    try {
      const sourceText = descriptions[currentLang];
      if (sourceText && sourceText.trim()) {
        const { data, error } = await supabase.functions.invoke("translate-text", {
          body: { text: sourceText, targetLang: lang },
        });
        if (error) throw error;
        setDescriptions((d) => ({ ...d, [lang]: data.translatedText }));
        toast({ title: "Tradução concluída" });
      } else {
        setDescriptions((d) => ({ ...d, [lang]: "" }));
        toast({ title: "Idioma adicionado sem tradução", description: "Não há texto para traduzir" });
      }
      setAdditionalLangs((p) => [...p, lang]);
      setCurrentLang(lang);
    } catch (error) {
      console.error(error);
      toast({ title: "Erro na tradução", variant: "destructive" });
      setDescriptions((d) => ({ ...d, [lang]: d.en || "" }));
      setAdditionalLangs((p) => [...p, lang]);
      setCurrentLang(lang);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleImproveText = async () => {
    setIsImproving(true);
    try {
      const { data, error } = await supabase.functions.invoke("improve-text", {
        body: { text: descriptions[currentLang], language: currentLang },
      });
      if (error) throw error;
      setDescriptions((d) => ({ ...d, [currentLang]: data.improvedText }));
      toast({ title: "Texto melhorado com sucesso" });
    } catch (error) {
      console.error(error);
      toast({ title: "Erro ao melhorar texto", variant: "destructive" });
    } finally {
      setIsImproving(false);
    }
  };

  return {
    descriptions, setDescriptions,
    currentLang, setCurrentLang,
    additionalLangs, setAdditionalLangs,
    isTranslating,
    isImproving,
    handleAddLanguage,
    handleImproveText,
  };
}