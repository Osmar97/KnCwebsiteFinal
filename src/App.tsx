
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import OurApproach from "./pages/OurApproach";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import Booking from "./pages/Booking";
import BookingForm from "./pages/BookingForm";
import NotFound from "./pages/NotFound";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import { ArticleView } from "./components/resources/ArticleView";
import { AdminProvider } from "./contexts/AdminContext";
import { PostsProvider } from "./contexts/PostsContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <PostsProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/our-approach" element={<OurApproach />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/resources/:category/:id" element={<ArticleView />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-form" element={<BookingForm />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PostsProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
