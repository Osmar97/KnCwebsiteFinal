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

  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  const images = property.images || [];
  const divisions = property.divisions as any[] || [];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 mt-16 sm:mt-20">
        <Link to="/properties">
          <Button variant="ghost" className="mb-4 touch-manipulation">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </Link>

        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0 mb-4 sm:mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2">{property.title}</h1>
            <p className="text-sm sm:text-base text-muted-foreground">{property.location}, {property.city}</p>
          </div>
          <div className="text-left sm:text-right">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary">{property.price.toLocaleString("pt-PT")}€</div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.private_area}m² area</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Floor {property.floor} {property.elevator ? "with lift" : "without lift"}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <Button
            variant={activeTab === "photos" ? "default" : "ghost"}
            onClick={() => setActiveTab("photos")}
            className="rounded-b-none whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0"
          >
            <ImageIcon className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            {images.length} Photos
          </Button>
          {property.virtual_tour_url && (
            <Button
              variant={activeTab === "tour" ? "default" : "ghost"}
              onClick={() => setActiveTab("tour")}
              className="rounded-b-none whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0"
            >
              3D View
            </Button>
          )}
          {property.video_url && (
            <Button
              variant={activeTab === "video" ? "default" : "ghost"}
              onClick={() => setActiveTab("video")}
              className="rounded-b-none whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0"
            >
              <Video className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              Video
            </Button>
          )}
          {property.floor_plan_url && (
            <Button
              variant={activeTab === "plan" ? "default" : "ghost"}
              onClick={() => setActiveTab("plan")}
              className="rounded-b-none whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0"
            >
              Floor Plan
            </Button>
          )}
          <Button variant="ghost" className="ml-auto rounded-b-none whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0 hidden lg:flex">
            <Heart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Favourites
          </Button>
          <Button className="rounded-b-none bg-primary whitespace-nowrap text-xs sm:text-sm touch-manipulation flex-shrink-0">
            Contact us
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {activeTab === "photos" && images.length > 0 && (
              <div className="mb-6 sm:mb-8">
                <img
                  src={images[currentImageIndex]}
                  alt={property.title}
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-3 sm:mb-4"
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${property.title} ${idx + 1}`}
                      className={`h-16 sm:h-20 object-cover rounded cursor-pointer touch-manipulation ${
                        idx === currentImageIndex ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setCurrentImageIndex(idx)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Description</h2>
              <p className="text-sm sm:text-base text-muted-foreground whitespace-pre-wrap">{property.description}</p>
            </div>

            <Separator className="my-6 sm:my-8" />

            {/* Information */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">Information</h2>
              
              {/* Areas */}
              <div className="mb-4 sm:mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Areas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {property.private_area && (
                    <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold">{property.private_area}m²</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Gross Private Area</div>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-muted p-3 sm:p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold">{property.construction_area}m²</div>
                      <div className="text-xs sm:text-sm text-muted-foreground">Gross Construction Area</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisions */}
              {divisions.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Rooms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
                    {divisions.map((division: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b py-2">
                        <span className="text-xs sm:text-sm">{division.name}</span>
                        <span className="text-xs sm:text-sm text-muted-foreground">{division.area}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {property.air_conditioning && <div className="text-xs sm:text-sm">✓ Air conditioning</div>}
                  {property.built_in_wardrobes && <div className="text-xs sm:text-sm">✓ Built-in wardrobes</div>}
                  {property.elevator && <div className="text-xs sm:text-sm">✓ Lift</div>}
                  {property.balcony_terrace && <div className="text-xs sm:text-sm">✓ Balcony & terrace</div>}
                  {property.parking && <div className="text-xs sm:text-sm">✓ Parking space</div>}
                  {property.garden && <div className="text-xs sm:text-sm">✓ Garden</div>}
                  {property.pool && <div className="text-xs sm:text-sm">✓ Swimming pool</div>}
                  {property.storage && <div className="text-xs sm:text-sm">✓ Storage room</div>}
                  {property.adapted_house && <div className="text-xs sm:text-sm">✓ Adapted house</div>}
                  {property.sea_view && <div className="text-xs sm:text-sm">✓ Sea view</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Would you like to know more?</h3>
              
              <form className="space-y-3 sm:space-y-4">
                <Input type="email" placeholder="Email *" required className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation" />
                <Input type="text" placeholder="Name *" required className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation" />
                <Input type="tel" placeholder="Phone *" required className="h-10 sm:h-11 text-sm sm:text-base touch-manipulation" />
                <Textarea placeholder="Message" rows={4} className="text-sm sm:text-base touch-manipulation" />
                <Button className="w-full bg-primary h-10 sm:h-11 text-sm sm:text-base touch-manipulation">Contact us</Button>
              </form>

              <p className="text-xs text-muted-foreground mt-3 sm:mt-4">
                By requesting information, you agree to our Privacy Policy and Terms of Service.
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
