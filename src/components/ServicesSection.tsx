import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { services } from "@/data/services";
import { ArrowRight } from "lucide-react";

const useReveal = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
};

const ServicesSection = () => {
  const { ref, visible } = useReveal();

  return (
    <section id="services" className="py-24 md:py-32 bg-background">
      <div
        className="container mx-auto px-4 md:px-8"
        ref={ref}
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          filter: visible ? "blur(0)" : "blur(4px)",
          transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1), filter 600ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Направления</p>
        <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-12 text-wrap-balance">
          Полный спектр консалтинговых услуг
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => {
            const Icon = s.icon;
            return (
              <Link
                key={s.slug}
                to={`/services/${s.slug}`}
                className="group block border border-border rounded-lg p-5 bg-card shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(10px)",
                  transition: `opacity 500ms ${80 + i * 60}ms cubic-bezier(0.16,1,0.3,1), transform 500ms ${80 + i * 60}ms cubic-bezier(0.16,1,0.3,1)`,
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 text-accent shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="font-semibold text-foreground group-hover:text-accent transition-colors">{s.title}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{s.shortDesc}</p>
                <span className="inline-flex items-center text-sm font-medium text-accent gap-1 group-hover:gap-2 transition-all">
                  Подробнее <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
