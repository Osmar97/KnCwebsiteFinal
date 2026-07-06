import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AdminPageMeta } from "@/contexts/AdminPageMetaContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CompanyInfo {
  id: string;
  company_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  address: string | null;
}

const useCompanyInfo = () =>
  useQuery({
    queryKey: ["site-company-info"],
    queryFn: async (): Promise<CompanyInfo | null> => {
      const { data, error } = await supabase
        .from("site_company_info")
        .select("id, company_name, email, phone, whatsapp, address")
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data as CompanyInfo | null;
    },
  });

const AdminCompanyInfo = () => {
  const { data, isLoading } = useCompanyInfo();
  const qc = useQueryClient();
  const [form, setForm] = useState<Partial<CompanyInfo>>({});

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  const save = useMutation({
    mutationFn: async () => {
      if (!data?.id) {
        const { error } = await supabase.from("site_company_info").insert({
          company_name: form.company_name ?? null,
          email: form.email ?? null,
          phone: form.phone ?? null,
          whatsapp: form.whatsapp ?? null,
          address: form.address ?? null,
        });
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("site_company_info")
          .update({
            company_name: form.company_name ?? null,
            email: form.email ?? null,
            phone: form.phone ?? null,
            whatsapp: form.whatsapp ?? null,
            address: form.address ?? null,
          })
          .eq("id", data.id);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast.success("Company info saved");
      qc.invalidateQueries({ queryKey: ["site-company-info"] });
    },
    onError: (e: any) => toast.error(e?.message ?? "Save failed"),
  });

  const field = (key: keyof CompanyInfo, label: string, type = "text", placeholder = "") => (
    <label className="block">
      <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">{label}</span>
      <input
        type={type}
        placeholder={placeholder}
        value={(form[key] as string) ?? ""}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
        className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500 min-h-[40px]"
      />
    </label>
  );

  return (
    <>
      <AdminPageMeta title="Company Information" description="Public contact details used across the site." />
      {isLoading ? (
        <p className="text-gray-400">Loading…</p>
      ) : (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            save.mutate();
          }}
          className="bg-gray-950 border border-gray-800 rounded-lg p-4 sm:p-6 max-w-2xl"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("company_name", "Company Name", "text", "Kings 'n Company")}
            {field("email", "Email", "email", "hello@example.com")}
            {field("phone", "Phone", "tel", "+351 ...")}
            {field("whatsapp", "WhatsApp", "tel", "+351 ...")}
            <div className="sm:col-span-2">
              <label className="block">
                <span className="block text-xs uppercase tracking-wider text-gray-400 mb-1">Address</span>
                <textarea
                  rows={3}
                  value={form.address ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  className="w-full bg-gray-950 border border-gray-800 rounded-md px-3 py-2 text-sm text-white placeholder-gray-500"
                />
              </label>
            </div>
          </div>
          <div className="mt-5">
            <button
              type="submit"
              disabled={save.isPending}
              className="px-5 py-2.5 rounded-md bg-gold text-black text-sm font-medium hover:bg-gold-dark disabled:opacity-60 min-h-[44px]"
            >
              {save.isPending ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      )}
    </>
  );
};

export default AdminCompanyInfo;