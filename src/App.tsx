
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
import FreeResources from "./pages/FreeResources";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AdminProperties from "./pages/AdminProperties";
import AdminAssets from "./pages/AdminAssets";
import TourPage from "./pages/Tour";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 1. Reduce excessive API calls by caching data
      staleTime: 1000 * 60 * 5, // Data remains "fresh" for 5 minutes
      gcTime: 1000 * 60 * 30, // Keep in cache for 30 minutes
      
      // 2. Avoid unnecessary re-renders/refetches
      refetchOnWindowFocus: false, // Don't refetch when user switches tabs
      refetchOnReconnect: 'always',
      
      // 3. Handle 429 responses with exponential backoff
      retry: (failureCount, error: any) => {
        // Only retry if it's a rate limit error (429) or network error
        const status = error?.status || error?.response?.status;
        if (status === 429 && failureCount < 3) return true;
        return false;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // 1s, 2s, 4s... max 30s
    },
  },
});

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
              <Route path="/free-resources" element={<FreeResources />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/admin/properties" element={<AdminProperties />} />
              <Route path="/admin/assets" element={<AdminAssets />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-form" element={<BookingForm />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/tour" element={<TourPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </PostsProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
