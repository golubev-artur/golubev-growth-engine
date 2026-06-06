import { useState, useEffect, useRef } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { generalFaqs } from "@/data/faq";

const categories = ["Все", "Общее", "Стоимость", "Результаты", "Процесс"];

// На главной показываем первые N вопросов из выбранной категории, остальные скрыты
const PREVIEW_COUNT = 5;

interface FaqSectionProps {
  /** false = главная (5 вопросов + «показать все»), true = отдельная страница (все сразу) */
  showAll?: boolean;
}

const FaqSection = ({ showAll = false }: FaqSectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Все");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Сбрасываем раскрытие при смене категории
  const handleCategory = (cat: string) => {
    setActiveCategory(cat);
    setOpenIndex(null);
    setExpanded(false);
  };

  const filtered = activeCategory === "Все"
    ? generalFaqs
    : generalFaqs.filter((f) => f.category === activeCategory);

  const shown = (showAll || expanded) ? filtered : filtered.slice(0, PREVIEW_COUNT);
  const hasMore = !showAll && !expanded && filtered.length > PREVIEW_COUNT;
  const canCollapse = !showAll && expanded;

  return (
    <section id="faq" className="py-24 md:py-32 bg-background">
      <div
        ref={ref}
        className="container mx-auto px-4 md:px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3 text-center">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 text-center text-wrap-balance">
            Частые вопросы
          </h2>
          <p className="text-muted-foreground text-center mb-10">
            Ответы на вопросы, которые нам задают чаще всего
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat
                    ? "bg-accent text-accent-foreground shadow-sm"
                    : "bg-card text-muted-foreground hover:bg-accent/10 hover:text-accent border border-border"
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-xs ${activeCategory === cat ? "opacity-70" : "opacity-50"}`}>
                  {cat === "Все" ? generalFaqs.length : generalFaqs.filter(f => f.category === cat).length}
                </span>
              </button>
            ))}
          </div>

          {/* Accordion */}
          <div className="space-y-2">
            {shown.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={faq.question}
                  className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
                    isOpen ? "border-accent/40 bg-accent/5" : "border-border bg-card"
                  }`}
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(8px)",
                    transition: `opacity 400ms ${80 + i * 40}ms ease, transform 400ms ${80 + i * 40}ms ease`,
                  }}
                >
                  <button
                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                  >
                    <span className={`font-medium text-sm md:text-base leading-snug ${isOpen ? "text-accent" : "text-foreground"}`}>
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180 text-accent" : ""}`}
                    />
                  </button>
                  <div
                    className="overflow-hidden transition-all duration-300"
                    style={{ maxHeight: isOpen ? "400px" : "0px" }}
                  >
                    <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer buttons */}
          {(hasMore || canCollapse || !showAll) && (
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
              {hasMore && (
                <button
                  onClick={() => { setExpanded(true); setOpenIndex(null); }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:border-accent/40 hover:text-accent transition-all"
                >
                  <ChevronDown className="h-4 w-4" />
                  Показать ещё {filtered.length - PREVIEW_COUNT}
                </button>
              )}
              {canCollapse && (
                <button
                  onClick={() => { setExpanded(false); setOpenIndex(null); }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-border bg-card text-sm font-medium text-muted-foreground hover:border-accent/40 hover:text-accent transition-all"
                >
                  <ChevronDown className="h-4 w-4 rotate-180" />
                  Свернуть
                </button>
              )}
              {!showAll && (
                <Link
                  to="/faq"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
                >
                  Все вопросы на отдельной странице <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default FaqSection;
