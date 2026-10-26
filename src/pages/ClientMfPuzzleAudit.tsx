import { useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink } from "lucide-react";

// Отчёт по итогам аудита маркетплейсов для MF-Puzzle.
// Страница закрыта от поисковиков (noIndex) - это персональный документ клиента.

const DONE = [
  {
    title: "Все магазины заведены в систему",
    note: "Личный кабинет:",
    link: { href: "https://seller.mpprofit.ru", label: "seller.mpprofit.ru" },
  },
  {
    title: "Себестоимость редактируется прямо из системы",
    note: "Раздел хранения:",
    link: { href: "https://seller.mpprofit.ru/storage/net", label: "seller.mpprofit.ru/storage/net" },
  },
  {
    title: "Дополнительные затраты по компании",
    note: "Заводятся отдельно в разделе «Финансы → Операции». Вносить нужно на конкретный день внутри нужного периода месяца.",
  },
  {
    title: "Корректировка работы товара",
    note: "Выполняется в разделе юнит-экономики:",
    link: {
      href: "https://seller.mpprofit.ru/analytics/unit-economic",
      label: "seller.mpprofit.ru/analytics/unit-economic",
    },
  },
];

const TODO = [
  {
    title: "Вносить каждую позицию затрат отдельно",
    note: "Аренда, ФОТ и прочие расходы - отдельными строками, а не одной общей суммой.",
  },
  {
    title: "Добавить налог за пришедшие деньги",
    note: "Налог с маркетплейса не считать - он уже учтён в системе.",
  },
  {
    title: "Решить вопрос с пунктом «займ»",
    note: "Без этого точные затраты по проекту учесть не получится.",
  },
  {
    title: "Посчитать себестоимость товара, который продаётся через магазин, отдельно",
    note: "И вычесть её из пришедших денег.",
  },
];

const BLOCKING = [
  {
    title: "Поднять стоимость товара по острым позициям",
    note: "Список таких позиций формируется в отчёте системы mpprofit. Это первоочередная задача.",
  },
  {
    title: "Пока стоимость товаров на маркетплейсе не поправлена - продажами не заниматься",
    note: "Ограничение действует либо на конкретные острые позиции, либо на весь магазин маркетплейса - в зависимости от того, насколько широко расхождение.",
  },
];

const ClientMfPuzzleAudit = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <Layout>
      <Seo
        title="MF-Puzzle - Аудит маркетплейсов"
        description="Отчёт по итогам аудита маркетплейсов для MF-Puzzle: что сделано, что требуется от клиента и какие действия заблокированы до устранения замечаний."
        path="/client/mf-puzzle/audit"
        noIndex
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <Link
            to="/client/mf-puzzle"
            className="inline-flex items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground text-sm mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />К плану сопровождения
          </Link>
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Отчёт по проекту
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] mb-4">
            Аудит маркетплейсов
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-2xl mb-8">
            Проведён аудит площадок, все магазины и товары заведены в единую систему mpprofit.
            Ниже - что уже сделано, что требуется от вас и какие действия заблокированы
            до устранения замечаний.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/15 border border-accent/30 text-accent text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-accent" />
              Внедрение завершено
            </span>
            <a
              href="https://seller.mpprofit.ru"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-foreground/5 border border-primary-foreground/15 text-primary-foreground/80 hover:text-primary-foreground hover:border-primary-foreground/30 text-sm font-medium transition-colors"
            >
              Система: seller.mpprofit.ru
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </section>

      {/* 1. Что сделано */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold shrink-0">
              1
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Что сделано</h2>
          </div>
          <p className="text-muted-foreground mb-8 ml-10">
            Четыре точки входа, через которые теперь управляется учёт.
          </p>

          <ol className="rounded-2xl border border-border bg-card divide-y divide-border overflow-hidden">
            {DONE.map((item, i) => (
              <li key={i} className="flex gap-4 p-5 md:p-6">
                <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-muted text-muted-foreground text-sm font-bold shrink-0">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground mb-1">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.note}{" "}
                    {item.link && (
                      <a
                        href={item.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:underline break-words"
                      >
                        {item.link.label}
                      </a>
                    )}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 2. Что нужно сделать вам */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-accent/10 text-accent text-xs font-bold shrink-0">
              2
            </span>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Что нужно сделать вам</h2>
          </div>
          <p className="text-muted-foreground mb-8 ml-10">
            Четыре шага, чтобы данные в системе отражали реальную экономику.
          </p>

          <ul className="grid sm:grid-cols-2 gap-4">
            {TODO.map((item, i) => (
              <li key={i} className="flex gap-4 p-5 rounded-xl border border-border bg-background">
                <CheckCircle2 className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-foreground mb-1 leading-snug">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3. Блокирующее условие */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 md:p-8">
            <div className="flex items-baseline gap-3 mb-6">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-destructive/15 text-destructive shrink-0">
                <AlertTriangle className="h-4 w-4" />
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Важно: блокирующее условие
              </h2>
            </div>

            <ul className="space-y-5">
              {BLOCKING.map((item, i) => (
                <li key={i} className="flex gap-4">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-destructive text-destructive-foreground text-xs font-bold shrink-0 mt-0.5">
                    !
                  </span>
                  <div>
                    <p className="font-semibold text-foreground mb-1">{item.title}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.note}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-muted-foreground mt-8 pt-6 border-t border-border flex flex-wrap justify-between gap-2">
            <span>Отчёт подготовлен по итогам аудита маркетплейсов</span>
            <span>mpprofit</span>
          </p>
        </div>
      </section>
    </Layout>
  );
};

export default ClientMfPuzzleAudit;
