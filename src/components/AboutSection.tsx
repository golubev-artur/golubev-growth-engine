import { useEffect, useRef, useState } from "react";
import arthurAbout from "@/assets/arthur-main.jpg";

const stats = [
  { value: "12+", label: "лет опыта" },
  { value: "150+", label: "проектов" },
  { value: "87", label: "клиентов" },
  { value: "7", label: "направлений" },
];

const AboutSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.2 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 md:py-32 bg-primary">
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
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          <div className="lg:col-span-2">
            <img
              src={arthurAbout}
              alt="Артур Голубев — основатель ГОЛУБЕВ КОНСАЛТИНГ"
              loading="lazy"
              className="w-full max-w-sm mx-auto rounded-xl shadow-2xl object-cover aspect-[2/3]"
            />
          </div>
          <div className="lg:col-span-3">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">О компании</p>
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground tracking-tight mb-6 text-wrap-balance">
              Выстраиваем системы, которые работают без вас
            </h2>
            <p className="text-primary-foreground/70 text-lg leading-relaxed mb-4">
              ГОЛУБЕВ КОНСАЛТИНГ — это команда практиков, которая помогает собственникам бизнеса навести порядок в продажах, процессах, маркетинге и управлении. Мы не просто консультируем — мы внедряем решения и доводим их до результата.
            </p>
            <p className="text-primary-foreground/60 leading-relaxed">
              Наш подход — системный: мы видим бизнес целиком, находим узкие места и строим процессы, которые масштабируются. Работаем с малым и средним бизнесом в России и СНГ.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(12px)",
                transition: `opacity 500ms ${200 + i * 80}ms cubic-bezier(0.16,1,0.3,1), transform 500ms ${200 + i * 80}ms cubic-bezier(0.16,1,0.3,1)`,
              }}
            >
              <div className="text-4xl md:text-5xl font-extrabold text-accent">{s.value}</div>
              <div className="text-primary-foreground/60 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
