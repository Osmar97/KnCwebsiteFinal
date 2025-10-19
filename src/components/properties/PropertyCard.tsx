import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Phone } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = property.images || [];

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <Link to={`/properties/${property.id}`}>
      <div className="bg-card border rounded-lg overflow-hidden hover:shadow-lg transition-shadow flex">
        {/* Image Gallery */}
        <div className="relative w-96 h-72 flex-shrink-0">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    ←
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                  >
                    →
                  </button>
                  <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No image</span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 p-6">
          <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-semibold text-foreground line-clamp-2">
              {property.title}
            </h3>
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </div>

          <div className="mb-4">
            <div className="text-3xl font-bold text-primary mb-1">
              {property.price.toLocaleString("pt-PT")} €
            </div>
            <div className="text-sm text-muted-foreground">
              {property.bedrooms} • {property.private_area}m² gross area • {property.floor}º floor{property.elevator ? " with lift" : " without lift"}
            </div>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
            {property.description}
          </p>

          <div className="flex gap-2 mb-4 flex-wrap">
            {property.sea_view && <Badge variant="secondary">Sea view</Badge>}
            {property.luxury_house && <Badge variant="secondary">Luxury house</Badge>}
            {property.pool && <Badge variant="secondary">Pool</Badge>}
            {property.parking && <Badge variant="secondary">Parking</Badge>}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1">
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button className="flex-1">
              View phone
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
