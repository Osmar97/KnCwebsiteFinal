import AdminLayout from "@/components/admin/AdminLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AssetManager from "@/components/admin/AssetManager";

const AdminAssets = () => {
  return (
    <AdminLayout
      title="Property Assets"
      description="Upload and manage PDFs and videos used across properties."
    >
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
    </AdminLayout>
  );
};

export default AdminAssets;