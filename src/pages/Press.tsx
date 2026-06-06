import { useEffect } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { Link } from "react-router-dom";
import { FileText, Download, Mail, Phone, Newspaper, Mic, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const pressReleases = [
  {
    date: "15 апреля 2025",
    title: "Голубев Консалтинг: более 150 проектов за 12 лет — итоги и планы на 2025 год",
    tag: "Пресс-релиз",
    excerpt: "Компания подводит итоги работы и анонсирует запуск нового направления — аудита CRM и автоматизации для МСБ.",
  },
  {
    date: "28 февраля 2025",
    title: "Исследование: 67% собственников МСБ не знают, откуда приходят их клиенты",
    tag: "Исследование",
    excerpt: "Голубев Консалтинг опросил 200 предпринимателей о состоянии маркетинговой аналитики в малом и среднем бизнесе.",
  },
  {
    date: "10 января 2025",
    title: "Как системный консалтинг помогает бизнесу расти в условиях нестабильности",
    tag: "Комментарий",
    excerpt: "Артур Голубев о трендах консалтинга в 2025 году: автоматизация, OKR и работа с командой в новых условиях.",
  },
  {
    date: "5 ноября 2024",
    title: "Голубев Консалтинг запускает программу ретейнера для МСБ",
    tag: "Пресс-релиз",
    excerpt: "Новый формат работы: постоянный бизнес-партнёр на ежемесячной основе — трекинг OKR, антикризисная поддержка и аудит CRM.",
  },
];

const mediaAppearances = [
  { outlet: "РБК", type: "Интервью", title: "Как малому бизнесу выстроить систему продаж без найма большой команды", year: "2024" },
  { outlet: "Forbes Russia", type: "Колонка", title: "5 признаков того, что ваш бизнес застрял — и как из этого выйти", year: "2024" },
  { outlet: "Деловой Петербург", type: "Интервью", title: "OKR в малом бизнесе: зачем и как внедрять", year: "2023" },
  { outlet: "vc.ru", type: "Статья", title: "Почему CRM не работает в 80% компаний — разбор типичных ошибок", year: "2023" },
  { outlet: "Коммерсантъ", type: "Комментарий", title: "Рынок консалтинга для МСБ: тренды и вызовы", year: "2023" },
  { outlet: "Podcast «Бизнес по-русски»", type: "Подкаст", title: "Системный подход к росту бизнеса — разговор с Артуром Голубевым", year: "2024" },
];

const mediaKitItems = [
  { icon: FileText, label: "Пресс-кит (PDF)", desc: "Биография, фото, факты о компании" },
  { icon: Download, label: "Фото эксперта", desc: "Профессиональные снимки в hi-res" },
  { icon: BookOpen, label: "Fact sheet", desc: "Ключевые цифры и факты о компании" },
];

const Press = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      <Seo
        path="/press"
        title="Для СМИ — Голубев Консалтинг"
        description="Пресс-материалы, пресс-релизы, публикации и контакты пресс-службы Голубев Консалтинг."
      />

      {/* Hero */}
      <section className="bg-primary py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Для СМИ</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4 text-wrap-balance">
            Пресс-центр
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-xl">
            Пресс-релизы, публикации, медиа-кит и контакты для запроса комментариев и интервью.
          </p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a
              href="mailto:press@golubev-consulting.ru"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
            >
              <Mail className="h-4 w-4" />
              press@golubev-consulting.ru
            </a>
            <a
              href="tel:+79261692114"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-foreground/10 text-primary-foreground text-sm font-medium hover:bg-primary-foreground/20 transition-colors"
            >
              <Phone className="h-4 w-4" />
              +7 (926) 169-21-14
            </a>
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl font-bold text-foreground mb-8">Медиа-кит</h2>
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl">
            {mediaKitItems.map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background hover:border-accent/40 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-center w-9 h-9 rounded-md bg-accent/10 text-accent shrink-0">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">{item.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Для получения материалов напишите на{" "}
            <a href="mailto:press@golubev-consulting.ru" className="text-accent hover:underline">
              press@golubev-consulting.ru
            </a>
          </p>
        </div>
      </section>

      {/* Press Releases */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Newspaper className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Пресс-релизы и материалы</h2>
          </div>
          <div className="space-y-4 max-w-3xl">
            {pressReleases.map((pr, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card hover:border-accent/40 transition-all group cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/10 text-accent">{pr.tag}</span>
                  <span className="text-xs text-muted-foreground">{pr.date}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-accent transition-colors mb-1.5 leading-snug">
                  {pr.title}
                </h3>
                <p className="text-sm text-muted-foreground">{pr.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Media Appearances */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-2 mb-8">
            <Mic className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold text-foreground">Упоминания в СМИ</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {mediaAppearances.map((item, i) => (
              <div key={i} className="p-4 rounded-xl border border-border bg-background hover:border-accent/40 hover:shadow-sm transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-foreground">{item.outlet}</span>
                  <span className="text-xs text-muted-foreground">{item.year}</span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground mb-2 inline-block">
                  {item.type}
                </span>
                <p className="text-sm text-muted-foreground leading-snug group-hover:text-foreground transition-colors">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Expert Topics */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <h2 className="text-2xl font-bold text-foreground mb-6">Темы для комментариев</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              "Построение систем продаж в МСБ",
              "CRM и автоматизация бизнес-процессов",
              "OKR и стратегическое планирование",
              "Управление командой и HR в МСБ",
              "Маркетинг и аналитика для малого бизнеса",
              "Антикризисный менеджмент",
              "Клиентский сервис и NPS",
              "Системный подход к росту бизнеса",
            ].map((topic, i) => (
              <div key={i} className="flex items-center gap-2.5 p-3 rounded-lg border border-border bg-card">
                <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm text-foreground">{topic}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 p-6 rounded-2xl bg-accent/5 border border-accent/20">
            <h3 className="font-semibold text-foreground mb-2">Запрос интервью или комментария</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Отвечаем на запросы СМИ в течение 1 рабочего дня. Доступны очные и дистанционные форматы.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:press@golubev-consulting.ru"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                Написать в пресс-службу
              </a>
              <a
                href="tel:+79261692114"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-foreground text-sm font-medium hover:border-accent/40 transition-colors"
              >
                <Phone className="h-3.5 w-3.5" />
                +7 (926) 169-21-14
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Press;
