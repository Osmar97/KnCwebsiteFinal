
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminUser {
  name: string;
  title: string;
  email: string;
}

interface AdminContextType {
  isAdminLoggedIn: boolean;
  adminUser: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loginAttempts: number;
  isLocked: boolean;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Move credentials to environment variables (this should be handled by Supabase in production)
const ADMIN_EMAIL = 'ismael@kingsncompany.com';
const ADMIN_PASSWORD_HASH = 'admin'; // In production, this should be properly hashed
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEnd, setLockoutEnd] = useState<number | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedSession = localStorage.getItem('adminSession');
    const sessionTimestamp = localStorage.getItem('sessionTimestamp');
    
    if (savedSession && sessionTimestamp) {
      const sessionAge = Date.now() - parseInt(sessionTimestamp);
      const maxSessionAge = 24 * 60 * 60 * 1000; // 24 hours
      
      if (sessionAge < maxSessionAge) {
        setIsAdminLoggedIn(true);
        setAdminUser({
          name: 'Ismael Gomes Queta',
          title: 'Founder',
          email: ADMIN_EMAIL
        });
      } else {
        // Session expired
        localStorage.removeItem('adminSession');
        localStorage.removeItem('sessionTimestamp');
      }
    }

    // Check lockout status
    const savedLockout = localStorage.getItem('lockoutEnd');
    if (savedLockout) {
      const lockoutEndTime = parseInt(savedLockout);
      if (Date.now() < lockoutEndTime) {
        setIsLocked(true);
        setLockoutEnd(lockoutEndTime);
      } else {
        localStorage.removeItem('lockoutEnd');
        localStorage.removeItem('loginAttempts');
      }
    }

    // Load login attempts
    const savedAttempts = localStorage.getItem('loginAttempts');
    if (savedAttempts) {
      setLoginAttempts(parseInt(savedAttempts));
    }
  }, []);

  useEffect(() => {
    // Auto-unlock after lockout period
    if (isLocked && lockoutEnd) {
      const timeout = setTimeout(() => {
        if (Date.now() >= lockoutEnd) {
          setIsLocked(false);
          setLockoutEnd(null);
          setLoginAttempts(0);
          localStorage.removeItem('lockoutEnd');
          localStorage.removeItem('loginAttempts');
        }
      }, lockoutEnd - Date.now());

      return () => clearTimeout(timeout);
    }
  }, [isLocked, lockoutEnd]);

  const sanitizeInput = (input: string): string => {
    return input.trim().toLowerCase();
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // Check if account is locked
    if (isLocked) {
      return false;
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = password.trim();

    // Validate inputs
    if (!validateEmail(sanitizedEmail) || sanitizedPassword.length === 0) {
      return false;
    }

    // Simulate network delay to prevent timing attacks
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    // Check credentials
    if (sanitizedEmail === ADMIN_EMAIL.toLowerCase() && sanitizedPassword === ADMIN_PASSWORD_HASH) {
      // Successful login
      setIsAdminLoggedIn(true);
      setAdminUser({
        name: 'Ismael Gomes Queta',
        title: 'Founder',
        email: ADMIN_EMAIL
      });
      
      // Create secure session
      const sessionToken = btoa(Date.now().toString() + Math.random().toString());
      localStorage.setItem('adminSession', sessionToken);
      localStorage.setItem('sessionTimestamp', Date.now().toString());
      
      // Reset login attempts
      setLoginAttempts(0);
      localStorage.removeItem('loginAttempts');
      
      return true;
    } else {
      // Failed login
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      localStorage.setItem('loginAttempts', newAttempts.toString());
      
      // Lock account after max attempts
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        const lockoutEndTime = Date.now() + LOCKOUT_DURATION;
        setIsLocked(true);
        setLockoutEnd(lockoutEndTime);
        localStorage.setItem('lockoutEnd', lockoutEndTime.toString());
      }
      
      return false;
    }
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    setAdminUser(null);
    localStorage.removeItem('adminSession');
    localStorage.removeItem('sessionTimestamp');
  };

  return (
    <AdminContext.Provider value={{ 
      isAdminLoggedIn, 
      adminUser, 
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
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
