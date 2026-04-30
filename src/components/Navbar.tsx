import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/services", label: "Услуги" },
  { to: "/blog", label: "Блог" },
  { to: "/#about", label: "О компании" },
  { to: "/#contact", label: "Контакты" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (to: string) => {
    setMobileOpen(false);
    if (to.startsWith("/#")) {
      const id = to.slice(2);
      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = to;
      }
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-24 px-4 md:px-8">
        <Link to="/" className="flex items-center">
          <img src="/logo.png" alt="Голубев Консалтинг" className="h-20 w-auto" />
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) =>
            link.to.startsWith("/#") ? (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            )
          )}
          <Button
            size="sm"
            className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
            onClick={() => handleNavClick("/#contact")}
          >
            Оставить заявку
          </Button>
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-3">
          {navLinks.map((link) =>
            link.to.startsWith("/#") ? (
              <button
                key={link.to}
                onClick={() => handleNavClick(link.to)}
                className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
              >
                {link.label}
              </Link>
            )
          )}
          <Button
            size="sm"
            className="w-full bg-accent text-accent-foreground"
            onClick={() => handleNavClick("/#contact")}
          >
            Оставить заявку
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
