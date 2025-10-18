import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ChevronLeft,
  MapPin,
  Heart,
  Share2,
  Bed,
  Bath,
  Maximize,
  Phone,
  Mail,
  Mountain,
} from "lucide-react";
import { useState } from "react";

export default function PropertyDetail() {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("id", id)
        .single();
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  if (!property) return <div className="min-h-screen flex items-center justify-center">Propriedade não encontrada</div>;

  const features = [
    { key: "air_conditioning", label: "Ar condicionado" },
    { key: "built_in_wardrobes", label: "Armários embutidos" },
    { key: "elevator", label: "Elevador" },
    { key: "balcony_terrace", label: "Varanda e terraço" },
    { key: "parking", label: "Lugar de garagem" },
    { key: "garden", label: "Jardim" },
    { key: "pool", label: "Piscina" },
    { key: "storage", label: "Arrecadação" },
    { key: "adapted_house", label: "Casa adaptada" },
    { key: "luxury_house", label: "Casa de luxo" },
    { key: "sea_view", label: "Vista mar" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" className="mb-4" onClick={() => window.history.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>

        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-muted-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              {property.location}, {property.city}
            </p>
          </div>
          <p className="text-3xl font-bold">{property.price.toLocaleString("pt-PT")}€</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="relative aspect-video mb-4 rounded-lg overflow-hidden">
              {property.images && property.images.length > 0 ? (
                <>
                  <img
                    src={property.images[currentImageIndex]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded">
                    {currentImageIndex + 1}/{property.images.length}
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <Button size="icon" variant="secondary">
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="secondary">
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  Sem imagem
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-6 overflow-x-auto">
              <Button variant="outline">44 Fotos</Button>
              {property.virtual_tour_url && <Button variant="outline">Vista 3D</Button>}
              {property.video_url && <Button variant="outline">Vídeo</Button>}
              {property.floor_plan_url && <Button variant="outline">Planta</Button>}
            </div>

            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
            </Card>

            <Card className="p-6 mb-6">
              <h2 className="text-2xl font-bold mb-6">Informações</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Áreas</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.private_area && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">{property.private_area} m²</p>
                      <p className="text-sm text-muted-foreground">Área Bruta Privativa</p>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <p className="text-2xl font-bold">{property.construction_area} m²</p>
                      <p className="text-sm text-muted-foreground">Área Bruta de Construção</p>
                    </div>
                  )}
                </div>
              </div>

              {property.divisions && Array.isArray(property.divisions) && property.divisions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Divisões</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {property.divisions.map((division: any, index: number) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{division.name}</span>
                        <span className="text-muted-foreground">{division.area}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Características</h3>
                <div className="flex flex-wrap gap-2">
                  {features
                    .filter((f) => property[f.key as keyof typeof property])
                    .map((f) => (
                      <Badge key={f.key} variant="secondary">
                        {f.label}
                      </Badge>
                    ))}
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-4">
              <h3 className="text-xl font-bold mb-4">Deseja saber mais?</h3>
              <form className="space-y-4">
                <Input type="email" placeholder="Email *" />
                <Input type="text" placeholder="Nome *" />
                <Input type="tel" placeholder="Telefone *" />
                <Textarea placeholder="Mensagem" rows={4} />
                <Button className="w-full" type="submit">
                  <Mail className="w-4 h-4 mr-2" />
                  Contacte-nos
                </Button>
              </form>
              <p className="text-xs text-muted-foreground mt-4">
                Ao pedir informações está a prestar o seu consentimento para ser contactado sobre este pedido.
              </p>
            </Card>
          </div>
        </div>

        <div className="flex gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Bed className="w-5 h-5 text-muted-foreground" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath className="w-5 h-5 text-muted-foreground" />
            <span>{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Maximize className="w-5 h-5 text-muted-foreground" />
            <span>{property.private_area} m²</span>
          </div>
          {property.floor && (
            <div className="flex items-center gap-2">
              <Mountain className="w-5 h-5 text-muted-foreground" />
              <span>{property.floor}º andar</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
