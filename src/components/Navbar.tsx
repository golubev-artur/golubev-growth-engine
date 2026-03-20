import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4 md:px-8">
        <button onClick={() => scrollTo("hero")} className="text-lg font-bold tracking-tight text-foreground">
          Golubev <span className="text-accent">Consulting</span>
        </button>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {[
            ["services", "Услуги"],
            ["about", "О компании"],
            ["contact", "Контакты"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              {label}
            </button>
          ))}
          <Button size="sm" onClick={() => scrollTo("contact")} className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all">
            Оставить заявку
          </Button>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 pb-4 space-y-3">
          {[
            ["services", "Услуги"],
            ["about", "О компании"],
            ["contact", "Контакты"],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className="block w-full text-left text-sm font-medium text-muted-foreground hover:text-foreground py-2"
            >
              {label}
            </button>
          ))}
          <Button size="sm" className="w-full bg-accent text-accent-foreground" onClick={() => scrollTo("contact")}>
            Оставить заявку
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
