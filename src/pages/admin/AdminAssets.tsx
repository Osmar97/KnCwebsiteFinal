import { Navigation } from "@/components/Navigation";
import { useAdmin } from "@/contexts/AdminContext";
import { AdminLogin } from "@/components/AdminLogin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetManager from "@/components/admin/AssetManager";
import { useScrollToTop } from "@/hooks/useScrollToTop";

const AdminAssets = () => {
  useScrollToTop();
  const { isAdminLoggedIn, supabaseUser } = useAdmin();

  if (!isAdminLoggedIn || !supabaseUser) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-center">Admin Login Required</h1>
            <p className="text-center text-muted-foreground mb-8">
              You must be logged in as an admin to manage assets.
            </p>
            <AdminLogin />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 pt-24 sm:pt-28">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gold">Property Assets</h1>
          <p className="text-gray-400 mt-1 text-sm">
            Upload and manage PDFs and videos used across properties.
          </p>
        </div>

        <Tabs defaultValue="pdfs" className="w-full">
          <TabsList className="bg-gray-900 border border-gray-800">
            <TabsTrigger value="pdfs">PDFs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="pdfs" className="mt-6">
            <AssetManager bucket="pdfs" accept=".pdf,application/pdf" maxSizeMb={100} label="PDF Documents" />
          </TabsContent>
          <TabsContent value="videos" className="mt-6">
            <AssetManager bucket="videos" accept="video/*" maxSizeMb={500} label="Videos" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminAssets;