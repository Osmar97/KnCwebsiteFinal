import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Video, Image as ImageIcon, Home } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";

const PropertyDetail = () => {
  const { id } = useParams();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("photos");

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("properties" as any)
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data as any;
    },
  });

  if (isLoading) return <div>Carregando...</div>;
  if (!property) return <div>Imóvel não encontrado</div>;

  const images = property.images || [];
  const divisions = property.divisions as any[] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 mt-20">
        <Link to="/properties">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </Link>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
            <p className="text-muted-foreground">{property.location}, {property.city}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-primary">{property.price.toLocaleString("pt-PT")}€</div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.private_area}m² área bruta</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.floor}º andar {property.elevator ? "com elevador" : "sem elevador"}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <Button
            variant={activeTab === "photos" ? "default" : "ghost"}
            onClick={() => setActiveTab("photos")}
            className="rounded-b-none"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {images.length} Fotos
          </Button>
          {property.virtual_tour_url && (
            <Button
              variant={activeTab === "tour" ? "default" : "ghost"}
              onClick={() => setActiveTab("tour")}
              className="rounded-b-none"
            >
              Vista 3D
            </Button>
          )}
          {property.video_url && (
            <Button
              variant={activeTab === "video" ? "default" : "ghost"}
              onClick={() => setActiveTab("video")}
              className="rounded-b-none"
            >
              <Video className="w-4 h-4 mr-2" />
              Vídeo
            </Button>
          )}
          {property.floor_plan_url && (
            <Button
              variant={activeTab === "plan" ? "default" : "ghost"}
              onClick={() => setActiveTab("plan")}
              className="rounded-b-none"
            >
              Planta
            </Button>
          )}
          <Button variant="ghost" className="ml-auto rounded-b-none">
            <Heart className="w-4 h-4 mr-2" />
            Favoritos
          </Button>
          <Button className="rounded-b-none bg-primary">
            Contacte-nos
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="col-span-2">
            {/* Image Gallery */}
            {activeTab === "photos" && images.length > 0 && (
              <div className="mb-8">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-6 gap-2">
                  {images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${property.title} ${idx + 1}`}
                      className={`h-20 object-cover rounded cursor-pointer ${
                        idx === currentImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Descrição</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{property.description}</p>
            </div>

            <Separator className="my-8" />

            {/* Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Informações</h2>
              
              {/* Áreas */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Áreas</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.private_area && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{property.private_area}m²</div>
                      <div className="text-sm text-muted-foreground">Área Bruta Privativa</div>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-muted p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold">{property.construction_area}m²</div>
                      <div className="text-sm text-muted-foreground">Área Bruta de Construção</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisions */}
              {divisions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">Divisões</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {divisions.map((division: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b py-2">
                        <span className="text-sm">{division.name}</span>
                        <span className="text-sm text-muted-foreground">{division.area}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Características */}
              <div>
                <h3 className="text-xl font-semibold mb-4">Características</h3>
                <div className="grid grid-cols-2 gap-2">
                  {property.air_conditioning && <div className="text-sm">✓ Ar condicionado</div>}
                  {property.built_in_wardrobes && <div className="text-sm">✓ Armários embutidos</div>}
                  {property.elevator && <div className="text-sm">✓ Elevador</div>}
                  {property.balcony_terrace && <div className="text-sm">✓ Varanda e terraço</div>}
                  {property.parking && <div className="text-sm">✓ Lugar de garagem</div>}
                  {property.garden && <div className="text-sm">✓ Jardim</div>}
                  {property.pool && <div className="text-sm">✓ Piscina</div>}
                  {property.storage && <div className="text-sm">✓ Arrecadação</div>}
                  {property.adapted_house && <div className="text-sm">✓ Casa adaptada</div>}
                  {property.sea_view && <div className="text-sm">✓ Vista mar</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="col-span-1">
            <div className="bg-card border rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Deseja saber mais?</h3>
              
              <form className="space-y-4">
                <Input type="email" placeholder="Email *" required />
                <Input type="text" placeholder="Nome *" required />
                <Input type="tel" placeholder="Telefone *" required />
                <Textarea placeholder="Mensagem" rows={4} />
                <Button className="w-full bg-primary">Contacte-nos</Button>
              </form>

              <p className="text-xs text-muted-foreground mt-4">
                Ao pedir informações está a aceitar nossa Política de Privacidade e Termos de Serviço.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
