'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { loginAdmin } from "../actions/auth";

const AdminLogin = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await loginAdmin(email, password);
      if (result.success) {
        toast.success("Login successful");
        router.push("/admin");
      } else {
        toast.error(result.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h1 className="font-mono text-2xl font-bold text-center mb-1">Admin Login</h1>
        <p className="text-center text-sm text-muted-foreground mb-8">Cybotixx Dashboard</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1" />
          </div>
          <Button type="submit" className="w-full font-mono tracking-wider" disabled={loading}>
            {loading ? <Loader2 size={16} className="animate-spin" /> : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
