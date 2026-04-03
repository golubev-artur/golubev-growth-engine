import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import ContactFormModal from "./ContactFormModal";

interface Message {
  role: "bot" | "user";
  text: string;
  showCta?: boolean;
}

const FAQ: { keywords: string[]; answer: string }[] = [
  {
    keywords: ["цена", "стоимость", "сколько стоит", "прайс", "тариф", "бюджет"],
    answer: "Стоимость зависит от масштаба проекта и выбранных направлений. Стратегическая сессия — от 150 000 руб. Комплексный консалтинг — от 300 000 руб./мес. Для точной оценки предлагаю обсудить детали вашего проекта.",
  },
  {
    keywords: ["срок", "сколько времени", "длительность", "как долго", "когда результат"],
    answer: "Первые результаты видны через 1-3 месяца. Стратегическая сессия занимает 1-2 дня. Комплексный проект по одному направлению — 2-4 месяца. Полная трансформация бизнес-процессов — 6-12 месяцев.",
  },
  {
    keywords: ["crm", "срм", "продажи", "воронка", "лиды"],
    answer: "Мы помогаем выстроить систему продаж: аудит, воронка, CRM-внедрение, скрипты и обучение менеджеров. Средний рост конверсии — 35-50% за 3 месяца. Работаем с Bitrix24, amoCRM и другими платформами.",
  },
  {
    keywords: ["маркетинг", "реклама", "трафик", "seo", "контент"],
    answer: "Направление «Маркетинг» включает: стратегию, анализ аудитории, настройку аналитики, контент-план и performance-маркетинг. Помогаем выстроить системный маркетинг с измеримыми результатами.",
  },
  {
    keywords: ["автоматизация", "процесс", "бизнес-процесс", "оптимизация", "регламент"],
    answer: "Автоматизируем рутину и выстраиваем процессы: картирование, регламенты, интеграции между системами, BI-отчётность. В среднем экономим команде 20-30% рабочего времени.",
  },
  {
    keywords: ["персонал", "команда", "hr", "сотрудник", "найм", "удержание", "мотивация"],
    answer: "Направление «Персонал и команда»: система найма, оценка и развитие, корпоративная культура, программы удержания ключевых сотрудников. Снижаем текучесть на 25-40%.",
  },
  {
    keywords: ["стратег", "сессия", "планирование", "цели", "okr"],
    answer: "Стратегическая сессия — это 1-2 дня интенсивной работы с командой лидеров. Результат: согласованные цели, приоритеты на квартал/год, дорожная карта и распределение ответственности.",
  },
  {
    keywords: ["клиент", "сервис", "nps", "лояльность", "отзыв", "жалоба"],
    answer: "Направление «Клиентский сервис»: customer journey, стандарты обслуживания, NPS-система, программы лояльности. Помогаем превратить клиентов в адвокатов бренда.",
  },
  {
    keywords: ["ии", "ai", "искусственный интеллект", "нейросет", "gpt", "технолог"],
    answer: "Внедряем ИИ-инструменты в бизнес-процессы: AI-скоринг лидов, анализ звонков, генерация контента, предиктивная аналитика. Экономия 2-5 часов в день на сотрудника.",
  },
  {
    keywords: ["кто", "артур", "голубев", "опыт", "компания", "о вас"],
    answer: "Golubev Consulting — это системный консалтинг от Артура Голубева. 12+ лет опыта, 150+ проектов, 87 клиентов. 8 направлений: от продаж до автоматизации. Каждый проект — индивидуальный подход.",
  },
  {
    keywords: ["формат", "онлайн", "офлайн", "удалённо", "город", "москва"],
    answer: "Работаем в гибридном формате: стратегические сессии — очно или онлайн, регулярное сопровождение — онлайн с еженедельными встречами. География не ограничена.",
  },
  {
    keywords: ["гарантия", "результат", "кейс", "пример", "отзыв клиент"],
    answer: "Мы работаем на результат и фиксируем KPI в договоре. Более 150 успешных проектов. Средний ROI наших клиентов — x3-x5 от инвестиций в консалтинг за первый год.",
  },
];

const GREETING: Message = {
  role: "bot",
  text: "Здравствуйте! Я AI-ассистент Golubev Consulting. Задайте вопрос о наших услугах, ценах, сроках — или нажмите кнопку ниже, чтобы обсудить ваш проект.",
  showCta: true,
};

function findAnswer(input: string): string {
  const lower = input.toLowerCase();
  for (const faq of FAQ) {
    if (faq.keywords.some((kw) => lower.includes(kw))) {
      return faq.answer;
    }
  }
  return "Хороший вопрос! Для точного ответа предлагаю обсудить детали с нашим экспертом. Нажмите «Обсудить детали» — и мы свяжемся с вами.";
}

const AiChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([GREETING]);
  const [input, setInput] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [unansweredCount, setUnansweredCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setInput("");

    const userMsg: Message = { role: "user", text };
    const answer = findAnswer(text);
    const isDefault = answer.includes("Нажмите «Обсудить детали»");

    const newCount = isDefault ? unansweredCount + 1 : 0;
    setUnansweredCount(newCount);

    const botMsg: Message = {
      role: "bot",
      text: newCount >= 2
        ? "Похоже, ваш вопрос требует индивидуального подхода. Рекомендую обсудить детали напрямую с нашим экспертом — это бесплатно и ни к чему не обязывает."
        : answer,
      showCta: isDefault || newCount >= 2,
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <>
      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} />

      {/* Floating button */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:bg-accent/90 active:scale-95 transition-all flex items-center justify-center"
          aria-label="Открыть чат"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[360px] max-w-[calc(100vw-2rem)] h-[520px] max-h-[calc(100vh-3rem)] bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold">AI Ассистент</p>
                <p className="text-xs opacity-60">Golubev Consulting</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-primary-foreground/50 hover:text-primary-foreground transition-colors">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div key={i}>
                <div className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-accent text-white rounded-br-md"
                        : "bg-card text-foreground border border-border rounded-bl-md"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
                {msg.showCta && msg.role === "bot" && (
                  <div className="mt-2 ml-1">
                    <Button
                      size="sm"
                      className="bg-accent text-white hover:bg-accent/90 text-xs"
                      onClick={() => setFormOpen(true)}
                    >
                      Обсудить детали
                      <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border bg-card">
            <form
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Задайте вопрос..."
                className="bg-background text-sm"
              />
              <Button type="submit" size="icon" className="bg-accent text-white hover:bg-accent/90 shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default AiChatWidget;
