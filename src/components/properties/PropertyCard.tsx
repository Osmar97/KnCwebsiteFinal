import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { formatPrice, CONTACT_PHONE, CONTACT_PHONE_LINK } from "@/lib/formatters";
import { useToast } from "@/hooks/use-toast";

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showPhone, setShowPhone] = useState(false);
  const images = property.images || [];

  // Preload adjacent images for instant navigation
  useEffect(() => {
    if (images.length <= 1) return;
    
    const preloadImage = (index: number) => {
      const img = new Image();
      img.src = images[index];
    };
    
    // Preload next image
    const nextIndex = (currentImageIndex + 1) % images.length;
    preloadImage(nextIndex);
    
    // Preload previous image
    const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
    preloadImage(prevIndex);
  }, [currentImageIndex, images]);

  const handleViewPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPhone(true);
    toast({
      title: "Contact Number",
      description: CONTACT_PHONE,
    });
  };

  const handleContact = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    window.location.href = CONTACT_PHONE_LINK;
  };

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
    <div
      className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer group"
      onClick={() => navigate(`/properties/${property.id}`)}
    >
      <div className="flex flex-col lg:flex-row">
        {/* Image Gallery */}
        <div className="relative w-full lg:w-96 h-64 sm:h-72 lg:h-80 flex-shrink-0 overflow-hidden">
          {images.length > 0 ? (
            <>
              <img
                src={images[currentImageIndex]}
                alt={property.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full shadow-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 sm:p-2.5 rounded-full shadow-lg transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/80 text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col min-w-0">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-3">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary group-hover:text-gold transition-colors line-clamp-2 break-words">
              {property.title}
            </h3>
            <div className="text-left sm:text-right w-full sm:w-auto flex-shrink-0">
              <div className="text-2xl sm:text-2xl font-bold text-gold">
                {formatPrice(property.price)} €
              </div>
            </div>
          </div>

          <p className="text-gray-600 mb-4 flex items-center gap-1.5 break-words">
            <span className="text-gold text-lg flex-shrink-0">📍</span>
            <span className="font-medium">{property.location}</span>
          </p>

          <div className="flex flex-wrap gap-4 sm:gap-6 mb-4 text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold text-base">{property.bedrooms}</span>
                <span className="text-gray-500">bedrooms</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{property.bathrooms}</span>
                <span className="text-gray-500">bathrooms</span>
              </div>
            )}
            {property.private_area && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{property.private_area}m²</span>
              </div>
            )}
          </div>

          {property.construction_area && (
            <p className="text-sm text-gray-500 mb-2">Gross area: {property.construction_area}m²</p>
          )}

          {property.floor !== undefined && property.floor !== null && (
            <p className="text-sm text-gray-500 mb-4">
              Floor {property.floor} {property.elevator ? "with" : "without"} lift
            </p>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 sm:line-clamp-3 mb-4 flex-grow break-words">
            {property.description}
          </p>

          {/* Features Badges - Show up to 5 most important */}
          <div className="flex flex-wrap gap-2 mb-4 sm:mb-5">
            {(() => {
              const features = [
                { key: 'sea_view', label: 'Sea view', priority: 1 },
                { key: 'luxury_house', label: 'Luxury', priority: 2 },
                { key: 'pool', label: 'Pool', priority: 3 },
                { key: 'parking', label: 'Parking', priority: 4 },
                { key: 'balcony_terrace', label: 'Balcony/Terrace', priority: 5 },
                { key: 'garden', label: 'Garden', priority: 6 },
                { key: 'air_conditioning', label: 'AC', priority: 7 },
                { key: 'built_in_wardrobes', label: 'Wardrobes', priority: 8 },
                { key: 'elevator', label: 'Elevator', priority: 9 },
                { key: 'storage', label: 'Storage', priority: 10 },
              ];

              return features
                .filter(f => property[f.key])
                .slice(0, 5)
                .map(f => (
                  <span key={f.key} className="px-2.5 sm:px-3 py-1 bg-gold/10 text-gold text-xs rounded-full font-medium border border-gold/20">
                    {f.label}
                  </span>
                ));
            })()}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <Button
              className="flex-1 bg-gold hover:bg-gold-dark text-white min-h-[44px]"
              onClick={handleContact}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gold text-gold hover:bg-gold hover:text-white min-h-[44px]"
              onClick={handleViewPhone}
            >
              {showPhone ? CONTACT_PHONE : "View phone"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
