import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Heart, Phone, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  property: any;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const navigate = useNavigate();
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
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all touch-manipulation"
                  >
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 sm:right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-1.5 sm:p-2 rounded-full shadow-lg transition-all touch-manipulation"
                  >
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 bg-black/80 text-white px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-medium">
                    {currentImageIndex + 1}/{images.length}
                  </div>
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 sm:top-3 right-2 sm:right-3 bg-white/90 hover:bg-white rounded-full w-8 h-8 sm:w-10 sm:h-10 touch-manipulation"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
              </Button>
            </>
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
        </div>

        {/* Property Info */}
        <div className="flex-1 p-4 sm:p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-0 mb-3">
            <h3 className="text-xl sm:text-2xl font-semibold text-primary group-hover:text-gold transition-colors line-clamp-2 sm:pr-4">
              {property.title}
            </h3>
            <div className="text-left sm:text-right">
              <div className="text-xl sm:text-2xl font-bold text-gold whitespace-nowrap">
                {property.price.toLocaleString("en-UK")} €
              </div>
            </div>
          </div>

          <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4 flex items-center gap-1.5">
            <span className="text-gold text-base sm:text-lg">📍</span>
            <span className="font-medium">{property.location}</span>
          </p>

          <div className="flex flex-wrap gap-3 sm:gap-6 mb-3 sm:mb-4 text-sm">
            {property.bedrooms && (
              <div className="flex items-center gap-2">
                <span className="font-bold text-gold text-base">{property.bedrooms}</span>
                <span className="text-gray-500">beds</span>
              </div>
            )}
            {property.bathrooms && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{property.bathrooms}</span>
                <span className="text-gray-500">baths</span>
              </div>
            )}
            {property.private_area && (
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{property.private_area}m²</span>
              </div>
            )}
          </div>

          {property.construction_area && (
            <p className="text-xs sm:text-sm text-gray-500 mb-2">Gross area: {property.construction_area}m²</p>
          )}

          {property.floor !== undefined && property.floor !== null && (
            <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
              Floor {property.floor} {property.elevator ? "with" : "without"} lift
            </p>
          )}

          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3 sm:mb-4 flex-grow">
            {property.description}
          </p>

          {/* Features Badges */}
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4 sm:mb-5">
            {property.sea_view && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gold/10 text-gold text-xs rounded-full font-medium border border-gold/20">
                Sea view
              </span>
            )}
            {property.luxury_house && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gold/10 text-gold text-xs rounded-full font-medium border border-gold/20">
                Luxury
              </span>
            )}
            {property.pool && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gold/10 text-gold text-xs rounded-full font-medium border border-gold/20">
                Pool
              </span>
            )}
            {property.parking && (
              <span className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gold/10 text-gold text-xs rounded-full font-medium border border-gold/20">
                Parking
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 sm:gap-3 mt-auto">
            <Button
              className="flex-1 bg-gold hover:bg-gold-dark text-white h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Phone className="w-4 h-4 mr-2" />
              Contact
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-gold text-gold hover:bg-gold hover:text-white h-10 sm:h-11 text-sm sm:text-base touch-manipulation"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              View phone
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
