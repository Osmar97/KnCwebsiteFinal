import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { logger } from "@/lib/logger";

interface Init {
  images?: string[];
  floorPlans?: string[];
  videos?: string[];
  userId?: string | null;
}

/**
 * Centralizes all media upload / reorder logic used by the property editor:
 *  - image upload to `property-images`
 *  - floor-plan upload to `property-images`
 *  - video upload to `videos`
 *  - drag-and-drop + button reordering for images
 */
export function usePropertyMediaUploads(init: Init = {}) {
  const { toast } = useToast();
  const [imageUrls, setImageUrls] = useState<string[]>(init.images ?? []);
  const [floorPlanUrls, setFloorPlanUrls] = useState<string[]>(init.floorPlans ?? []);
  const [videoUrls, setVideoUrls] = useState<string[]>(init.videos ?? []);
  const [uploading, setUploading] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const next: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Math.random()}.${ext}`;
        const { error } = await supabase.storage.from("property-images").upload(fileName, file);
        if (error) {
          toast({ title: "Erro ao carregar imagem", description: error.message, variant: "destructive" });
        } else {
          const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
          next.push(data.publicUrl);
        }
      }
      if (next.length > 0) {
        setImageUrls((prev) => [...prev, ...next]);
        toast({ title: "Imagens carregadas com sucesso", description: `${next.length} imagem(ns) adicionada(s)` });
      }
    } catch (err) {
      logger.error(err);
      toast({ title: "Erro ao carregar imagens", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setUploading(true);
    const next: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const ext = file.name.split(".").pop();
        const fileName = `${Math.random()}.${ext}`;
        const { error } = await supabase.storage.from("property-images").upload(fileName, file);
        if (error) {
          toast({ title: "Erro ao carregar planta", description: error.message, variant: "destructive" });
        } else {
          const { data } = supabase.storage.from("property-images").getPublicUrl(fileName);
          next.push(data.publicUrl);
        }
      }
      if (next.length > 0) {
        setFloorPlanUrls((prev) => [...prev, ...next]);
        toast({ title: "Plantas carregadas com sucesso", description: `${next.length} planta(s) adicionada(s)` });
      }
    } catch (err) {
      logger.error(err);
      toast({ title: "Erro ao carregar plantas", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    if (!init.userId) {
      toast({ title: "Erro: Usuário não autenticado", variant: "destructive" });
      return;
    }
    setUploading(true);
    const next: string[] = [];
    for (const file of Array.from(files)) {
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${init.userId}/${timestamp}_${sanitizedName}`;
      const { error } = await supabase.storage.from("videos").upload(fileName, file);
      if (error) {
        logger.error("Video upload error:", error);
        toast({ title: "Erro ao carregar vídeo", description: error.message, variant: "destructive" });
      } else {
        const { data } = supabase.storage.from("videos").getPublicUrl(fileName);
        next.push(data.publicUrl);
      }
    }
    setVideoUrls((prev) => [...prev, ...next]);
    setUploading(false);
  };

  const moveImage = (index: number, direction: "left" | "right") => {
    setImageUrls((prev) => {
      const newIndex = direction === "left" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;
      const copy = [...prev];
      [copy[index], copy[newIndex]] = [copy[newIndex], copy[index]];
      return copy;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };
  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    setImageUrls((prev) => {
      const copy = [...prev];
      const dragged = copy[draggedIndex];
      copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, dragged);
      return copy;
    });
    setDraggedIndex(null);
  };
  const handleDragEnd = () => setDraggedIndex(null);

  return {
    imageUrls, setImageUrls,
    floorPlanUrls, setFloorPlanUrls,
    videoUrls, setVideoUrls,
    uploading,
    draggedIndex,
    handleImageUpload,
    handleFloorPlanUpload,
    handleVideoUpload,
    moveImage,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
  };
}
