import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/kttc/integrations/supabase/client";
import { Button } from "@/kttc/components/ui/button";
import { Input } from "@/kttc/components/ui/input";
import { Label } from "@/kttc/components/ui/label";
import { useToast } from "@/kttc/hooks/use-toast";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Login failed", description: error.message });
      return;
    }

    if (data.user) {
      // Let ProtectedRoute resolve the correct destination once the session
      // has fully propagated. Avoids a race where RLS-protected role/profile
      // queries return empty before the auth token is attached.
      navigate("/kttc/dashboard", { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-8 block text-center font-serif text-2xl font-semibold text-foreground">
          Keys to the City
        </Link>
        <h1 className="text-center font-serif text-3xl font-semibold text-foreground">Welcome back</h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">Sign in to your account</p>

        <form onSubmit={handleLogin} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link to="/kttc/forgot-password" className="text-xs text-primary hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {loading ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/kttc/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
