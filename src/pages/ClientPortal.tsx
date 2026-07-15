import { useParams, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import { getClientData } from "@/data/clientsData";
import {
  CheckCircle2, Calendar, Users, Target, Shield, BarChart3,
  ArrowRight, Clock, FileText, Lightbulb, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef, useCallback } from "react";
import { Link2 } from "lucide-react";
import ContactFormModal from "@/components/ContactFormModal";
import type { MonthlyGoal, Protocol } from "@/types/client";

const monthNames: Record<string, string> = {
  "01": "январь", "02": "февраль", "03": "март", "04": "апрель",
  "05": "май", "06": "июнь", "07": "июль", "08": "август",
  "09": "сентябрь", "10": "октябрь", "11": "ноябрь", "12": "декабрь",
};

const formatDate = (dateStr: string) => {
  const [y, m, d] = dateStr.split("-");
  return `${parseInt(d)} ${monthNames[m] || m} ${y}`;
};

const formatMonth = (monthStr: string) => {
  const [y, m] = monthStr.split("-");
  return `${monthNames[m] || m} ${y}`;
};

const copyLink = (hash: string) => {
  const url = `${window.location.origin}${window.location.pathname}#${hash}`;
  navigator.clipboard.writeText(url);
};

const ProtocolCard = ({ protocol, defaultOpen }: { protocol: Protocol; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const ref = useRef<HTMLDivElement>(null);
  const anchor = protocol.id;

  useEffect(() => {
    if (defaultOpen && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [defaultOpen]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) window.history.replaceState(null, "", `#${anchor}`);
    else window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div ref={ref} id={anchor} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/5 transition-colors"
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-blue-500/10 text-blue-500 shrink-0">
          <FileText className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">Протокол от {formatDate(protocol.date)}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {protocol.participants.map(p => p.name).join(", ")}
          </p>
        </div>
        <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-5 border-t border-border pt-5">
          <button
            onClick={() => copyLink(anchor)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <Link2 className="h-3.5 w-3.5" />
            Скопировать ссылку
          </button>
          {protocol.participants.map((p, pi) => (
            <div key={pi}>
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-accent" />
                {p.name}
              </h4>
              <ul className="space-y-2">
                {p.tasks.map((task, ti) => (
                  <li key={ti} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent/60 shrink-0 mt-0.5" />
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {protocol.tips && protocol.tips.length > 0 && (
            <div className="pt-3 border-t border-border">
              <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-yellow-500" />
                Рекомендации
              </h4>
              <ul className="space-y-2">
                {protocol.tips.map((tip, ti) => (
                  <li key={ti} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <ArrowRight className="h-4 w-4 text-yellow-500/60 shrink-0 mt-0.5" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const GoalCard = ({ goal, defaultOpen }: { goal: MonthlyGoal; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen || false);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [showPrev, setShowPrev] = useState(false);
  const [showExpected, setShowExpected] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const anchor = goal.id;

  useEffect(() => {
    if (defaultOpen && ref.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    }
  }, [defaultOpen]);

  const toggle = () => {
    const next = !open;
    setOpen(next);
    if (next) window.history.replaceState(null, "", `#${anchor}`);
    else window.history.replaceState(null, "", window.location.pathname);
  };

  return (
    <div ref={ref} id={anchor} className="border border-border rounded-xl bg-card shadow-sm overflow-hidden">
      <button
        onClick={toggle}
        className="w-full flex items-center gap-4 p-5 text-left hover:bg-accent/5 transition-colors"
      >
        <span className="flex items-center justify-center w-11 h-11 rounded-xl bg-accent/10 text-accent shrink-0">
          <Target className="h-5 w-5" />
        </span>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground">{goal.title}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            {goal.subtitle || formatMonth(goal.month)}
          </p>
        </div>
        <span className="text-xs text-muted-foreground shrink-0 mr-2">{goal.weeks.length} нед.</span>
        <ChevronDown className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 space-y-6 border-t border-border pt-5">
          <button
            onClick={() => copyLink(anchor)}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors"
          >
            <Link2 className="h-3.5 w-3.5" />
            Скопировать ссылку
          </button>
          {/* Principle */}
          {goal.principle && (
            <div className="text-center p-4 rounded-lg bg-accent/5 border border-accent/10">
              <p className="text-sm text-muted-foreground leading-relaxed">
                {goal.principle}
                {goal.principleHighlight && (
                  <strong className="text-foreground"> {goal.principleHighlight}</strong>
                )}
              </p>
              {goal.description && (
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{goal.description}</p>
              )}
            </div>
          )}

          {/* Previous results */}
          {goal.previousResults && goal.previousResults.length > 0 && (
            <div>
              <button
                onClick={() => setShowPrev(!showPrev)}
                className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 hover:text-accent transition-colors"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showPrev ? "rotate-180" : ""}`} />
                Что сделано ранее
              </button>
              {showPrev && (
                <div className="grid md:grid-cols-2 gap-3">
                  {goal.previousResults.map((r, i) => (
                    <div key={i} className="border border-border rounded-lg p-3 bg-background">
                      <p className="text-xs text-muted-foreground line-through mb-1.5">{r.before}</p>
                      <p className="text-xs font-semibold text-accent flex items-start gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                        {r.after}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Weekly plan */}
          <div className="space-y-3">
            {goal.weeks.map((week) => {
              const isWeekOpen = expandedWeek === week.num;
              return (
                <div key={week.num} className="border border-border rounded-lg overflow-hidden bg-background">
                  <button
                    onClick={() => setExpandedWeek(isWeekOpen ? null : week.num)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-accent/5 transition-colors"
                  >
                    <span className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent/10 text-accent font-bold text-sm shrink-0">
                      {week.num}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-foreground text-sm">Неделя {week.num}. {week.title}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{week.goal}</p>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform ${isWeekOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isWeekOpen && (
                    <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                      {week.blocks.map((block, bi) => (
                        <div key={bi}>
                          <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2 text-sm">
                            <BarChart3 className="h-3.5 w-3.5 text-accent" />
                            {block.title}
                          </h5>
                          <ul className="space-y-1.5">
                            {block.items.map((item, ii) => (
                              <li key={ii} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent/60 shrink-0 mt-0.5" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                      <div className="pt-3 border-t border-border">
                        <p className="text-xs text-muted-foreground flex items-start gap-2">
                          <Calendar className="h-3.5 w-3.5 text-accent shrink-0 mt-0.5" />
                          <span>
                            <strong>Пятница - созвон 60 мин:</strong> 30 мин собственник + опердир, 20 мин консультант, 10 мин задачи
                          </span>
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Expected results */}
          {goal.expectedResults && goal.expectedResults.length > 0 && (
            <div>
              <button
                onClick={() => setShowExpected(!showExpected)}
                className="flex items-center gap-2 text-sm font-bold text-foreground mb-3 hover:text-accent transition-colors"
              >
                <ChevronDown className={`h-4 w-4 transition-transform ${showExpected ? "rotate-180" : ""}`} />
                Ожидаемые итоги - {formatMonth(goal.month)}
              </button>
              {showExpected && (
                <div className="space-y-2">
                  {goal.expectedResults.map((r, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-lg border border-border bg-background">
                      <Shield className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground line-through">{r.before}</p>
                        <p className="text-xs font-semibold text-foreground mt-1">{r.after}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ClientPortal = () => {
  const { slug } = useParams<{ slug: string }>();
  const data = slug ? getClientData(slug) : undefined;
  const [formOpen, setFormOpen] = useState(false);

  const hash = window.location.hash.replace("#", "");
  const isProtocolHash = hash.startsWith("proto-");
  const isGoalHash = hash.startsWith("goal-");

  const [activeTab, setActiveTab] = useState<"goals" | "protocols">(
    isProtocolHash ? "protocols" : "goals"
  );

  if (!data) return <Navigate to="/404" replace />;

  const { client, protocols, goals } = data;
  const sortedProtocols = [...protocols].sort((a, b) => b.date.localeCompare(a.date));
  const sortedGoals = [...goals].sort((a, b) => b.month.localeCompare(a.month));

  return (
    <Layout>
      <Seo
        title={`${client.name} - Личный кабинет`}
        description={`Протоколы встреч и цели для ${client.name} от Голубев Консалтинг`}
        path={`/client/${client.slug}`}
        noIndex
      />
      <ContactFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        defaultDirection="Продажи и CRM"
        sourceItem={`Страница клиента: ${client.name}`}
      />

      {/* Hero */}
      <section className="py-16 md:py-24 bg-primary">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">
            Личный кабинет
          </p>
          <h1 className="text-3xl md:text-5xl font-extrabold text-primary-foreground tracking-tight leading-[1.08] mb-3">
            {client.name}
          </h1>
          <p className="text-primary-foreground/60 text-lg">{client.description}</p>
        </div>
      </section>

      {/* Info cards */}
      {(client.team || client.format) && (
        <section className="py-8 bg-card border-b border-border">
          <div className="container mx-auto px-4 md:px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {client.team && (
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Команда</h3>
                    <p className="text-sm text-muted-foreground">{client.team}</p>
                  </div>
                </div>
              )}
              {client.format && (
                <div className="flex items-start gap-4">
                  <Clock className="h-6 w-6 text-accent shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-foreground mb-1">Формат работы</h3>
                    <p className="text-sm text-muted-foreground">{client.format}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Tabs */}
      <section className="py-12 md:py-16 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="flex gap-2 mb-8 border-b border-border">
            <button
              onClick={() => setActiveTab("goals")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === "goals"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="h-4 w-4 inline mr-2 -mt-0.5" />
              Планы работ ({goals.length})
            </button>
            <button
              onClick={() => setActiveTab("protocols")}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors -mb-px ${
                activeTab === "protocols"
                  ? "border-accent text-accent"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2 -mt-0.5" />
              Протоколы ({protocols.length})
            </button>
          </div>

          {activeTab === "goals" && (
            <div className="space-y-4">
              {sortedGoals.map((goal) => (
                <GoalCard key={goal.id} goal={goal} defaultOpen={goal.id === hash} />
              ))}
              {goals.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Планов пока нет</p>
              )}
            </div>
          )}

          {activeTab === "protocols" && (
            <div className="space-y-4">
              {sortedProtocols.map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} defaultOpen={protocol.id === hash} />
              ))}
              {protocols.length === 0 && (
                <p className="text-center text-muted-foreground py-12">Протоколов пока нет</p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 bg-primary">
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

export default ClientPortal;
