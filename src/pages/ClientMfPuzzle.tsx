import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import ContactFormModal from "@/components/ContactFormModal";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, ArrowRight, ChevronDown, Target, BarChart3,
  Users, Briefcase, TrendingUp, Shield, Zap, Settings,
  Award, Clock, Calculator,
} from "lucide-react";

const MONTHS = [
  {
    num: 1,
    title: "Диагностика и фундамент",
    price: "200 000",
    icon: Target,
    color: "bg-blue-500/10 text-blue-500",
    items: [
      "Аудит текущего состояния бизнеса",
      "Аудит всех каналов и источников трафика",
      "Подсчёт юнит-экономики по всем источникам",
      "Определение структуры компании",
      "Постановка целей на год / квартал / месяц",
      "Старт внедрения Битрикс 24 с нуля",
      "Составление структуры отдела продаж",
    ],
  },
  {
    num: 2,
    title: "Структура и CRM",
    price: "200 000",
    icon: Settings,
    color: "bg-cyan-500/10 text-cyan-500",
    items: [
      "Настройка CRM Битрикс 24",
      "Подключение всех каналов и источников в Б24",
      "Подключение каналов к сайту",
      "Составление системы мотивации для отдела продаж",
      "Составление системы мотивации для производства",
      "Составление структурного порядка на производстве",
      "Начало найма сотрудников",
      "Распределение ролей",
    ],
  },
  {
    num: 3,
    title: "Найм и обучение",
    price: "180 000",
    icon: Users,
    color: "bg-violet-500/10 text-violet-500",
    items: [
      "Продолжение найма сотрудников",
      "Найм РОПа",
      "Обучение сотрудников работе с Б24",
      "Обучение отдела продаж структурной работе",
      "Внедрение сквозной аналитики",
      "Новые вводные по итогам месяца 1–2",
    ],
  },
  {
    num: 4,
    title: "Аналитика и трафик",
    price: "180 000",
    icon: BarChart3,
    color: "bg-emerald-500/10 text-emerald-500",
    items: [
      "Настройка трафика",
      "Привлечение SEO-специалиста и маркетолога",
      "Проверка работы сквозной аналитики",
      "Корректировка юнит-экономики по новым данным",
      "Корректировка системы мотивации",
      "Новые вводные по итогам месяца 2–3",
    ],
  },
  {
    num: 5,
    title: "Оптимизация и контроль",
    price: "160 000",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-500",
    items: [
      "Контроль работы отдела продаж",
      "Контроль работы производства",
      "Оптимизация бизнес-процессов в Б24",
      "Анализ эффективности каналов",
      "Корректировка планов на квартал",
      "Новые вводные по итогам месяца 3–4",
    ],
  },
  {
    num: 6,
    title: "Масштабирование и итоги",
    price: "160 000",
    icon: TrendingUp,
    color: "bg-rose-500/10 text-rose-500",
    items: [
      "Анализ результатов за 6 месяцев",
      "Подведение итогов по всем источникам",
      "Корректировка структуры компании",
      "Постановка новых целей и планов",
      "Формирование дорожной карты на следующий период",
      "Новые вводные по итогам месяца 4–5",
    ],
  },
];

const DELIVERABLES = [
  { icon: Briefcase, text: "Выстроенную структуру бизнеса" },
  { icon: Settings, text: "Работающую CRM Битрикс 24 с нуля" },
  { icon: Users, text: "Обученную команду" },
  { icon: BarChart3, text: "Настроенную аналитику и трафик" },
  { icon: Calculator, text: "Понятную юнит-экономику по каждому источнику" },
  { icon: Award, text: "Систему мотивации и планы на год вперёд" },
];

