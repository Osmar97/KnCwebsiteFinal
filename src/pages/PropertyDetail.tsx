import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Video, Image as ImageIcon, Home, Pencil, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
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

  const deleteMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const { error } = await supabase.from("properties" as any).delete().eq("id", propertyId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Property deleted successfully" });
      navigate("/properties");
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteMutation.mutate(id!);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/properties?edit=${id}`);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  const images = property.images || [];
  const divisions = property.divisions as any[] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 pt-28 pb-8">
        <div className="flex justify-between items-center mb-4">
          <Link to="/properties">
            <Button variant="ghost" className="text-gold hover:text-gold-light hover:bg-gold/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          {isAdminLoggedIn && (
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="border-gold text-gold hover:bg-gold/10"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDelete}
                className="border-red-500 text-red-500 hover:bg-red-500/10"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-gold">{property.title}</h1>
            <p className="text-gray-400">{property.location}, {property.city}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-gold">{property.price.toLocaleString("pt-PT")}€</div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex gap-4 mb-6 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gold" />
            <span>{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.private_area}m² gross area</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.floor}º floor {property.elevator ? "with lift" : "without lift"}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-800">
          <Button
            variant={activeTab === "photos" ? "default" : "ghost"}
            onClick={() => setActiveTab("photos")}
            className={`rounded-b-none ${activeTab === "photos" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {images.length} Photos
          </Button>
          {property.virtual_tour_url && (
            <Button
              variant={activeTab === "tour" ? "default" : "ghost"}
              onClick={() => setActiveTab("tour")}
              className={`rounded-b-none ${activeTab === "tour" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              3D View
            </Button>
          )}
          {property.video_url && (
            <Button
              variant={activeTab === "video" ? "default" : "ghost"}
              onClick={() => setActiveTab("video")}
              className={`rounded-b-none ${activeTab === "video" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          )}
          {property.floor_plan_url && (
            <Button
              variant={activeTab === "plan" ? "default" : "ghost"}
              onClick={() => setActiveTab("plan")}
              className={`rounded-b-none ${activeTab === "plan" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              Floor Plan
            </Button>
          )}
          <Button variant="ghost" className="ml-auto rounded-b-none text-gray-400 hover:text-gold hover:bg-gold/10">
            <Heart className="w-4 h-4 mr-2" />
            Favourites
          </Button>
          <Button className="rounded-b-none bg-gold text-black hover:bg-gold-light">
            Contact us
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
              <h2 className="text-2xl font-bold mb-4 text-gold">Description</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{property.description}</p>
            </div>

            <Separator className="my-8 bg-gray-800" />

            {/* Information */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-6 text-gold">Information</h2>
              
              {/* Areas */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Areas</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.private_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gold">{property.private_area}m²</div>
                      <div className="text-sm text-gray-400">Gross Private Area</div>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-gold">{property.construction_area}m²</div>
                      <div className="text-sm text-gray-400">Gross Construction Area</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisions */}
              {divisions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4 text-white">Rooms</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {divisions.map((division: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-800 py-2">
                        <span className="text-sm text-gray-300">{division.name}</span>
                        <span className="text-sm text-gray-400">{division.area}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-xl font-semibold mb-4 text-white">Features</h3>
                <div className="grid grid-cols-2 gap-2 text-gray-300">
                  {property.air_conditioning && <div className="text-sm">✓ Air conditioning</div>}
                  {property.built_in_wardrobes && <div className="text-sm">✓ Built-in wardrobes</div>}
                  {property.elevator && <div className="text-sm">✓ Lift</div>}
                  {property.balcony_terrace && <div className="text-sm">✓ Balcony & terrace</div>}
                  {property.parking && <div className="text-sm">✓ Parking space</div>}
                  {property.garden && <div className="text-sm">✓ Garden</div>}
                  {property.pool && <div className="text-sm">✓ Swimming pool</div>}
                  {property.storage && <div className="text-sm">✓ Storage room</div>}
                  {property.adapted_house && <div className="text-sm">✓ Adapted house</div>}
                  {property.sea_view && <div className="text-sm">✓ Sea view</div>}
                </div>
              </div>
            </div>
          </div>

          {/* Contact Sidebar */}
          <div className="col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4 text-gold">Would you like to know more?</h3>
              
              <form className="space-y-4">
                <Input type="email" placeholder="Email *" required className="bg-black border-gray-800 text-white placeholder:text-gray-500" />
                <Input type="text" placeholder="Name *" required className="bg-black border-gray-800 text-white placeholder:text-gray-500" />
                <Input type="tel" placeholder="Phone *" required className="bg-black border-gray-800 text-white placeholder:text-gray-500" />
                <Textarea placeholder="Message" rows={4} className="bg-black border-gray-800 text-white placeholder:text-gray-500" />
                <Button className="w-full bg-gold text-black hover:bg-gold-light">Contact us</Button>
              </form>

              <p className="text-xs text-gray-500 mt-4">
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
