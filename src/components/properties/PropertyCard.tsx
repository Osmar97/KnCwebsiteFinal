import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone, Mail, Bed, Bath, Maximize } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PropertyCardProps {
  property: any;
}

export function PropertyCard({ property }: PropertyCardProps) {
  const navigate = useNavigate();

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          className="relative aspect-video md:aspect-square"
          onClick={() => navigate(`/properties/${property.id}`)}
        >
          {property.images && property.images.length > 0 ? (
            <>
              <img
                src={property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                1/{property.images.length}
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              Sem imagem
            </div>
          )}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Heart className="w-4 h-4" />
          </Button>
        </div>

        <div className="md:col-span-2 p-4">
          <div
            className="mb-2"
            onClick={() => navigate(`/properties/${property.id}`)}
          >
            <h3 className="text-xl font-bold hover:text-primary transition-colors">
              {property.title}
            </h3>
            <p className="text-sm text-muted-foreground">{property.location}, {property.city}</p>
          </div>

          <div className="flex flex-wrap gap-4 mb-3 text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4 text-muted-foreground" />
                <span>{property.bedrooms}</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4 text-muted-foreground" />
                <span>{property.bathrooms}</span>
              </div>
            )}
            {property.private_area && (
              <div className="flex items-center gap-1">
                <Maximize className="w-4 h-4 text-muted-foreground" />
                <span>{property.private_area} m²</span>
              </div>
            )}
            {property.floor && (
              <span className="text-muted-foreground">
                {property.floor}º andar
                {property.elevator && " com elevador"}
              </span>
            )}
          </div>

          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {property.description}
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {property.sea_view && <Badge variant="secondary">Vista mar</Badge>}
            {property.luxury_house && <Badge variant="secondary">Luminoso</Badge>}
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">{property.price.toLocaleString("pt-PT")} €</p>
              {property.price !== property.price && (
                <p className="text-sm text-muted-foreground line-through">
                  {property.price.toLocaleString("pt-PT")} €
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4 mr-2" />
                Ver telefone
              </Button>
              <Button variant="outline" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contactar
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
