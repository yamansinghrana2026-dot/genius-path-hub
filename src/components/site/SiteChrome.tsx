import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/branches", label: "Branches" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/70 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8 flex items-center justify-between h-16 lg:h-20">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="size-9 bg-yellow-accent flex items-center justify-center rounded-md rotate-45 transition-transform group-hover:rotate-90">
            <div className="size-5 bg-navy-deep -rotate-45" />
          </div>
          <span className="text-lg font-bold tracking-tight uppercase">
            PJN Educare
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-4 py-2 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors rounded-full"
              activeProps={{ className: "text-yellow-accent" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/admin/login"
            className="px-4 py-2 text-xs font-semibold uppercase tracking-widest text-foreground/60 hover:text-foreground transition-colors"
          >
            Admin
          </Link>
          <Link
            to="/contact"
            className="px-5 py-2.5 bg-yellow-accent text-navy-deep text-sm font-bold rounded-full hover:scale-105 transition-transform"
          >
            Enroll Now
          </Link>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="md:hidden p-2 text-foreground"
          aria-label="Menu"
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl">
          <nav className="flex flex-col p-4 gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-base font-medium rounded-lg hover:bg-secondary"
                activeProps={{ className: "text-yellow-accent bg-secondary" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 px-5 py-3 bg-yellow-accent text-navy-deep text-sm font-bold rounded-full text-center"
            >
              Enroll Now
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <div className="size-8 bg-yellow-accent flex items-center justify-center rounded-md rotate-45">
              <div className="size-4 bg-navy-deep -rotate-45" />
            </div>
            <span className="font-bold tracking-tight uppercase">PJN Educare</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-md">
            India's leading coaching hub for IIT-JEE, NEET, CUET, NDA, and Govt
            Job aspirants. Built for breakthrough results.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Explore
          </h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-yellow-accent">Courses</Link></li>
            <li><Link to="/branches" className="hover:text-yellow-accent">Branches</Link></li>
            <li><Link to="/contact" className="hover:text-yellow-accent">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-4">
            Branches
          </h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>Najafgarh</li>
            <li>Dwarka</li>
            <li>Chhawla</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-6 text-xs text-muted-foreground tracking-widest uppercase flex flex-wrap justify-between gap-2">
          <span>© {new Date().getFullYear()} PJN Educare</span>
          <span>Excellence in Engineering & Medicine</span>
        </div>
      </div>
    </footer>
  );
}
