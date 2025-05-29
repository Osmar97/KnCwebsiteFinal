
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  name: string;
  title: string;
  email: string;
}

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_CREDENTIALS = {
  email: 'ismael@kingsncompany.com',
  password: 'admin',
  name: 'Ismael Gomes Queta',
  title: 'Founder'
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);

  useEffect(() => {
    const savedSession = localStorage.getItem('adminSession');
    if (savedSession) {
      setIsAdminLoggedIn(true);
      setAdminUser({
        name: ADMIN_CREDENTIALS.name,
        title: ADMIN_CREDENTIALS.title,
        email: ADMIN_CREDENTIALS.email
      });
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      setIsAdminLoggedIn(true);
      setAdminUser({
        name: ADMIN_CREDENTIALS.name,
        title: ADMIN_CREDENTIALS.title,
        email: ADMIN_CREDENTIALS.email
      });
      localStorage.setItem('adminSession', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('adminSession');
  };

  return (
    <AdminContext.Provider value={{ isAdminLoggedIn, adminUser, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
