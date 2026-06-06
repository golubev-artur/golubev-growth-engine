import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight } from "lucide-react";
import { services } from "@/data/services";

const Footer = () => (
  <footer aria-label="Подвал сайта" className="bg-primary">
    {/* Main footer grid */}
    <div className="container mx-auto px-4 md:px-8 py-14">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Col 1 — Brand */}
        <div className="lg:col-span-1">
          <Link to="/" className="inline-flex items-center self-start mb-4">
            <img src="/logo-white.png" alt="Голубев Консалтинг" loading="lazy" className="h-20 w-auto" />
          </Link>
          <p className="text-primary-foreground/50 text-sm leading-relaxed max-w-xs">
            Системный консалтинг для малого и среднего бизнеса. Продажи, процессы, маркетинг, управление, автоматизация.
          </p>
          <div className="mt-5 space-y-2.5">
            <a
              href="tel:+79261692114"
              className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" />
              +7 (926) 169-21-14
            </a>
            <a
              href="mailto:info@golubev-consulting.ru"
              className="flex items-center gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              info@golubev-consulting.ru
            </a>
            <a
              href="https://maps.yandex.ru/?text=Мясницкая+ул.,+46+стр.+1,+Москва"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-2 text-sm text-primary-foreground/60 hover:text-accent transition-colors"
            >
              <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <span>г. Москва, м. Красные ворота,<br />Мясницкая ул., 46 стр. 1</span>
            </a>
          </div>
        </div>

        {/* Col 2 — Services */}
        <div>
          <h4 className="text-sm font-semibold text-primary-foreground mb-4 tracking-wide">Услуги</h4>
          <ul className="space-y-2.5">
            {services.slice(0, 6).map((s) => (
              <li key={s.slug}>
                <Link
                  to={`/services/${s.slug}`}
                  className="text-sm text-primary-foreground/55 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary-foreground/30 group-hover:bg-accent transition-colors shrink-0" />
                  {s.title}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/services" className="text-sm text-accent hover:text-accent/80 transition-colors inline-flex items-center gap-1">
                Все услуги <ArrowRight className="h-3 w-3" />
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3 — Company */}
        <div>
          <h4 className="text-sm font-semibold text-primary-foreground mb-4 tracking-wide">Компания</h4>
          <ul className="space-y-2.5">
            {[
              { to: "/blog", label: "Блог" },
              { to: "/faq", label: "FAQ" },
              { to: "/press", label: "Для СМИ" },
              { to: "/presentation", label: "Скачать презентацию" },
              { to: "/privacy", label: "Политика конфиденциальности" },
            ].map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="text-sm text-primary-foreground/55 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                >
                  <span className="w-1 h-1 rounded-full bg-primary-foreground/30 group-hover:bg-accent transition-colors shrink-0" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <h4 className="text-sm font-semibold text-primary-foreground mt-7 mb-4 tracking-wide">Для СМИ</h4>
          <ul className="space-y-2.5">
            {[
              { to: "/press", label: "Пресс-центр" },
              { to: "/press#media-kit", label: "Медиа-кит" },
              { href: "mailto:press@golubev-consulting.ru", label: "press@golubev-consulting.ru" },
            ].map((item, i) =>
              item.href ? (
                <li key={i}>
                  <a
                    href={item.href}
                    className="text-sm text-primary-foreground/55 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-foreground/30 group-hover:bg-accent transition-colors shrink-0" />
                    {item.label}
                  </a>
                </li>
              ) : (
                <li key={i}>
                  <Link
                    to={item.to!}
                    className="text-sm text-primary-foreground/55 hover:text-accent transition-colors inline-flex items-center gap-1 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary-foreground/30 group-hover:bg-accent transition-colors shrink-0" />
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>
        </div>

        {/* Col 4 — CTA */}
        <div>
          <h4 className="text-sm font-semibold text-primary-foreground mb-4 tracking-wide">Начать работу</h4>
          <p className="text-sm text-primary-foreground/50 mb-4 leading-relaxed">
            Бесплатная 45-минутная диагностика — узнайте, где ваш бизнес теряет деньги.
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors mb-3"
          >
            Записаться бесплатно
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <div className="mt-3">
            <Link
              to="/presentation"
              className="inline-flex items-center gap-1.5 text-sm text-primary-foreground/55 hover:text-accent transition-colors"
            >
              Скачать презентацию →
            </Link>
          </div>
          <div className="mt-6 p-4 rounded-xl bg-primary-foreground/5 border border-primary-foreground/10">
            <p className="text-xs text-primary-foreground/40 mb-1">Часто задаваемые вопросы</p>
            <Link to="/faq" className="text-sm text-primary-foreground/70 hover:text-accent transition-colors">
              Ответы на популярные вопросы →
            </Link>
          </div>
        </div>
      </div>
    </div>

    {/* Bottom bar */}
    <div className="border-t border-primary-foreground/10">
      <div className="container mx-auto px-4 md:px-8 py-5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-primary-foreground/35">
            © {new Date().getFullYear()} Голубев Консалтинг. Все права защищены.
          </p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-xs text-primary-foreground/35 hover:text-accent transition-colors">
              Политика конфиденциальности
            </Link>
            <Link to="/faq" className="text-xs text-primary-foreground/35 hover:text-accent transition-colors">
              FAQ
            </Link>
            <Link to="/press" className="text-xs text-primary-foreground/35 hover:text-accent transition-colors">
              Для СМИ
            </Link>
          </div>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
