
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { User, LogIn, LogOut } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";
import { useToast } from "@/hooks/use-toast";

export const AdminLogin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { isAdminLoggedIn, adminUser, login, logout } = useAdmin();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const success = login(email, password);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome back, ${adminUser?.name}!`,
      });
      setEmail("");
      setPassword("");
      setIsOpen(false);
    } else {
      toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
    }
    
    setIsLoading(false);
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
            <LogIn className="w-5 h-5" />
            Admin Login
          </DialogTitle>
        </DialogHeader>
        
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
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gold hover:bg-gold/90 text-black font-medium"
          >
            <LogIn className="w-4 h-4 mr-2" />
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
