import { useParams, useNavigate } from "react-router-dom";
import { useProperty, useDeleteProperty } from "@/hooks/admin/useAdminProperties";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Heart, Video, Image as ImageIcon, Home, Pencil, Trash2, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";
import { formatPrice } from "@/lib/formatters";
import { useContactForm } from "@/hooks/useContactForm";
import { PropertyImageCarousel } from "@/components/properties/PropertyImageCarousel";
import FloorPlanViewer from "@/components/properties/FloorPlanViewer";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { FullscreenGallery } from "@/components/properties/FullscreenGallery";

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdminLoggedIn } = useAdmin();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("photos");
  const [selectedLang, setSelectedLang] = useState("en");
  const [isFloorPlanModalOpen, setIsFloorPlanModalOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);
  const [phone, setPhone] = useState("");
  const {
    formData: contactForm,
    isSubmitting: isSubmittingContact,
    handleInputChange: setContactField,
    handleSubmit: submitContactForm,
  } = useContactForm();

  const { data: property, isLoading } = useProperty(id);
  const deleteMutation = useDeleteProperty({
    successTitle: "Property deleted successfully",
    onSuccess: () => navigate("/properties"),
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this property?")) {
      deleteMutation.mutate(id!);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/properties?edit=${id}`);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    // Build a property-inquiry payload that overrides `subject`/`message` so the
    // email carries the property context regardless of what's in the textarea.
    const subject = `Property Inquiry: ${property?.title || "Property"}`;
    const message = `Phone: ${phone}\n\nProperty: ${property?.title}\nLocation: ${property?.location}, ${property?.city}\nPrice: ${formatPrice(property?.price || 0)}€\n\n${contactForm.message}`;
    submitContactForm(e, () => setPhone(""), { subject, message });
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
            <span>{property.private_area}m² liveable area</span>
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

        {/* Interactive Media Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-8">
          <button
            onClick={() => {
              setGalleryStartIndex(0);
              setIsGalleryOpen(true);
            }}
            className="flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-300 min-h-[60px] border-border bg-background hover:border-gold/50 hover:bg-gold/5 text-foreground"
          >
            <ImageIcon className="w-5 h-5 flex-shrink-0" />
            <span className="font-medium">{images.length} photos</span>
          </button>

          {((property.floor_plans && property.floor_plans.length > 0) || property.floor_plan_url) && (
            <button
              onClick={() => setIsFloorPlanModalOpen(true)}
              className="flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-300 min-h-[60px] border-border bg-background hover:border-gold/50 hover:bg-gold/5 text-foreground"
            >
              <FileText className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">{property.floor_plans?.length || 1} plantas</span>
            </button>
          )}

          {property.video_url && (
            <button
              onClick={() => setActiveTab("video")}
              className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all duration-300 min-h-[60px] ${
                activeTab === "video" 
                  ? "border-gold bg-gold/10 text-gold" 
                  : "border-border bg-background hover:border-gold/50 hover:bg-gold/5 text-foreground"
              }`}
            >
              <Video className="w-5 h-5 flex-shrink-0" />
              <span className="font-medium">Vídeo</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Media Display Area with Transitions */}
            <div className="mb-8">
              {images.length > 0 && (
                <div className="animate-in fade-in-50 duration-500 cursor-pointer" onClick={() => setIsGalleryOpen(true)}>
                  <PropertyImageCarousel images={images} title={property.title} />
                </div>
              )}

              {activeTab === "video" && property.video_url && (
                <div className="animate-in fade-in-50 duration-500">
                  <div className="relative w-full pb-[56.25%] bg-black rounded-lg overflow-hidden border border-border">
                    <video
                      src={property.video_url}
                      controls
                      className="absolute top-0 left-0 w-full h-full"
                    >
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </div>
              )}
            </div>

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
                      <div className="text-xs sm:text-sm text-gray-400">Liveable Area</div>
                    </div>
                  )}
                  {property.construction_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gold">{property.construction_area}m²</div>
                      <div className="text-xs sm:text-sm text-gray-400">Gross Construction Area</div>
                    </div>
                  )}
                  {property.lot_area && (
                    <div className="bg-gray-900 border border-gray-800 p-4 rounded-lg text-center">
                      <div className="text-xl sm:text-2xl font-bold text-gold">{property.lot_area}m²</div>
                      <div className="text-xs sm:text-sm text-gray-400">Land Area</div>
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
                  onChange={(e) => setContactField("email", e.target.value)}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Input 
                  type="text" 
                  placeholder="Name *" 
                  required 
                  value={contactForm.name}
                  onChange={(e) => setContactField("name", e.target.value)}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Input 
                  type="tel" 
                  placeholder="Phone *" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-black border-gray-800 text-white placeholder:text-gray-500 min-h-[44px]" 
                />
                <Textarea 
                  placeholder="Message" 
                  rows={4} 
                  value={contactForm.message}
                  onChange={(e) => setContactField("message", e.target.value)}
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

      {/* Fullscreen Image Gallery */}
      <FullscreenGallery
        images={images}
        initialIndex={galleryStartIndex}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        title={property.title}
      />

      {/* Full-Screen Floor Plan Modal */}
      <Dialog open={isFloorPlanModalOpen} onOpenChange={setIsFloorPlanModalOpen}>
        <DialogContent className="max-w-none w-screen h-screen p-0 bg-black/95 border-none" aria-describedby="floor-plan-description">
          <DialogTitle className="sr-only">Floor Plans - {property.title}</DialogTitle>
          <DialogDescription id="floor-plan-description" className="sr-only">
            View and navigate through the floor plans for {property.title}
          </DialogDescription>
          <button
            onClick={() => setIsFloorPlanModalOpen(false)}
            className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gold/20 hover:bg-gold/30 text-gold transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="w-full h-full">
            {property.floor_plans && property.floor_plans.length > 0 ? (
              <FloorPlanViewer imageUrls={property.floor_plans} title={property.title} />
            ) : property.floor_plan_url ? (
              <FloorPlanViewer imageUrls={[property.floor_plan_url]} title={property.title} />
            ) : null}
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default PropertyDetail;
