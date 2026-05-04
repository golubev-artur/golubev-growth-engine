import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { getServiceBySlug, services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ContactFormModal from "@/components/ContactFormModal";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

import arthurOffice1 from "@/assets/arthur-office-1.jpg";
import arthurOffice2 from "@/assets/arthur-office-2.jpg";
import arthurOffice4 from "@/assets/arthur-office-4.jpg";
import arthurOffice5 from "@/assets/arthur-office-5.jpg";
import serviceStrategySession from "@/assets/service-strategy-session.jpg";

const serviceImages: Record<string, string> = {
  "sales-crm": arthurOffice1,
  "business-processes": arthurOffice2,
  "marketing": arthurOffice4,
  "management-strategy": arthurOffice1,
  "hr-team": arthurOffice5,
  "tech-automation": arthurOffice4,
  "client-service": arthurOffice2,
  "strategic-session": serviceStrategySession,
};

const useReveal = (threshold = 0.15) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
};

const revealStyle = (visible: boolean, delay = 0) => ({
  opacity: visible ? 1 : 0,
  transform: visible ? "translateY(0)" : "translateY(16px)",
  filter: visible ? "blur(0)" : "blur(3px)",
  transition: `opacity 600ms ${delay}ms cubic-bezier(0.16,1,0.3,1), transform 600ms ${delay}ms cubic-bezier(0.16,1,0.3,1), filter 600ms ${delay}ms cubic-bezier(0.16,1,0.3,1)`,
});

const ACCENT_HSL = "hsl(205 78% 50%)";
const ACCENT_LIGHT = "hsl(205 78% 70%)";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const service = getServiceBySlug(slug || "");

  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const chartReveal = useReveal(0.2);
  const compareReveal = useReveal(0.2);
  const itemsReveal = useReveal(0.15);

  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;
  const heroImage = serviceImages[service.slug] || arthurOffice1;

  const comparisonData = service.benefitsLabels.map((label, i) => ({
    name: label,
    before: service.benefitsBefore[i],
    after: service.benefitsAfter[i],
  }));

  return (
    <Layout>
      <Seo
        title={service.title}
        description={service.description}
        path={`/services/${service.slug}`}
        breadcrumbs={[
          { name: "Услуги", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        service={{ title: service.title, description: service.description }}
        faqs={service.faqs}
      />
      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} defaultDirection={service.title} />
      <section className="relative py-20 md:py-28 bg-primary overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroImage} alt="" loading="lazy" className="w-full h-full object-cover object-top opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-primary/80" />
        </div>
        <div className="container mx-auto px-4 md:px-8 relative">
          <Link to="/services" className="inline-flex items-center gap-1 text-sm text-primary-foreground/50 hover:text-accent transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" /> Все услуги
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <span className="flex items-center justify-center w-12 h-12 rounded-lg bg-accent/15 text-accent">
              <Icon className="h-6 w-6" />
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08]">
              {service.title}
            </h1>
          </div>
          <p className="text-primary-foreground/60 text-lg max-w-2xl mt-2">{service.description}</p>
        </div>
      </section>

      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex items-center gap-6">
            <img src={heroImage} alt={`Артур Голубев — эксперт по направлению «${service.title}», ГОЛУБЕВ КОНСАЛТИНГ`} loading="lazy" className="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover shadow-lg" />
            <div>
              <p className="text-sm text-muted-foreground uppercase tracking-wider mb-1">Ваш эксперт</p>
              <p className="text-lg font-bold text-foreground">Артур Голубев</p>
              <p className="text-sm text-muted-foreground mt-1">Основатель Голубев КОНСАЛТИНГ · 12+ лет в консалтинге</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            <div ref={chartReveal.ref} style={revealStyle(chartReveal.visible)} className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Динамика показателей</h3>
              <p className="text-xs text-muted-foreground mb-6">Типичный рост после внедрения наших рекомендаций</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={service.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(215 40% 16%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} itemStyle={{ color: "#fff" }} />
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={ACCENT_HSL} stopOpacity={0.3} />
                      <stop offset="100%" stopColor={ACCENT_HSL} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="value" stroke={ACCENT_HSL} strokeWidth={2.5} fill="url(#areaGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div ref={compareReveal.ref} style={revealStyle(compareReveal.visible, 100)} className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">До и после</h3>
              <p className="text-xs text-muted-foreground mb-6">Средние результаты наших клиентов, %</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparisonData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(215 40% 16%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }} itemStyle={{ color: "#fff" }} />
                  <Bar dataKey="before" name="До" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {comparisonData.map((_, i) => <Cell key={i} fill={ACCENT_LIGHT} fillOpacity={0.35} />)}
                  </Bar>
                  <Bar dataKey="after" name="После" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {comparisonData.map((_, i) => <Cell key={i} fill={ACCENT_HSL} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ACCENT_LIGHT, opacity: 0.35 }} /> До</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ACCENT_HSL }} /> После</span>
              </div>
            </div>
          </div>

          {/* Description under charts */}
          <div className="mt-10 grid lg:grid-cols-2 gap-8">
            <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-3">Описание методологии</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Графики отражают типичную динамику ключевых показателей наших клиентов. Данные собраны на основе более чем 100 проектов за последние 5 лет. Мы используем проверенные методологии и адаптируем подход под специфику каждой компании, что позволяет достигать устойчивых результатов уже в первые 3-6 месяцев сотрудничества.
              </p>
            </div>
            <div className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-lg font-bold text-foreground mb-3">Обучение команды</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {service.trainingDescription}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-8" ref={itemsReveal.ref}>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-10">Что входит в направление</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {service.items.map((item, i) => (
              <div
                key={i}
                className="flex gap-4 p-5 rounded-lg border border-border bg-background shadow-sm"
                style={revealStyle(itemsReveal.visible, 60 + i * 60)}
              >
                <CheckCircle2 className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <h4 className="font-semibold text-foreground text-sm">{item.name}</h4>
                  <p className="text-muted-foreground text-sm mt-1">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
              onClick={() => setFormOpen(true)}
            >
              Обсудить проект
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">Частые вопросы</h2>
          <Accordion type="single" collapsible className="space-y-3">
            {service.faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border border-border rounded-lg bg-card px-6">
                <AccordionTrigger className="text-left font-semibold text-foreground hover:text-accent transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Related services */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-8">Другие направления</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(() => {
              const idx = services.findIndex((s) => s.slug === service.slug);
              const others = services.filter((s) => s.slug !== service.slug);
              return Array.from({ length: 3 }, (_, i) => others[(idx + i * 2 + 1) % others.length])
                .filter((s, i, arr) => arr.findIndex((a) => a.slug === s.slug) === i);
            })()
              .map((related) => {
                const RelIcon = related.icon;
                return (
                  <Link
                    key={related.slug}
                    to={`/services/${related.slug}`}
                    className="group flex gap-4 p-5 rounded-xl border border-border bg-card hover:border-accent/30 hover:shadow-md transition-all"
                  >
                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/10 text-accent shrink-0">
                      <RelIcon className="h-5 w-5" />
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-accent transition-colors">
                        {related.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{related.shortDesc}</p>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
