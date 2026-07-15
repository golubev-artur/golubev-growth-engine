import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { CheckCircle2, Calendar, Users, Target, Shield, BarChart3, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ContactFormModal from "@/components/ContactFormModal";

const weeks = [
  {
    num: 1,
    title: "Аудит июня + NDA + продолжение найма",
    goal: "Честно проверить что из июня работает, что провисло. Запустить подписание NDA. Закрыть вопрос с новым сотрудником.",
    blocks: [
      {
        title: "Аудит итогов июня",
        items: [
          "Прослушивание 3–5 звонков каждого менеджера",
          "Проверка переписки в Битрикс24 за последние 2 недели",
          "Скорость ответа по журналу CRM",
          "CRM: входящие зафиксированы, нет зависших сделок, заполнены поля",
          "Продажи: план/факт, конверсия, динамика vs май",
          "Работа Анны как РОПа: контроль, планёрки, обратная связь",
          "Сводный документ аудита на 1–2 страницы",
        ],
      },
      {
        title: "Запуск NDA",
        items: [
          "NDA с каждым сотрудником (менеджеры, офис-менеджер, Анна)",
          "Шаблон NDA для подрядчиков",
          "Соглашение о неконкуренции для менеджеров по продажам",
          "Задачи на подписание в Битрикс24 с дедлайном",
        ],
      },
      {
        title: "Найм - финальная стадия",
        items: [
          "Финальное собеседование / корректировка каналов",
          "Оффер и план адаптации на 4 недели",
          "Адаптация: продукт → наставник → самостоятельно → план",
        ],
      },
    ],
  },
  {
    num: 2,
    title: "Продолжение обучения + контроль качества",
    goal: "На основе аудита - точечное дообучение. Контроль качества становится системным.",
    blocks: [
      {
        title: "Точечное дообучение",
        items: [
          "По каждому менеджеру - 1–2 зоны роста",
          "Звонки: разбор записей, проигрывание сценариев",
          "CRM: индивидуальный разбор карточек, чек-лист самопроверки",
          "Переписка: разбор реальных переписок, 5 шаблонов",
          "Сессии по 30–45 минут, 1–2 в неделю",
          "Все материалы в базе знаний Битрикс24",
        ],
      },
      {
        title: "Системный контроль качества",
        items: [
          "Анна: 3–5 звонков/неделю по чек-листу",
          "Проверка CRM: зависшие сделки, незакрытые задачи",
          "Проверка скорости ответа: 3–5 входящих/неделю",
          "Короткий отчёт Анны → моя обратная связь",
          "Цель: к концу июля Анна ведёт контроль самостоятельно",
        ],
      },
    ],
  },
  {
    num: 3,
    title: "Работа с подрядчиками + продуктовая аналитика",
    goal: "Структурировать подрядчиков. Определить популярные и маржинальные услуги.",
    blocks: [
      {
        title: "Подрядчики",
        items: [
          "Полный список всех текущих и прошлых подрядчиков",
          "Оценка: сроки, качество, цены, гибкость, риски",
          "Категории: основные / резервные / под замену",
          "NDA с активными подрядчиками",
          "Без подписанного NDA - новые заказы не передаём",
        ],
      },
      {
        title: "Матрица услуг",
        items: [
          "Данные за 3 месяца: популярность × маржинальность",
          "Себестоимость каждой услуги",
          "Высокомаржинальные → обучить менеджеров продавать",
          "Низкомаржинальные популярные → масштабировать объём",
          "Скорректированные приоритеты в продажах",
        ],
      },
    ],
  },
  {
    num: 4,
    title: "ABC-анализ клиентов + итоги + план на август",
    goal: "Структурировать клиентскую базу. Подвести итоги. Согласовать план на август.",
    blocks: [
      {
        title: "ABC-анализ клиентов",
        items: [
          "Данные по всем клиентам за 12 месяцев из CRM",
          "Категория A (20% = 80% выручки): персональная ответственность, укрепление",
          "Категория B (потенциал роста): допродажа маржинальных услуг",
          "Категория C (мелкие/разовые): самообслуживание или скрипт допродажи",
          "Таблица в Битрикс24 с распределением по A/B/C",
        ],
      },
      {
        title: "Итоги и план",
        items: [
          "Сводный отчёт по всем блокам: найм, обучение, качество, NDA",
          "Динамика стандартов: июнь vs июль",
          "План на август согласован до 17 июля",
        ],
      },
    ],
  },
];

const results = [
  { before: "Результаты июня не проверены", after: "Аудит проведён, слабые места устранены" },
  { before: "NDA не подписаны", after: "NDA подписаны со всеми сотрудниками и подрядчиками" },
  { before: "Обучение завершено, закрепление не проверено", after: "Дообучение проведено точечно, качество растёт" },
  { before: "Контроль качества на мне", after: "Анна ведёт контроль самостоятельно" },
  { before: "Список подрядчиков не структурирован", after: "Подрядчики оценены и категоризированы" },
  { before: "Услуги продаём интуитивно", after: "Матрица услуг: популярные и маржинальные определены" },
  { before: "Клиентская база не сегментирована", after: "ABC-анализ готов, приоритеты расставлены" },
  { before: "Новый сотрудник не адаптирован", after: "Сотрудник прошёл адаптацию и работает" },
  { before: "Евгения в операционке", after: "Евгения на стратегическом уровне" },
];

const juneResults = [
  { before: "Мотивация не презентована", after: "Мотивация запущена" },
  { before: "Стандартов не было", after: "Стандарты внедрены" },
  { before: "Обучение не проводилось", after: "Обучение проведено" },
  { before: "CRM заполнялась хаотично", after: "CRM по стандарту" },
  { before: "Евгения контролировала всё", after: "Анна взяла часть функций РОПа" },
  { before: "Подбор в начальной стадии", after: "Кандидат найден / поиск скорректирован" },
];

const ClientTerritoriaReklamy = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);

  return (
    <Layout>
      <Seo
        title="План работ - Территория рекламы"
        description="План работ на июль для типографии «Территория рекламы» от Голубев Консалтинг"
        path="/client/territoria-reklamy"
        noIndex
      />
      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} defaultDirection="Продажи и CRM" sourceItem="Страница клиента: Территория рекламы" />

      {/* Hero */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Персональный план</p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] mb-4">
            План работ на июль
          </h1>
          <p className="text-primary-foreground/80 text-xl mb-2">
            Типография «Территория рекламы»
          </p>
          <p className="text-primary-foreground/50 text-base max-w-2xl">
            Месяц 4 - качество, порядок и продуктовая работа. Аудит июня, контроль качества, NDA, найм, подрядчики и продуктовая аналитика.
          </p>
        </div>
      </section>

      {/* Команда */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <Users className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Команда</h3>
                <p className="text-sm text-muted-foreground">
                  Евгения (собственник/РОП), Анна (опердир), 2 менеджера, 1 офис-менеджер + новый сотрудник (адаптация)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-accent shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Формат работы</h3>
                <p className="text-sm text-muted-foreground">
                  Удалённо, созвон по пятницам 60 мин (30/20/10), все задачи в Битрикс24. Очный визит: 1 раз в июле.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Принцип июля */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-semibold mb-6">
              <Target className="h-4 w-4" />
              Принцип июля
            </div>
            <p className="text-muted-foreground leading-relaxed">
              Месяц 1 - инфраструктура. Месяц 2 - упаковка. Месяц 3 - люди и стандарты.
              <strong className="text-foreground"> Месяц 4 - качество, порядок и продуктовая работа.</strong>
            </p>
            <p className="text-muted-foreground mt-3 leading-relaxed">
              Июль - первый месяц когда система должна работать без ручного управления. Проверяем всё что внедрили, закрываем юридические хвосты, доводим найм, начинаем работать с подрядчиками и собираем данные по продукту.
            </p>
          </div>
        </div>
      </section>

      {/* Что сделано в июне */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8 text-center">
            Что сделано в июне
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {juneResults.map((r, i) => (
              <div key={i} className="border border-border rounded-lg p-4 bg-background">
                <p className="text-sm text-muted-foreground line-through mb-2">{r.before}</p>
                <p className="text-sm font-semibold text-accent flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                  {r.after}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Понедельный план */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10 text-center">
            План работ по неделям
          </h2>
          <div className="space-y-6 max-w-4xl mx-auto">
            {weeks.map((week) => {
              const isOpen = expandedWeek === week.num;
              return (
                <div key={week.num} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
                  <button
                    onClick={() => setExpandedWeek(isOpen ? null : week.num)}
                    className="w-full flex items-center gap-4 p-6 text-left hover:bg-accent/5 transition-colors"
                  >
                    <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-accent/10 text-accent font-bold text-lg shrink-0">
                      {week.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-foreground text-lg">Неделя {week.num}. {week.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{week.goal}</p>
                    </div>
                    <ArrowRight className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-6 space-y-5 border-t border-border pt-5">
                      {week.blocks.map((block, bi) => (
                        <div key={bi}>
                          <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                            <BarChart3 className="h-4 w-4 text-accent" />
                            {block.title}
                          </h4>
                          <ul className="space-y-2">
                            {block.items.map((item, ii) => (
                              <li key={ii} className="flex items-start gap-3 text-sm text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-accent/60 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-border">
                        <p className="text-sm text-muted-foreground flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          <span>
                            <strong>Пятница - созвон 60 мин:</strong> 30 мин Евгения + Анна, 20 мин мой блок, 10 мин задачи в Битрикс24
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Итоги июля - До/После */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10 text-center">
            Ожидаемые итоги июля
          </h2>
          <div className="max-w-3xl mx-auto space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-lg border border-border bg-background">
                <Shield className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-muted-foreground line-through">{r.before}</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{r.after}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
            Готовы обсудить детали?
          </h2>
          <p className="text-primary-foreground/60 mb-8 max-w-lg mx-auto">
            Свяжитесь с нами для уточнения плана или записи на консультацию
          </p>
          <Button
            size="lg"
            className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
            onClick={() => setFormOpen(true)}
          >
            Записаться на консультацию
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default ClientTerritoriaReklamy;
