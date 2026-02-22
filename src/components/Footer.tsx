import Link from "next/link";

const Footer = () => (
  <footer className="border-t bg-muted/20 relative overflow-hidden">
    <div className="container mx-auto px-4 py-12">
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div>
          <h3 className="font-mono text-lg font-bold tracking-widest uppercase mb-3">Cybotixx</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The BCA tech forum. Building the next generation of developers through hackathons, workshops, and community.
          </p>
        </div>
        <div>
          <h4 className="font-mono text-sm font-semibold uppercase tracking-wider mb-3">Quick Links</h4>
          <div className="space-y-2">
            <Link href="/" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
            <Link href="/register" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Register</Link>
            {/* <Link href="/registrations" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">Registrations</Link> */}
          </div>
        </div>
        <div>
          <h4 className="font-mono text-sm font-semibold uppercase tracking-wider mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>cybotixx@college.edu</p>
            <p>BCA Department</p>
          </div>
        </div>
      </div>

      {/* Big CYBOTIXX watermark behind bottom section */}
      <div className="relative">
        <div className="select-none pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="font-mono text-[clamp(3rem,12vw,9rem)] font-bold tracking-[0.25em] uppercase text-foreground/[0.035] leading-none whitespace-nowrap">
            CYBOTIXX
          </span>
        </div>

        {/* Copyright */}
        <div className="pt-6 border-t text-center text-xs text-muted-foreground font-mono relative z-10">
          © {new Date().getFullYear()} Cybotixx. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
