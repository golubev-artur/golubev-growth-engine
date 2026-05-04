import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { sendToTelegram } from "@/lib/telegram";

const directions = [
  "Продажи и CRM",
  "Бизнес-процессы",
  "Маркетинг",
  "Управление и стратегия",
  "Персонал и команда",
  "Технологии и автоматизация",
  "Клиентский сервис",
  "Стратегическая сессия",
];

const ContactSection = () => {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);

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
    await sendToTelegram({
      name: data.name as string,
      phone: data.phone as string,
      email: data.email as string,
      direction: data.direction as string,
      message: data.message as string,
      source: "Форма на главной странице",
    });
    setLoading(false);
    toast({
      title: "Заявка отправлена",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    form.reset();
  };

  return (
    <section id="contact" className="py-24 md:py-32 bg-card">
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
        <div className="max-w-xl mx-auto text-center mb-12">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Контакты</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 text-wrap-balance">
            Обсудим ваш проект
          </h2>
          <p className="text-muted-foreground">
            Заполните форму — мы свяжемся с вами в течение рабочего дня.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input name="name" placeholder="Имя" required className="bg-background" />
            <Input name="phone" placeholder="Телефон" type="tel" required className="bg-background" />
          </div>
          <Input name="email" placeholder="Email" type="email" className="bg-background" />
          <Select name="direction">
            <SelectTrigger className="bg-background">
              <SelectValue placeholder="Интересующее направление" />
            </SelectTrigger>
            <SelectContent>
              {directions.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea name="message" placeholder="Расскажите о задаче" rows={4} className="bg-background resize-none" />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
            disabled={loading}
          >
            {loading ? "Отправка..." : (
              <>
                Отправить заявку
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default ContactSection;
