import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

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

const ADMIN_CREDENTIALS = {
  email: "ismael@kingsncompany.com",
  password: "Myqdeq-zejka7-sirjyf",
  name: "Ismael Gomes Queta",
  title: "Founder & CEO"
};

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
        // Check if this user is the admin
        if (session.user.email === ADMIN_CREDENTIALS.email) {
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: session.user.id,
            email: session.user.email,
            name: ADMIN_CREDENTIALS.name,
            title: ADMIN_CREDENTIALS.title
          });
        }
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setSupabaseUser(session.user);
        if (session.user.email === ADMIN_CREDENTIALS.email) {
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: session.user.id,
            email: session.user.email,
            name: ADMIN_CREDENTIALS.name,
            title: ADMIN_CREDENTIALS.title
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

    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      try {
        // Try to sign in with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) {
          // If sign in fails, try to sign up (in case the user doesn't exist)
          const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
              emailRedirectTo: `${window.location.origin}/`
            }
          });

          if (signUpError) {
            console.error("Auth error:", signUpError);
            setLoginAttempts(prev => prev + 1);
            if (loginAttempts + 1 >= MAX_ATTEMPTS) {
              setLockoutTime(Date.now() + LOCKOUT_DURATION);
            }
            return false;
          }

          if (signUpData.user) {
            setSupabaseUser(signUpData.user);
            setIsAdminLoggedIn(true);
            setAdminUser({
              id: signUpData.user.id,
              email: signUpData.user.email!,
              name: ADMIN_CREDENTIALS.name,
              title: ADMIN_CREDENTIALS.title
            });
            setLoginAttempts(0);
            return true;
          }
        } else if (data.user) {
          setSupabaseUser(data.user);
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: data.user.id,
            email: data.user.email!,
            name: ADMIN_CREDENTIALS.name,
            title: ADMIN_CREDENTIALS.title
          });
          setLoginAttempts(0);
          return true;
        }
      } catch (error) {
        console.error("Login error:", error);
      }
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
