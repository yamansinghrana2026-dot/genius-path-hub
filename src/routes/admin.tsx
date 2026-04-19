import { createFileRoute, Outlet, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useEffect } from "react";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Trophy,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { AuthProvider, useAuth } from "@/lib/auth";
import { Toaster } from "sonner";

export const Route = createFileRoute("/admin")({
  component: AdminShell,
});

function AdminShell() {
  return (
    <AuthProvider>
      <Toaster position="top-right" theme="dark" />
      <AdminGate />
    </AuthProvider>
  );
}

const navItems = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/courses", label: "Courses", icon: BookOpen },
  { to: "/admin/leads", label: "Leads", icon: Users },
  { to: "/admin/results", label: "Results", icon: Trophy },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

function AdminGate() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/admin/login";

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, user, isLoginPage, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="size-6 animate-spin text-yellow-accent" />
      </div>
    );
  }

  if (isLoginPage) return <Outlet />;
  if (!user) return null;

  return (
    <div className="min-h-screen flex">
      <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card/30 fixed inset-y-0 left-0 p-6">
        <Link to="/" className="flex items-center gap-2 mb-10">
          <div className="size-8 bg-yellow-accent rounded-md rotate-45 flex items-center justify-center">
            <div className="size-4 bg-navy-deep -rotate-45" />
          </div>
          <span className="font-bold tracking-tight uppercase text-sm">PJN Admin</span>
        </Link>
        <nav className="flex-1 flex flex-col gap-1">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: !!n.exact }}
              className="px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-foreground hover:bg-secondary flex items-center gap-3"
              activeProps={{ className: "text-yellow-accent bg-yellow-accent/10" }}
            >
              <n.icon className="size-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border pt-4 mt-4">
          <div className="text-xs text-muted-foreground mb-2 truncate">{user.email}</div>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/admin/login" }))}
            className="w-full px-4 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:text-destructive flex items-center gap-3"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 min-w-0">
        <header className="lg:hidden border-b border-border p-4 flex items-center justify-between sticky top-0 bg-background/90 backdrop-blur-xl z-40">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-7 bg-yellow-accent rounded-md rotate-45 flex items-center justify-center">
              <div className="size-3 bg-navy-deep -rotate-45" />
            </div>
            <span className="font-bold tracking-tight uppercase text-xs">PJN Admin</span>
          </Link>
          <button
            onClick={() => signOut().then(() => navigate({ to: "/admin/login" }))}
            className="p-2 text-foreground/70"
          >
            <LogOut className="size-5" />
          </button>
        </header>
        <nav className="lg:hidden flex overflow-x-auto border-b border-border bg-card/30">
          {navItems.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: !!n.exact }}
              className="px-4 py-3 text-xs font-semibold whitespace-nowrap text-foreground/60"
              activeProps={{ className: "text-yellow-accent border-b-2 border-yellow-accent" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="p-6 lg:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
