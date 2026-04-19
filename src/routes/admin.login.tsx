import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (user) {
    navigate({ to: "/admin" });
    return null;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      toast.error(error);
      return;
    }
    toast.success("Welcome back");
    navigate({ to: "/admin" });
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-fade pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 size-[500px] bg-yellow-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="relative w-full max-w-md glass-card rounded-3xl p-8 lg:p-10">
        <div className="flex items-center gap-2 mb-8">
          <div className="size-9 bg-yellow-accent rounded-md rotate-45 flex items-center justify-center">
            <div className="size-5 bg-navy-deep -rotate-45" />
          </div>
          <span className="font-bold tracking-tight uppercase">PJN Admin</span>
        </div>
        <h1 className="text-3xl font-bold">Sign in</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Access the admin dashboard.
        </p>
        <form onSubmit={onSubmit} className="flex flex-col gap-4 mt-8">
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-yellow-accent"
              placeholder="admin@pjneducare.com"
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-3 bg-secondary border border-border rounded-xl focus:outline-none focus:border-yellow-accent"
              placeholder="••••••••"
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="mt-2 px-6 py-3.5 bg-yellow-accent text-navy-deep font-bold rounded-full hover:scale-[1.02] transition-transform disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="size-4 animate-spin" /> : "Sign in"}
          </button>
        </form>
        <p className="text-xs text-muted-foreground mt-6 text-center">
          Don't have an account? Create one in your Supabase dashboard.
        </p>
      </div>
    </div>
  );
}
