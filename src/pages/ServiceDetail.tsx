import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import Layout from "@/components/Layout";
import { getServiceBySlug } from "@/data/services";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

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

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const chartReveal = useReveal(0.2);
  const compareReveal = useReveal(0.2);
  const itemsReveal = useReveal(0.15);

  if (!service) return <Navigate to="/services" replace />;

  const Icon = service.icon;

  const comparisonData = service.benefitsLabels.map((label, i) => ({
    name: label,
    before: service.benefitsBefore[i],
    after: service.benefitsAfter[i],
  }));

  return (
    <Layout>
      {/* Hero */}
      <section className="py-20 md:py-28 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
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

      {/* Charts */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Trend chart */}
            <div ref={chartReveal.ref} style={revealStyle(chartReveal.visible)} className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">Динамика показателей</h3>
              <p className="text-xs text-muted-foreground mb-6">Типичный рост после внедрения наших рекомендаций</p>
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={service.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(215 40% 16%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }}
                    itemStyle={{ color: "#fff" }}
                  />
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

            {/* Before/After comparison */}
            <div ref={compareReveal.ref} style={revealStyle(compareReveal.visible, 100)} className="border border-border rounded-lg p-6 bg-card shadow-sm">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-1">До и после</h3>
              <p className="text-xs text-muted-foreground mb-6">Средние результаты наших клиентов, %</p>
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={comparisonData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 20% 92%)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "hsl(215 14% 46%)" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(215 40% 16%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 13 }}
                    itemStyle={{ color: "#fff" }}
                  />
                  <Bar dataKey="before" name="До" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {comparisonData.map((_, i) => (
                      <Cell key={i} fill={ACCENT_LIGHT} fillOpacity={0.35} />
                    ))}
                  </Bar>
                  <Bar dataKey="after" name="После" radius={[4, 4, 0, 0]} maxBarSize={32}>
                    {comparisonData.map((_, i) => (
                      <Cell key={i} fill={ACCENT_HSL} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ACCENT_LIGHT, opacity: 0.35 }} /> До</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm" style={{ backgroundColor: ACCENT_HSL }} /> После</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service items */}
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
              onClick={() => {
                window.location.href = "/#contact";
              }}
            >
              Обсудить проект
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ServiceDetail;
