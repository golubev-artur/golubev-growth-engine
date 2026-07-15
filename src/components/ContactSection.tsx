import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Video, Clock, CheckCircle } from "lucide-react";
import { sendToTelegram } from "@/lib/telegram";
import { getPageLabel } from "@/lib/pageLabel";

const directions = [
  "Продажи и CRM",
  "Бизнес-процессы",
  "Маркетинг",
  "Управление и стратегия",
  "Персонал и команда",
  "Технологии и автоматизация",
  "Клиентский сервис",
  "Стратегическая сессия",
  "Финансы и управленческий учёт",
  "Юридические услуги",
];

const benefits = [
  "Разберём вашу ситуацию и найдём точки роста",
  "Покажем, где бизнес теряет деньги",
  "Дадим конкретные рекомендации",
  "Без обязательств - вы решаете сами",
];

const ContactSection = () => {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [direction, setDirection] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    try {
      await sendToTelegram({
        name: data.name as string,
        phone: data.phone as string,
        email: data.email as string,
        direction: direction || "",
        message: data.message as string,
        source: `Форма обратной связи - ${getPageLabel(window.location.pathname)}`,
      });
    } catch {
      // не блокируем UX
    }
    setLoading(false);
    setSent(true);
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами для подтверждения времени встречи.",
    });
    form.reset();
    setDirection("");
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-primary">
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
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent text-sm font-medium mb-6">
                <Video className="h-4 w-4" />
                Онлайн-встреча
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight leading-[1.12] mb-4">
                Бесплатная консультация для вашего бизнеса
              </h2>
              <p className="text-primary-foreground/60 text-lg leading-relaxed mb-8">
                45 минут с экспертом - разберём вашу ситуацию и покажем конкретные шаги к росту.
              </p>

              <div className="flex items-center gap-3 mb-6 text-primary-foreground/50">
                <Clock className="h-5 w-5 text-accent" />
                <span>45 минут · Онлайн · Бесплатно</span>
              </div>

              <ul className="space-y-4">
                {benefits.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-primary-foreground/70">{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-card rounded-2xl p-6 md:p-8 shadow-xl">
              {sent ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Заявка отправлена!</h3>
                  <p className="text-muted-foreground">
                    Мы свяжемся с вами в течение рабочего дня для подтверждения времени встречи.
                  </p>
                  <Button
                    className="mt-6 bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setSent(false)}
                  >
                    Отправить ещё одну заявку
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-bold text-foreground mb-1">Записаться на встречу</h3>
                  <p className="text-sm text-muted-foreground mb-6">Заполните форму - мы подберём удобное время</p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input name="name" placeholder="Ваше имя" required className="bg-background" />
                    <Input name="phone" placeholder="Телефон" type="tel" required className="bg-background" />
                    <Input name="email" placeholder="Email" type="email" className="bg-background" />
                    <Select name="direction" value={direction} onValueChange={setDirection}>
                      <SelectTrigger className="bg-background">
                        <SelectValue placeholder="Какой вопрос хотите обсудить?" />
                      </SelectTrigger>
                      <SelectContent>
                        {directions.map((d) => (
                          <SelectItem key={d} value={d}>{d}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Textarea
                      name="message"
                      placeholder="Кратко опишите вашу ситуацию или вопрос"
                      rows={3}
                      className="bg-background resize-none"
                    />
                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
                      disabled={loading}
                    >
                      {loading ? "Отправка..." : (
                        <>
                          Записаться на встречу
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
