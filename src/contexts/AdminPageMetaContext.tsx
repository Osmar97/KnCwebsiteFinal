import { createContext, useContext, useState, useCallback, useEffect, useMemo, type ReactNode } from "react";

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
  const setMeta = useCallback((m: AdminPageMeta) => {
    setMetaState((current) =>
      current.title === m.title && current.description === m.description ? current : m,
    );
  }, []);
  const value = useMemo(() => ({ meta, setMeta }), [meta, setMeta]);

  return (
    <AdminPageMetaContext.Provider value={value}>
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

  useEffect(() => {
    setMeta({ title, description });
  }, [description, setMeta, title]);

  return null;
}
