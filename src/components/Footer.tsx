import { Mail, Phone } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-4 md:px-8">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <div className="text-lg font-bold text-primary-foreground tracking-tight mb-3">
            Golubev <span className="text-accent">Consulting</span>
          </div>
          <p className="text-primary-foreground/50 text-sm max-w-xs">
            Системный консалтинг для малого и среднего бизнеса.
          </p>
        </div>

        <div className="flex flex-col gap-2 text-sm">
          <a href="tel:+79001234567" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
            <Phone className="h-4 w-4" /> +7 (900) 123-45-67
          </a>
          <a href="mailto:info@golubev.consulting" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
            <Mail className="h-4 w-4" /> info@golubev.consulting
          </a>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} Golubev Consulting. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
