import { Link } from "react-router-dom";
import { Mail, Phone } from "lucide-react";
import { services } from "@/data/services";

const Footer = () => (
  <footer className="bg-primary py-12">
    <div className="container mx-auto px-4 md:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <Link to="/" className="inline-flex items-center self-start">
            <img src="/logo-white.png" alt="Голубев Консалтинг" className="h-32 w-auto" />
          </Link>
          <p className="text-primary-foreground/50 text-sm mt-3 max-w-xs">
            Системный консалтинг для малого и среднего бизнеса.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-foreground mb-4">Услуги</h4>
          <ul className="space-y-2">
            {services.slice(0, 5).map((s) => (
              <li key={s.slug}>
                <Link to={`/services/${s.slug}`} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="text-sm text-accent hover:text-accent/80 transition-colors">
                Все услуги →
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-primary-foreground mb-4">Контакты</h4>
          <div className="flex flex-col gap-2 text-sm">
            <a href="tel:+79001234567" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
              <Phone className="h-4 w-4" /> +7 (900) 123-45-67
            </a>
            <a href="mailto:info@golubev.consulting" className="flex items-center gap-2 text-primary-foreground/70 hover:text-accent transition-colors">
              <Mail className="h-4 w-4" /> info@golubev.consulting
            </a>
          </div>
          <div className="mt-6">
            <Link to="/blog" className="text-sm text-accent hover:text-accent/80 transition-colors">
              Читать блог →
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10 mt-8 pt-6 text-center text-xs text-primary-foreground/40">
        © {new Date().getFullYear()} Golubev Consulting. Все права защищены.
      </div>
    </div>
  </footer>
);

export default Footer;
