
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { AdminPageMetaProvider } from "./contexts/AdminPageMetaContext";
import FreeResources from "./pages/FreeResources";
import InvestingInPortugalForAmericans from "./pages/InvestingInPortugalForAmericans";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminAssets from "./pages/admin/AdminAssets";
import TourPage from "./pages/Tour";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminTours from "./pages/admin/AdminTours";
import AdminBookings from "./pages/admin/AdminBookings";
import AdminWaitlist from "./pages/admin/AdminWaitlist";
import AdminQuotes from "./pages/admin/AdminQuotes";
import AdminPrivateTourSettings from "./pages/admin/AdminPrivateTourSettings";
import AdminPrivateTourDestinations from "./pages/admin/AdminPrivateTourDestinations";
import AdminPrivateTourAddons from "./pages/admin/AdminPrivateTourAddons";
import AdminPrivateTourDates from "./pages/admin/AdminPrivateTourDates";
import AdminPrivateTourIncluded from "./pages/admin/AdminPrivateTourIncluded";
import AdminWhereWeGo from "./pages/admin/AdminWhereWeGo";
import AdminSocialMedia from "./pages/admin/AdminSocialMedia";
import AdminLeadsInbox from "./pages/admin/AdminLeadsInbox";
import AdminCompanyInfo from "./pages/admin/AdminCompanyInfo";
import AdminCRM from "./pages/admin/AdminCRM";
import AdminCRMLeadDetail from "./pages/admin/AdminCRMLeadDetail";
import AdminCRMTasks from "./pages/admin/AdminCRMTasks";
import { ErrorBoundary } from "./components/ErrorBoundary";
import AdminAnalytics from "./pages/admin/AdminAnalytics";

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
          <ErrorBoundary>
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
              <Route
                path="/resources/guides/investing-in-portugal-for-americans"
                element={<InvestingInPortugalForAmericans />}
              />
              <Route path="/properties" element={<Properties />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/admin" element={<AdminPageMetaProvider><AdminLayout /></AdminPageMetaProvider>}>
                <Route index element={<AdminDashboard />} />
                <Route path="properties" element={<AdminProperties />} />
                <Route path="assets" element={<AdminAssets />} />
                <Route path="tours" element={<AdminTours />} />
                <Route path="bookings" element={<AdminBookings />} />
                <Route path="waitlist" element={<AdminWaitlist />} />
                <Route path="quotes" element={<AdminQuotes />} />
                <Route path="private-tour/settings" element={<AdminPrivateTourSettings />} />
                <Route path="private-tour/destinations" element={<AdminPrivateTourDestinations />} />
                <Route path="private-tour/addons" element={<AdminPrivateTourAddons />} />
                <Route path="private-tour/dates" element={<AdminPrivateTourDates />} />
                <Route path="private-tour/included" element={<AdminPrivateTourIncluded />} />
                <Route path="tours/where-we-go" element={<AdminWhereWeGo />} />
                <Route path="site-settings/social-media" element={<AdminSocialMedia />} />
                <Route path="site-settings/company" element={<AdminCompanyInfo />} />
                <Route path="leads" element={<AdminLeadsInbox />} />
                <Route path="crm" element={<AdminCRM />} />
                <Route path="crm/tasks" element={<AdminCRMTasks />} />
                <Route path="crm/:source/:id" element={<AdminCRMLeadDetail />} />
                <Route path="analytics" element={<AdminAnalytics />} />
              </Route>
              <Route path="/booking" element={<Booking />} />
              <Route path="/booking-form" element={<BookingForm />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              <Route path="/POT" element={<TourPage />} />
              <Route path="/tour" element={<Navigate to="/POT" replace />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
          </ErrorBoundary>
        </TooltipProvider>
      </PostsProvider>
    </AdminProvider>
  </QueryClientProvider>
);

export default App;