const MonthCard = ({ month }: { month: typeof MONTHS[0] }) => {
  const [open, setOpen] = useState(false);
  const Icon = month.icon;

  return (
    <div className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/5 transition-colors"
      >
        <span className={`flex items-center justify-center w-11 h-11 rounded-xl ${month.color} shrink-0`}>
          <Icon className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">
            Месяц {month.num}. {month.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {month.items.length} задач
          </p>
        </div>
        <span className="text-sm font-bold text-foreground shrink-0 mr-2">
          {month.price} ₽
        </span>
        <ChevronDown
          className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && (
        <div className="px-5 pb-5 border-t border-border pt-5">
          <ul className="space-y-2.5">
            {month.items.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-accent/60 shrink-0 mt-0.5" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const ClientMfPuzzle = () => {
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Seo
        title="MF-Puzzle — План сопровождения"
        description="Индивидуальный план сопровождения компании MF-Puzzle: 6 месяцев активной работы от Голубев Консалтинг"
        path="/client/mf-puzzle"
        noIndex
      />
      <ContactFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDirection="Продажи и CRM"
        sourceItem="Страница клиента: MF-Puzzle"
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Индивидуальный план
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] mb-3">
            MF-Puzzle
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-2xl">
            План сопровождения на 6 месяцев — от диагностики до масштабирования.
            Полное выстраивание бизнес-процессов, CRM, команды и аналитики.
          </p>
        </div>
      </section>

      {/* Overview cards */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Срок</h3>
                <p className="text-sm text-muted-foreground">6 месяцев активной работы</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Target className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Цель</h3>
                <p className="text-sm text-muted-foreground">Выстроить систему, которая работает без сбоев</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">После</h3>
                <p className="text-sm text-muted-foreground">Внешний контроль — 100 000 ₽/мес</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan — 6 months */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              План работ
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              6 месяцев — от фундамента до результата
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Каждый месяц предусматривает появление новых вводных — как из предыдущих этапов,
              так и новых задач. Все изменения фиксируются и интегрируются в текущий план работы.
            </p>
          </div>

          <div className="space-y-4">
            {MONTHS.map((month) => (
              <MonthCard key={month.num} month={month} />
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              Стоимость
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              Стоимость сопровождения
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Main plan */}
            <div className="border border-accent/30 rounded-2xl bg-background p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-xs font-bold px-4 py-1.5 rounded-bl-xl">
                6 месяцев
              </div>
              <h3 className="text-lg font-bold text-foreground mb-6 mt-2">Активная работа</h3>

              <div className="space-y-3 mb-6">
                {MONTHS.map((m) => (
                  <div key={m.num} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Месяц {m.num} — {m.title}
                    </span>
                    <span className="font-semibold text-foreground whitespace-nowrap ml-4">
                      {m.price} ₽
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <span className="font-bold text-foreground">Итого за 6 месяцев</span>
                <span className="text-xl font-extrabold text-accent">1 080 000 ₽</span>
              </div>
            </div>

            {/* After plan */}
            <div className="border border-border rounded-2xl bg-background p-6 md:p-8 flex flex-col">
              <h3 className="text-lg font-bold text-foreground mb-4">После 6 месяцев</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                Когда система выстроена и работает — я остаюсь на внешнем контроле.
                Это значит, что бизнес продолжает расти, а я слежу за тем, чтобы
                всё не сломалось и двигалось в нужном направлении.
              </p>
              <div className="border-t border-border pt-4 mt-6 flex items-center justify-between">
                <span className="font-bold text-foreground">Внешний контроль</span>
                <span className="text-xl font-extrabold text-foreground">100 000 ₽/мес</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              Результат
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              За 6 месяцев вы получаете
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {DELIVERABLES.map((item, i) => {
              const Icon = item.icon;
              return (
                <div
                  key={i}
                  className="flex items-start gap-4 p-5 rounded-xl border border-border bg-card"
                >
                  <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent shrink-0">
                    <Icon className="h-5 w-5" />
                  </span>
                  <p className="text-sm font-medium text-foreground leading-relaxed mt-2">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="py-12 md:py-16 bg-card border-t border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <div className="p-8 md:p-10 rounded-2xl bg-primary/5 border border-primary/10">
            <h3 className="text-xl md:text-2xl font-bold text-foreground mb-4">
              Если коротко
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Вы платите один раз за построение системы — и дальше платите только за то,
              чтобы она работала без сбоев. Это в разы дешевле, чем держать в штате
              всех специалистов, которых я заменяю.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Готовы начать?
          </h2>
          <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">
            Свяжитесь для обсуждения деталей и старта работы
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
            onClick={() => setFormOpen(true)}
          >
            Обсудить детали
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default ClientMfPuzzle;
