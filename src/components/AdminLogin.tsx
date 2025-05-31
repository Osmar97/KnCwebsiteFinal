
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, LogIn, LogOut, Shield } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

export const AdminLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAdminLoggedIn, adminUser, login, logout, loginAttempts, isLocked } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      toast({
        title: "Account Locked",
        description: "Too many failed login attempts. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter both email and password.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const success = await login(email, password);
      
      if (success) {
        toast({
          title: "Login Successful",
          description: `Welcome back, ${adminUser?.name || 'Admin'}!`,
        });
        setEmail("");
        setPassword("");
        setIsOpen(false);
      } else {
        const remainingAttempts = Math.max(0, 5 - loginAttempts - 1);
        toast({
          title: "Login Failed",
          description: remainingAttempts > 0 
            ? `Invalid credentials. ${remainingAttempts} attempts remaining.`
            : "Account will be locked after this attempt.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  if (isAdminLoggedIn && adminUser) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-sm font-medium text-gold">{adminUser.name}</p>
          <p className="text-xs text-gray-400">{adminUser.title}</p>
        </div>
        <Button
          onClick={handleLogout}
          variant="outline"
          size="sm"
          className="border-gold text-gold hover:bg-gold hover:text-black"
        >
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-gold text-gold hover:bg-gold hover:text-black"
        >
          <User className="w-4 h-4 mr-2" />
          Admin
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-gold text-xl font-light tracking-wider flex items-center gap-3">
            <Shield className="w-5 h-5" />
            Secure Admin Login
          </DialogTitle>
        </DialogHeader>
        
        {isLocked ? (
          <div className="text-center py-8">
            <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-red-400 mb-2">Account Locked</h3>
            <p className="text-gray-300 text-sm">
              Too many failed login attempts. Please try again in 15 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                required
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white focus:border-gold"
                required
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            {loginAttempts > 0 && (
              <div className="text-center text-sm text-yellow-400">
                {5 - loginAttempts} login attempts remaining
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading || isLocked}
              className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
            >
              <LogIn className="w-4 h-4 mr-2" />
              {isLoading ? "Authenticating..." : "Secure Login"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};
