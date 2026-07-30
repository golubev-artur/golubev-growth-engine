import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import ContactFormModal from "@/components/ContactFormModal";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2, ArrowRight, ChevronDown, Target, BarChart3,
  Users, Briefcase, TrendingUp, Shield, Zap, Settings,
  Award, Clock, Calculator, Video, MapPin,
} from "lucide-react";

const MONTHS = [
  {
    num: 1,
    title: "Диагностика и фундамент",
    price: "200 000",
    icon: Target,
    color: "bg-blue-500/10 text-blue-500",
    items: [
      {
        text: "Аудит текущего состояния бизнеса",
        details: [
          "Анализ оргструктуры, процессов и точек потерь",
          "Фиксация текущих показателей: выручка, маржа, конверсии",
        ],
      },
      {
        text: "Аудит всех каналов и источников трафика",
        details: [
          "Объём, стоимость и количество заявок по каждому каналу",
          "Оценка качества лидов по источникам",
        ],
      },
      {
        text: "Подсчёт юнит-экономики по всем источникам",
        details: [
          "Расчёт CAC, LTV и ROMI по каждому каналу",
          "Выявление убыточных и прибыльных источников",
        ],
      },
      {
        text: "Определение структуры компании",
        details: [
          "Схема отделов, зон ответственности и подчинения",
          "Выявление дублей и пробелов в функциях",
        ],
      },
      {
        text: "Постановка целей на год / квартал / месяц",
        details: [
          "Декомпозиция цели по выручке до месячных планов",
          "Определение ключевых метрик (KPI) по каждому уровню",
        ],
      },
      {
        text: "Старт внедрения Битрикс 24 с нуля",
        details: [
          "Регистрация портала и базовая настройка",
          "Проектирование воронок под бизнес-процессы",
        ],
      },
      {
        text: "Составление структуры отдела продаж",
        details: [
          "Роли, этапы воронки и регламенты работы",
          "Расчёт нужного штата под план продаж",
        ],
      },
    ],
  },
  {
    num: 2,
    title: "Структура и CRM",
    price: "200 000",
    icon: Settings,
    color: "bg-cyan-500/10 text-cyan-500",
    items: [
      {
        text: "Настройка CRM Битрикс 24",
        details: [
          "Воронки, стадии, поля и карточки сделок",
          "Автоматизация задач и уведомлений",
        ],
      },
      {
        text: "Подключение всех каналов и источников в Б24",
        details: [
          "Интеграция телефонии, почты, мессенджеров и соцсетей",
          "Все заявки попадают в CRM автоматически",
        ],
      },
      {
        text: "Подключение каналов к сайту",
        details: [
          "Формы, онлайн-чат и коллтрекинг на сайте",
          "Проверка корректной передачи заявок",
        ],
      },
      {
        text: "Составление системы мотивации для отдела продаж",
        details: [
          "Оклад + процент + бонусы за выполнение KPI",
          "Прозрачная привязка дохода к результату",
        ],
      },
      {
        text: "Составление системы мотивации для производства",
        details: [
          "Мотивация за сроки, качество и объём",
          "Устранение уравниловки в оплате",
        ],
      },
      {
        text: "Составление структурного порядка на производстве",
        details: [
          "Регламенты и последовательность операций",
          "Зоны ответственности по каждому этапу",
        ],
      },
      {
        text: "Начало найма сотрудников",
        details: [
          "Профили должностей и тексты вакансий",
          "Запуск подбора по нужным ролям",
        ],
      },
      {
        text: "Распределение ролей",
        details: [
          "Закрепление зон ответственности за людьми",
          "Устранение пересечений и белых пятен",
        ],
      },
    ],
  },
  {
    num: 3,
    title: "Найм и обучение",
    price: "180 000",
    icon: Users,
    color: "bg-violet-500/10 text-violet-500",
    items: [
      {
        text: "Продолжение найма сотрудников",
        details: [
          "Собеседования и отбор кандидатов",
          "Вывод на испытательный срок",
        ],
      },
      {
        text: "Найм РОПа",
        details: [
          "Поиск и отбор руководителя отдела продаж",
          "Постановка задач и KPI для РОПа",
        ],
      },
      {
        text: "Обучение сотрудников работе с Б24",
        details: [
          "Практические тренинги по ведению сделок",
          "Контроль корректности заполнения CRM",
        ],
      },
      {
        text: "Обучение отдела продаж структурной работе",
        details: [
          "Скрипты, этапы сделки и работа с возражениями",
          "Разбор звонков и обратная связь",
        ],
      },
      {
        text: "Внедрение сквозной аналитики",
        details: [
          "Связка реклама → заявка → сделка → деньги",
          "Настройка отчётов по каналам",
        ],
      },
      {
        text: "Новые вводные по итогам месяца 1–2",
        details: [
          "Корректировка плана по фактическим данным",
          "Фиксация изменений в дорожной карте",
        ],
      },
    ],
  },
  {
    num: 4,
    title: "Аналитика и трафик",
    price: "180 000",
    icon: BarChart3,
    color: "bg-emerald-500/10 text-emerald-500",
    items: [
      {
        text: "Настройка трафика",
        details: [
          "Запуск и оптимизация каналов под юнит-экономику",
          "Перераспределение бюджета на прибыльные источники",
        ],
      },
      {
        text: "Привлечение SEO-специалиста и маркетолога",
        details: [
          "Подбор специалистов и постановка задач",
          "Интеграция в общую структуру и отчётность",
        ],
      },
      {
        text: "Проверка работы сквозной аналитики",
        details: [
          "Сверка данных по всей цепочке",
          "Устранение разрывов в передаче данных",
        ],
      },
      {
        text: "Корректировка юнит-экономики по новым данным",
        details: [
          "Пересчёт CAC, LTV и ROMI по факту",
          "Решения по каналам: масштабировать или отключить",
        ],
      },
      {
        text: "Корректировка системы мотивации",
        details: [
          "Донастройка KPI под реальные показатели",
          "Устранение перекосов в выплатах",
        ],
      },
      {
        text: "Новые вводные по итогам месяца 2–3",
        details: [
          "Обновление приоритетов и задач",
          "Фиксация в плане работ",
        ],
      },
    ],
  },
  {
    num: 5,
    title: "Оптимизация и контроль",
    price: "160 000",
    icon: Zap,
    color: "bg-amber-500/10 text-amber-500",
    items: [
      {
        text: "Контроль работы отдела продаж",
        details: [
          "Мониторинг конверсий и выполнения планов",
          "Разбор сделок и работа с отстающими",
        ],
      },
      {
        text: "Контроль работы производства",
        details: [
          "Контроль сроков, качества и загрузки",
          "Устранение узких мест",
        ],
      },
      {
        text: "Оптимизация бизнес-процессов в Б24",
        details: [
          "Автоматизация рутины и лишних действий",
          "Упрощение воронок по факту работы",
        ],
      },
      {
        text: "Анализ эффективности каналов",
        details: [
          "Ранжирование каналов по прибыли",
          "Отключение неэффективных источников",
        ],
      },
      {
        text: "Корректировка планов на квартал",
        details: [
          "Пересмотр целей под текущую динамику",
          "Обновление KPI",
        ],
      },
      {
        text: "Новые вводные по итогам месяца 3–4",
        details: [
          "Актуализация задач",
          "Фиксация в дорожной карте",
        ],
      },
    ],
  },
  {
    num: 6,
    title: "Масштабирование и итоги",
    price: "160 000",
    icon: TrendingUp,
    color: "bg-rose-500/10 text-rose-500",
    items: [
      {
        text: "Анализ результатов за 6 месяцев",
        details: [
          "Сравнение план/факт по всем метрикам",
          "Оценка роста выручки и маржи",
        ],
      },
      {
        text: "Подведение итогов по всем источникам",
        details: [
          "Итоговая эффективность каждого канала",
          "Выводы по юнит-экономике",
        ],
      },
      {
        text: "Корректировка структуры компании",
        details: [
          "Донастройка отделов и ролей под масштаб",
          "Устранение оставшихся пробелов",
        ],
      },
      {
        text: "Постановка новых целей и планов",
        details: [
          "Цели на следующий период по выручке и процессам",
          "Декомпозиция до месяцев",
        ],
      },
      {
        text: "Формирование дорожной карты на следующий период",
        details: [
          "План развития на 6–12 месяцев вперёд",
          "Приоритеты и контрольные точки",
        ],
      },
      {
        text: "Новые вводные по итогам месяца 4–5",
        details: [
          "Финальная актуализация задач",
          "Передача на внешний контроль",
        ],
      },
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
          <ul className="space-y-4">
            {month.items.map((item, i) => (
              <li key={i} className="text-sm">
                <div className="flex items-start gap-3 text-foreground font-medium">
                  <CheckCircle2 className="h-4 w-4 text-accent/60 shrink-0 mt-0.5" />
                  <span>{item.text}</span>
                </div>
                {item.details && item.details.length > 0 && (
                  <ul className="mt-1.5 ml-7 space-y-1">
                    {item.details.map((detail, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <span className="text-accent/50 leading-5">–</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                )}
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
        title="MF-Puzzle - План сопровождения"
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
            План сопровождения на 6 месяцев - от диагностики до масштабирования.
            Полное выстраивание бизнес-процессов, CRM, команды и аналитики.
          </p>
        </div>
      </section>

      {/* Overview cards */}
      <section className="py-8 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Срок</h3>
                <p className="text-sm text-muted-foreground">6 месяцев активной работы</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Video className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Формат</h3>
                <p className="text-sm text-muted-foreground">Вся работа онлайн + 2 онлайн-встречи в неделю при необходимости</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Личная встреча</h3>
                <p className="text-sm text-muted-foreground">1 личная встреча по субботам в офисе или на производстве компании</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">После</h3>
                <p className="text-sm text-muted-foreground">Внешний контроль - 100 000 ₽/мес</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Plan - 6 months */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">
              План работ
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              6 месяцев - от фундамента до результата
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Каждый месяц предусматривает появление новых вводных - как из предыдущих этапов,
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
                      Месяц {m.num} - {m.title}
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
                Когда система выстроена и работает - я остаюсь на внешнем контроле.
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
              Вы платите один раз за построение системы - и дальше платите только за то,
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
