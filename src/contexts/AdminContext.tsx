import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { User } from "@supabase/supabase-js";
import { ADMIN_PROFILES, findAdminProfile } from "@/lib/adminConfig";
import { getCurrentSession, signInWithPassword, signOutCurrentUser, subscribeAuthChanges } from "@/data/adminAuth";
import { logger } from "@/lib/logger";

interface AdminUser {
  id: string;
  email: string;
  name: string;
  title: string;
}

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  supabaseUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  isLocked: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<User | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getCurrentSession();
      if (session?.user) {
        setSupabaseUser(session.user);
        const profile = findAdminProfile(session.user.email);
        if (profile) {
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            title: profile.title,
          });
        }
      }
    };

    checkAuth();

    const subscription = subscribeAuthChanges((_event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        const profile = findAdminProfile(session.user.email);
        if (profile) {
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            title: profile.title,
          });
        }
      } else {
        setSupabaseUser(null);
        setIsAdminLoggedIn(false);
        setAdminUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const isLocked = lockoutTime ? Date.now() < lockoutTime : false;

  const login = async (email: string, password: string): Promise<boolean> => {
    if (isLocked) return false;

    const profile = findAdminProfile(email);
    if (!profile) {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
      }
      return false;
    }

    try {
      const { data: signInData, error: signInError } = await signInWithPassword(email, password);

      if (signInData?.user && !signInError) {
        setSupabaseUser(signInData.user);
        setIsAdminLoggedIn(true);
        setAdminUser({
          id: signInData.user.id,
          email: signInData.user.email!,
          name: profile.name,
          title: profile.title,
        });
        setLoginAttempts(0);
        return true;
      }
    } catch (error) {
      logger.error("Login error:", error);
    }

    setLoginAttempts(prev => prev + 1);
    if (loginAttempts + 1 >= MAX_ATTEMPTS) {
      setLockoutTime(Date.now() + LOCKOUT_DURATION);
    }
    return false;
  };

  const logout = async () => {
    await signOutCurrentUser();
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    setSupabaseUser(null);
    setLoginAttempts(0);
    setLockoutTime(null);
  };

  return (
    <AdminContext.Provider value={{
      isAdminLoggedIn,
      adminUser,
      supabaseUser,
      login,
      logout,
      loginAttempts,
      isLocked
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
};
