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
import { formatPrice } from "@/lib/formatters";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedLang, setSelectedLang] = useState("pt");
  const [contactForm, setContactForm] = useState({
    email: "",
    name: "",
    phone: "",
    message: ""
  });
  const [isSubmittingContact, setIsSubmittingContact] = useState(false);

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

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingContact(true);

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: contactForm.name,
          email: contactForm.email,
          phone: contactForm.phone,
          subject: `Property Inquiry: ${property?.title || 'Property'}`,
          message: `Phone: ${contactForm.phone}\n\nProperty: ${property?.title}\nLocation: ${property?.location}, ${property?.city}\nPrice: ${formatPrice(property?.price || 0)}€\n\n${contactForm.message}`,
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent Successfully",
        description: "Thank you for your interest! We'll contact you soon.",
      });

      setContactForm({ email: "", name: "", phone: "", message: "" });
    } catch (error: any) {
      console.error("Error sending contact email:", error);
      toast({
        title: "Failed to Send Message",
        description: "Please try again or call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmittingContact(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (!property) return <div>Property not found</div>;

  const images = property.images || [];
  const divisions = property.divisions as any[] || [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 lg:pt-28 pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <Link to="/properties">
            <Button variant="ghost" className="text-gold hover:text-gold-light hover:bg-gold/10 min-h-[44px]">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
          
          {isAdminLoggedIn && (
            <div className="flex gap-2 w-full sm:w-auto">
              <Button 
                variant="outline" 
                onClick={handleEdit}
                className="border-gold text-gold hover:bg-gold/10 flex-1 sm:flex-initial min-h-[44px]"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="outline" 
                onClick={handleDelete}
                className="border-red-500 text-red-500 hover:bg-red-500/10 flex-1 sm:flex-initial min-h-[44px]"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-4 mb-6">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-gold break-words">{property.title}</h1>
            <p className="text-sm sm:text-base text-gray-400">{property.location}, {property.city}</p>
          </div>
          <div className="text-left lg:text-right w-full lg:w-auto">
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gold">{formatPrice(property.price)}€</div>
          </div>
        </div>

        {/* Property Stats */}
        <div className="flex flex-wrap gap-3 sm:gap-4 mb-6 text-xs sm:text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{property.property_type}</span>
          </div>
          <div className="flex items-center gap-2">
            <Home className="w-4 h-4 text-gold flex-shrink-0" />
            <span>{property.bedrooms} bedrooms</span>
          </div>
          <div className="flex items-center gap-2">
            <span>{property.private_area}m² gross area</span>
          </div>
          {property.property_type === "Apartamento" && property.floor !== null && property.floor !== undefined && (
            <div className="flex items-center gap-2">
              <span>
                {property.floor === 0 
                  ? "Ground floor" 
                  : property.floor >= 9 
                    ? "9th floor or higher"
                    : `${property.floor}${property.floor === 1 ? "st" : property.floor === 2 ? "nd" : property.floor === 3 ? "rd" : "th"} floor`}
                {property.elevator ? " • with lift" : " • without lift"}
              </span>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6 border-b border-gray-800 overflow-x-auto pb-0 scrollbar-hide">
          <Button
            variant={activeTab === "photos" ? "default" : "ghost"}
            onClick={() => setActiveTab("photos")}
            className={`rounded-b-none whitespace-nowrap min-h-[44px] flex-shrink-0 ${activeTab === "photos" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            {images.length} Photos
          </Button>
          {property.virtual_tour_url && (
            <Button
              variant={activeTab === "tour" ? "default" : "ghost"}
              onClick={() => setActiveTab("tour")}
              className={`rounded-b-none whitespace-nowrap min-h-[44px] flex-shrink-0 ${activeTab === "tour" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              3D View
            </Button>
          )}
          {property.video_url && (
            <Button
              variant={activeTab === "video" ? "default" : "ghost"}
              onClick={() => setActiveTab("video")}
              className={`rounded-b-none whitespace-nowrap min-h-[44px] flex-shrink-0 ${activeTab === "video" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              <Video className="w-4 h-4 mr-2" />
              Video
            </Button>
          )}
          {property.floor_plan_url && (
            <Button
              variant={activeTab === "plan" ? "default" : "ghost"}
              onClick={() => setActiveTab("plan")}
              className={`rounded-b-none whitespace-nowrap min-h-[44px] flex-shrink-0 ${activeTab === "plan" ? "bg-gold text-black hover:bg-gold-light" : "text-gray-400 hover:text-gold hover:bg-gold/10"}`}
            >
              Floor Plan
            </Button>
          )}
          <Button className="ml-auto rounded-b-none bg-gold text-black hover:bg-gold-light whitespace-nowrap min-h-[44px] flex-shrink-0">
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
                  className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg mb-4"
                />
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`${property.title} ${idx + 1}`}
                      className={`h-16 sm:h-20 object-cover rounded cursor-pointer ${
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
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold text-gold">Description</h2>
                {property.descriptions && typeof property.descriptions === 'object' && Object.keys(property.descriptions).length > 1 && (
                  <div className="flex gap-2">
                    {Object.keys(property.descriptions).map((lang) => (
                      <Button
                        key={lang}
                        size="sm"
                        variant={selectedLang === lang ? "default" : "outline"}
                        onClick={() => setSelectedLang(lang)}
                        className="uppercase text-gold"
                      >
                        {lang}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-sm sm:text-base text-gray-300 whitespace-pre-wrap">
                {property.descriptions && typeof property.descriptions === 'object' 
                  ? property.descriptions[selectedLang] || property.description
                  : property.description}
              </p>
            </div>

            <Separator className="my-6 sm:my-8 bg-gray-800" />

            {/* Information */}
            <div className="mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gold">Information</h2>
              
              {/* Areas */}
              <div className="mb-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Areas</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {property.private_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gold">{property.private_area}m²</div>
                      <div className="text-xs sm:text-sm text-gray-400">Gross Private Area</div>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gold">{property.construction_area}m²</div>
                      <div className="text-xs sm:text-sm text-gray-400">Gross Construction Area</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Divisions */}
              {divisions.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Rooms</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {divisions.map((division: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center border-b border-gray-800 py-2">
                        <span className="text-xs sm:text-sm text-gray-300">{division.name}</span>
                        <span className="text-xs sm:text-sm text-gray-400">{division.area}m²</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Features */}
              <div>
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-white">Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-gray-300">
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
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gold">Would you like to know more?</h3>
              
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <Input 
                  type="email" 
                  placeholder="Email *" 
                  required 
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Input 
                  type="text" 
                  placeholder="Name *" 
                  required 
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Input 
                  type="tel" 
                  placeholder="Phone *" 
                  required 
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Textarea 
                  placeholder="Message" 
                  rows={4} 
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500" 
                />
                <Button 
                  type="submit" 
                  disabled={isSubmittingContact}
                  className="w-full bg-gold text-black hover:bg-gold-light disabled:opacity-50 min-h-[44px]"
                >
                  {isSubmittingContact ? "Sending..." : "Contact us"}
                </Button>
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
