
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
      console.log("Checking authentication status...");
      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("Session check result:", { session: !!session, error, userEmail: session?.user?.email });
      
      if (session?.user) {
        setSupabaseUser(session.user);
        // Check if this user is the admin
        if (session.user.email === ADMIN_CREDENTIALS.email) {
          console.log("Admin user detected, setting admin state");
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
      console.log("Auth state change:", { event, session: !!session, userEmail: session?.user?.email });
      
      if (session?.user) {
        setSupabaseUser(session.user);
        if (session.user.email === ADMIN_CREDENTIALS.email) {
          console.log("Admin authenticated via auth state change");
          setIsAdminLoggedIn(true);
          setAdminUser({
            id: session.user.id,
            email: session.user.email,
            name: ADMIN_CREDENTIALS.name,
            title: ADMIN_CREDENTIALS.title
          });
        }
      } else {
        console.log("No session, clearing admin state");
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

    console.log("Attempting admin login with:", { email });

    // Check credentials first
    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      console.log("Invalid admin credentials provided");
      setLoginAttempts(prev => prev + 1);
      if (loginAttempts + 1 >= MAX_ATTEMPTS) {
        setLockoutTime(Date.now() + LOCKOUT_DURATION);
      }
      return false;
    }

    try {
      console.log("Credentials valid, attempting Supabase authentication...");
      
      // First try to sign in
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      console.log("Sign in attempt:", { 
        success: !!signInData?.user, 
        error: signInError?.message,
        user: !!signInData?.user 
      });

      if (signInData?.user && !signInError) {
        console.log("Sign in successful");
        setSupabaseUser(signInData.user);
        setIsAdminLoggedIn(true);
        setAdminUser({
          id: signInData.user.id,
          email: signInData.user.email!,
          name: ADMIN_CREDENTIALS.name,
          title: ADMIN_CREDENTIALS.title
        });
        setLoginAttempts(0);
        return true;
      }

      // If sign in fails due to user not found or email not confirmed, try sign up
      if (signInError && (
        signInError.message.includes('Invalid login credentials') || 
        signInError.message.includes('Email not confirmed')
      )) {
        console.log("Sign in failed, attempting sign up...");
        
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

        console.log("Sign up attempt:", { 
          success: !!signUpData?.user, 
          error: signUpError?.message,
          needsConfirmation: signUpData?.user && !signUpData?.user?.email_confirmed_at
        });

        if (signUpData?.user && !signUpError) {
          // For admin, we'll allow login even without email confirmation
          console.log("Sign up successful, logging in admin without email confirmation");
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
      }

      console.error("Both sign in and sign up failed");
      
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
    console.log("Logging out...");
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
