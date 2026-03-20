import { useEffect, useRef, useState } from "react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import {
  TrendingUp,
  Settings,
  BarChart3,
  Target,
  Users,
  Cpu,
  HeartHandshake,
} from "lucide-react";

const categories = [
  {
    icon: TrendingUp,
    title: "Продажи и CRM",
    items: [
      "Аудит отдела продаж",
      "Построение воронки продаж",
      "Настройка и внедрение CRM системы",
      "Разработка скриптов продаж",
      "Обучение менеджеров по продажам",
      "Построение системы мотивации отдела продаж",
      "Разработка KPI для менеджеров",
      "Построение планов продаж",
    ],
  },
  {
    icon: Settings,
    title: "Бизнес-процессы",
    items: [
      "Аудит и описание бизнес-процессов",
      "Оптимизация и автоматизация бизнес-процессов",
      "Разработка регламентов и стандартов работы",
      "Внедрение системы контроля качества",
      "Построение организационной структуры компании",
      "Описание должностных инструкций",
    ],
  },
  {
    icon: BarChart3,
    title: "Маркетинг",
    items: [
      "Аудит маркетинговой стратегии",
      "Анализ целевой аудитории и сегментация",
      "Разработка позиционирования бренда",
      "Настройка аналитики и сквозной отчётности",
      "Аудит рекламных каналов и бюджетов",
      "Разработка контент-стратегии",
    ],
  },
  {
    icon: Target,
    title: "Управление и стратегия",
    items: [
      "Разработка стратегии развития компании",
      "Постановка целей по системе OKR",
      "Построение системы управленческой отчётности",
      "Финансовое моделирование и планирование",
      "Антикризисный консалтинг",
      "Сопровождение собственника как бизнес-партнёр",
    ],
  },
  {
    icon: Users,
    title: "Персонал и команда",
    items: [
      "Аудит системы найма и адаптации",
      "Разработка системы оценки персонала",
      "Построение корпоративной культуры",
      "Проведение опросов удовлетворённости сотрудников",
      "Разработка системы обучения и развития команды",
      "Построение кадрового резерва",
    ],
  },
  {
    icon: Cpu,
    title: "Технологии и автоматизация",
    items: [
      "Аудит текущих инструментов и программ",
      "Подбор и внедрение IT решений для бизнеса",
      "Интеграция сервисов и автоматизация рутины",
      "Внедрение ИИ инструментов в работу компании",
      "Настройка телефонии и коммуникаций",
      "Построение единого цифрового рабочего пространства",
    ],
  },
  {
    icon: HeartHandshake,
    title: "Клиентский сервис",
    items: [
      "Аудит клиентского пути и точек контакта",
      "Разработка стандартов обслуживания клиентов",
      "Построение системы работы с обратной связью",
      "Внедрение программы лояльности",
      "Разработка системы удержания клиентов",
      "Построение NPS измерений и работа с метрикой",
    ],
  },
];

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

        <div className="grid md:grid-cols-2 gap-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Accordion key={i} type="single" collapsible>
                <AccordionItem value={cat.title} className="border border-border rounded-lg px-5 bg-card shadow-sm hover:shadow-md transition-shadow">
                  <AccordionTrigger className="hover:no-underline gap-3 py-5">
                    <span className="flex items-center gap-3 text-left">
                      <span className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 text-accent shrink-0">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span className="font-semibold text-foreground">{cat.title}</span>
                      <span className="text-xs text-muted-foreground ml-1">({cat.items.length})</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 pb-2">
                      {cat.items.map((item, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
