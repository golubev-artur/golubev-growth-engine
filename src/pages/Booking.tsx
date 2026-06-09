import { useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, Video, Clock, CheckCircle } from "lucide-react";
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

const benefits = [
  "Разберём вашу ситуацию и найдём точки роста",
  "Покажем, где бизнес теряет деньги",
  "Дадим конкретные рекомендации",
  "Без обязательств — вы решаете сами",
];

const Booking = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

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
      source: "Страница записи на онлайн-встречу (/forma)",
    });
    setLoading(false);
    setSent(true);
    toast({
      title: "Заявка отправлена!",
      description: "Мы свяжемся с вами для подтверждения времени встречи.",
    });
    form.reset();
  };

  return (
    <Layout>
      <Seo
        title="Запись на бесплатную онлайн-встречу"
        description="Запишитесь на бесплатную 45-минутную онлайн-консультацию с экспертом Голубев Консалтинг. Разберём вашу ситуацию и дадим конкретные рекомендации."
        path="/forma"
      />

      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 text-accent text-sm font-medium mb-6">
                  <Video className="h-4 w-4" />
                  Онлайн-встреча
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-primary-foreground tracking-tight leading-[1.12] mb-4">
                  Бесплатная консультация для вашего бизнеса
                </h1>
                <p className="text-primary-foreground/60 text-lg leading-relaxed mb-8">
                  45 минут с экспертом — разберём вашу ситуацию и покажем конкретные шаги к росту.
                </p>

                <div className="flex items-center gap-3 mb-6 text-primary-foreground/50">
                  <Clock className="h-5 w-5 text-accent" />
                  <span>45 минут · Zoom или Google Meet · Бесплатно</span>
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
                    <h2 className="text-2xl font-bold text-foreground mb-2">Заявка отправлена!</h2>
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
                    <h2 className="text-xl font-bold text-foreground mb-1">Записаться на встречу</h2>
                    <p className="text-sm text-muted-foreground mb-6">Заполните форму — мы подберём удобное время</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                      <Input name="name" placeholder="Ваше имя" required className="bg-background" />
                      <Input name="phone" placeholder="Телефон" type="tel" required className="bg-background" />
                      <Input name="email" placeholder="Email" type="email" className="bg-background" />
                      <Select name="direction">
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
    </Layout>
  );
};

export default Booking;
