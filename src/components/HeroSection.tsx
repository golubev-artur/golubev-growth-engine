import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import arthurHero from "@/assets/arthur-office-3.jpg";

const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    el.style.filter = "blur(4px)";
    requestAnimationFrame(() => {
      el.style.transition = "opacity 700ms cubic-bezier(0.16,1,0.3,1), transform 700ms cubic-bezier(0.16,1,0.3,1), filter 700ms cubic-bezier(0.16,1,0.3,1)";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
      el.style.filter = "blur(0)";
    });
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-[90vh] flex items-center bg-primary overflow-hidden">
      {/* Background image with overlay */}
      <div className="absolute inset-0">
        <img src={arthurHero} alt="" className="w-full h-full object-cover object-top opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/70" />
      </div>

      <div className="container mx-auto px-4 md:px-8 relative" ref={ref}>
        <div className="grid lg:grid-cols-2 gap-12 items-center py-24">
          <div className="space-y-6">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase">
              Golubev Consulting
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-primary-foreground leading-[1.08] tracking-tight text-wrap-balance">
              Системный консалтинг для роста вашего бизнеса
            </h1>
            <p className="text-primary-foreground/70 text-lg md:text-xl max-w-xl leading-relaxed">
              Продажи · Маркетинг · Бизнес-процессы · Управление · Автоматизация · Персонал · Клиентский сервис
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                size="lg"
                className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all text-base px-8"
                onClick={() => scrollTo("contact")}
              >
                Получить консультацию
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 active:scale-[0.97] transition-all text-base"
                onClick={() => scrollTo("services")}
              >
                Наши услуги
              </Button>
            </div>
          </div>

          <div className="hidden lg:block">
            <img
              src={arthurHero}
              alt="Артур Голубев — бизнес-консультант"
              className="w-full max-w-md ml-auto rounded-xl shadow-2xl object-cover aspect-[3/4]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
