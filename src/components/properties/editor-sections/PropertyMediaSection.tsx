import { Loader2, Plus, X, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Props {
  imageUrls: string[];
  setImageUrls: (urls: string[]) => void;
  floorPlanUrls: string[];
  setFloorPlanUrls: (urls: string[]) => void;
  videoUrls: string[];
  setVideoUrls: (urls: string[]) => void;
  uploading: boolean;
  draggedIndex: number | null;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFloorPlanUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleVideoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  moveImage: (idx: number, dir: "left" | "right") => void;
  handleDragStart: (e: React.DragEvent, idx: number) => void;
  handleDragOver: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, idx: number) => void;
  handleDragEnd: () => void;
}

export function PropertyMediaSection({
  imageUrls, setImageUrls, floorPlanUrls, setFloorPlanUrls, videoUrls, setVideoUrls,
  uploading, draggedIndex, handleImageUpload, handleFloorPlanUpload, handleVideoUpload,
  moveImage, handleDragStart, handleDragOver, handleDrop, handleDragEnd,
}: Props) {
  const { toast } = useToast();
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-xl font-semibold mb-6">Fotos e vídeos</h2>

      <div className="mb-6">
        <h3 className="font-semibold mb-3">Fotos ({imageUrls.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className={`relative group cursor-move ${draggedIndex === idx ? 'opacity-50' : ''}`}
              draggable
              onDragStart={(e) => handleDragStart(e, idx)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, idx)}
              onDragEnd={handleDragEnd}
            >
              <img src={url} alt="" className="w-full h-32 object-cover rounded border pointer-events-none" />
              <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {idx > 0 && (
                  <button type="button" onClick={() => moveImage(idx, "left")} className="bg-blue-500 text-white p-1 rounded-full" title="Mover para a esquerda">
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
                {idx < imageUrls.length - 1 && (
                  <button type="button" onClick={() => moveImage(idx, "right")} className="bg-blue-500 text-white p-1 rounded-full" title="Mover para a direita">
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => {
                  setImageUrls(imageUrls.filter((_, i) => i !== idx));
                  toast({ title: "Imagem removida" });
                }}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
            <Plus className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">Novo</span>
          </label>
        </div>
        {uploading && <div className="flex items-center gap-2 mt-2 text-sm text-gray-600"><Loader2 className="w-4 h-4 animate-spin" /> A carregar...</div>}
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <h3 className="font-semibold">Planimetrias ({floorPlanUrls.length})</h3>
          <span className="text-sm text-gray-600">Plantas em imagem</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {floorPlanUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <img src={url} alt={`Planta ${idx + 1}`} className="w-full h-32 object-cover rounded border" />
              <button
                type="button"
                onClick={() => setFloorPlanUrls(floorPlanUrls.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
            <input type="file" multiple accept="image/*" onChange={handleFloorPlanUpload} className="hidden" />
            <Plus className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">Novo</span>
          </label>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-3">Vídeos ({videoUrls.length})</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {videoUrls.map((url, idx) => (
            <div key={idx} className="relative group">
              <video src={url} className="w-full h-32 object-cover rounded border" controls />
              <button
                type="button"
                onClick={() => setVideoUrls(videoUrls.filter((_, i) => i !== idx))}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
          <label className="w-full h-32 border-2 border-dashed border-gray-300 rounded flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors bg-gray-50">
            <input type="file" multiple accept="video/*" onChange={handleVideoUpload} className="hidden" />
            <Plus className="w-8 h-8 text-gray-400 mb-1" />
            <span className="text-sm text-gray-600">Novo</span>
          </label>
        </div>
      </div>
    </div>
  );
}