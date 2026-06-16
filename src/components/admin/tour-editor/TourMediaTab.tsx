import { Label } from "@/components/ui/label";
import { Loader2, Plus, Upload, X } from "lucide-react";

interface Props {
  heroImage: string | null;
  gallery: string[];
  uploading: boolean;
  onHeroUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGalleryUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearHero: () => void;
  onRemoveGalleryItem: (index: number) => void;
}

export const TourMediaTab = ({
  heroImage,
  gallery,
  uploading,
  onHeroUpload,
  onGalleryUpload,
  onClearHero,
  onRemoveGalleryItem,
}: Props) => (
  <div className="space-y-5">
    <div>
      <Label className="text-sm text-gray-300">Hero image</Label>
      <div className="mt-2 flex items-center gap-3 flex-wrap">
        {heroImage ? (
          <div className="relative w-48 h-32 rounded overflow-hidden border border-gray-800">
            <img src={heroImage} alt="hero" className="w-full h-full object-cover" />
            <button onClick={onClearHero} className="absolute top-1 right-1 bg-black/70 rounded-full p-1">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          <div className="w-48 h-32 border border-dashed border-gray-800 rounded flex items-center justify-center text-gray-500 text-xs">
            No hero image
          </div>
        )}
        <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-md border border-gold text-gold hover:bg-gold hover:text-black min-h-[44px]">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload
          <input type="file" accept="image/*" className="hidden" onChange={onHeroUpload} />
        </label>
      </div>
    </div>

    <div>
      <Label className="text-sm text-gray-300">Gallery</Label>
      <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {gallery.map((url, i) => (
          <div key={i} className="relative aspect-video rounded overflow-hidden border border-gray-800">
            <img src={url} alt="" className="w-full h-full object-cover" />
            <button onClick={() => onRemoveGalleryItem(i)} className="absolute top-1 right-1 bg-black/70 rounded-full p-1">
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ))}
        <label className="cursor-pointer aspect-video flex items-center justify-center gap-2 border border-dashed border-gold/60 rounded text-gold text-sm hover:bg-gold/5">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add
          <input type="file" accept="image/*" multiple className="hidden" onChange={onGalleryUpload} />
        </label>
      </div>
    </div>
  </div>
);