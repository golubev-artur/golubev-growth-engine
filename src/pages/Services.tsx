import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { services } from "@/data/services";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

const ServicesPage = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <Layout>
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Направления</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] text-wrap-balance">
            Наши услуги
          </h1>
          <p className="text-primary-foreground/60 text-lg mt-4 max-w-2xl">
            8 направлений консалтинга — 50 услуг для системного роста вашего бизнеса
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
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
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => {
              const Icon = s.icon;
              return (
                <Link
                  key={s.slug}
                  to={`/services/${s.slug}`}
                  className="group block border border-border rounded-lg p-6 bg-card shadow-sm hover:shadow-lg transition-all active:scale-[0.98]"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(12px)",
                    transition: `opacity 500ms ${100 + i * 70}ms cubic-bezier(0.16,1,0.3,1), transform 500ms ${100 + i * 70}ms cubic-bezier(0.16,1,0.3,1)`,
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className="flex items-center justify-center w-10 h-10 rounded-md bg-accent/10 text-accent shrink-0">
                      <Icon className="h-5 w-5" />
                    </span>
                    <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors">{s.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{s.shortDesc}</p>
                  <span className="inline-flex items-center text-sm font-medium text-accent group-hover:gap-2 gap-1 transition-all">
                    Подробнее <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServicesPage;
