'use client'
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { to: "/", label: "Home" },
  // { to: "/register", label: "Register" },
  // { to: "/registrations", label: "Registrations" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link href="/" className="font-mono text-lg font-bold tracking-widest uppercase">
          Cybotixx
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              className={`text-sm font-medium transition-colors hover:text-foreground ${location === l.to ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/register">
            <Button size="sm" className="font-mono text-xs tracking-wider">
              Register Now
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-b bg-background px-4 pb-4 space-y-3">
          {links.map((l) => (
            <Link
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className={`block text-sm font-medium py-1 ${location === l.to ? "text-foreground" : "text-muted-foreground"
                }`}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/register" onClick={() => setOpen(false)}>
            <Button size="sm" className="w-full font-mono text-xs tracking-wider">
              Register Now
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
