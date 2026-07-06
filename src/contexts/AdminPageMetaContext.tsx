import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AdminPageMeta {
  title: string;
  description?: string;
}

interface AdminPageMetaContextValue {
  meta: AdminPageMeta;
  setMeta: (meta: AdminPageMeta) => void;
}

const AdminPageMetaContext = createContext<AdminPageMetaContextValue | null>(null);

export function AdminPageMetaProvider({ children }: { children: ReactNode }) {
  const [meta, setMetaState] = useState<AdminPageMeta>({ title: "Admin" });
  const setMeta = useCallback((m: AdminPageMeta) => setMetaState(m), []);
  return (
    <AdminPageMetaContext.Provider value={{ meta, setMeta }}>
      {children}
    </AdminPageMetaContext.Provider>
  );
}

export function useAdminPageMeta() {
  const ctx = useContext(AdminPageMetaContext);
  if (!ctx) throw new Error("useAdminPageMeta must be used within AdminPageMetaProvider");
  return ctx;
}

export function AdminPageMeta({ title, description }: AdminPageMeta) {
  const { setMeta } = useAdminPageMeta();
  // Set meta on render (like document.title effect but synchronous)
  setMeta({ title, description });
  return null;
}
