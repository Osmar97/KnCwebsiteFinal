
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

    console.log("Attempting login with:", { email });

    // Check credentials
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      try {
        console.log("Credentials valid, attempting Supabase authentication...");
        
        // Try to sign in with Supabase first
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        console.log("Sign in result:", { data: !!signInData, error: signInError, user: !!signInData?.user });

        if (signInData?.user && !signInError) {
          console.log("Sign in successful, setting user state");
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

        // If sign in fails, try to sign up
        console.log("Sign in failed, attempting sign up...");
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        });

        console.log("Sign up result:", { data: !!signUpData, error: signUpError, user: !!signUpData?.user });

        if (signUpError) {
          console.error("Auth error:", signUpError);
          setLoginAttempts(prev => prev + 1);
          if (loginAttempts + 1 >= MAX_ATTEMPTS) {
            setLockoutTime(Date.now() + LOCKOUT_DURATION);
          }
          return false;
        }

        if (signUpData.user) {
          console.log("Sign up successful, setting user state");
          
          // For development, let's try to confirm the user automatically
          if (signUpData.user.email_confirmed_at || signUpData.user.confirmed_at) {
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
          } else {
            console.log("User created but needs email confirmation");
            // For now, let's still allow them to login since it's an admin
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
      } catch (error) {
        console.error("Login error:", error);
      }
    } else {
      console.log("Invalid credentials provided");
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
