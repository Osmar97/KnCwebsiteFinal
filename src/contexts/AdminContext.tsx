import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { ADMIN_PROFILES, findAdminProfile } from "@/lib/adminConfig";

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

// Shared password for the admin allowlist. Real auth happens against Supabase
// after this gate — the password just prevents accidental access to the sign-up
// flow below. Rotate by changing both this value and the Supabase user password.
const SHARED_ADMIN_PASSWORD = "Myqdeq-zejka7-sirjyf";

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
      const { data: { session } } = await supabase.auth.getSession();
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

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
    if (!profile || password !== SHARED_ADMIN_PASSWORD) {
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
      }
      return false;
    }

    try {
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

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

      // If sign in fails due to user not found or email not confirmed, try sign up
      if (signInError && (
        signInError.message.includes('Invalid login credentials') || 
        signInError.message.includes('Email not confirmed')
      )) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              confirmed_at: new Date().toISOString() // Try to auto-confirm
            }
          }
        });

        if (signUpData?.user && !signUpError) {
          setSupabaseUser(signUpData.user);
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: signUpData.user.id,
            email: signUpData.user.email!,
            name: profile.name,
            title: profile.title,
          });
          setLoginAttempts(0);
          return true;
        }
      }
    } catch (error) {
      console.error("Login error:", error);
    }

    setLoginAttempts(prev => prev + 1);
    if (loginAttempts + 1 >= MAX_ATTEMPTS) {
      setLockoutTime(Date.now() + LOCKOUT_DURATION);
    }
    return false;
  };

  const logout = async () => {
    await supabase.auth.signOut();
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
