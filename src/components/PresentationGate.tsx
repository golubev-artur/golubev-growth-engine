import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { sendToTelegram } from "@/lib/telegram";
import { getPageLabel } from "@/lib/pageLabel";
import {
  FileDown, Send, CheckCircle2, User, Phone, Mail, Building2, AlertCircle,
} from "lucide-react";

interface FieldState {
  value: string;
  touched: boolean;
  error: string;
}

const validate = {
  name: (v: string) => {
    if (!v.trim()) return "Введите имя";
    if (v.trim().length < 2) return "Имя слишком короткое";
    return "";
  },
  phone: (v: string) => {
    if (!v.trim()) return "Введите номер телефона";
    const digits = v.replace(/\D/g, "");
    if (digits.length < 10) return "Введите корректный номер";
    return "";
  },
  email: (v: string) => {
    if (!v.trim()) return "Введите email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Некорректный email";
    return "";
  },
  company: (v: string) => {
    if (!v.trim()) return "Введите название компании";
    return "";
  },
};

const PresentationGate = () => {
  const { toast } = useToast();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [fields, setFields] = useState<Record<string, FieldState>>({
    name: { value: "", touched: false, error: "" },
    phone: { value: "", touched: false, error: "" },
    email: { value: "", touched: false, error: "" },
    company: { value: "", touched: false, error: "" },
  });

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

  const update = (name: string, value: string) => {
    const error = validate[name as keyof typeof validate]?.(value) ?? "";
    setFields((prev) => ({
      ...prev,
      [name]: { value, touched: true, error },
    }));
  };

  const blur = (name: string) => {
    const value = fields[name].value;
    const error = validate[name as keyof typeof validate]?.(value) ?? "";
    setFields((prev) => ({
      ...prev,
      [name]: { ...prev[name], touched: true, error },
    }));
  };

  const allValid = Object.entries(fields).every(([name, f]) => {
    const err = validate[name as keyof typeof validate]?.(f.value) ?? "";
    return err === "";
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Touch all to show all errors
    const next = { ...fields };
    let hasError = false;
    for (const name of Object.keys(next)) {
      const error = validate[name as keyof typeof validate]?.(next[name].value) ?? "";
      next[name] = { ...next[name], touched: true, error };
      if (error) hasError = true;
    }
    setFields(next);
    if (hasError) return;

    setLoading(true);
    try {
      await sendToTelegram({
        name: fields.name.value,
        phone: fields.phone.value,
        email: fields.email.value,
        message: `Компания: ${fields.company.value}`,
        source: `Запрос презентации - ${getPageLabel(window.location.pathname)}`,
      });
    } catch {
      // не блокируем UX
    }
    setLoading(false);
    setSubmitted(true);
  };

  const Field = ({
    name,
    label,
    type = "text",
    icon: Icon,
    placeholder,
  }: {
    name: string;
    label: string;
    type?: string;
    icon: React.ElementType;
    placeholder: string;
  }) => {
    const f = fields[name];
    const hasError = f.touched && f.error;
    return (
      <div>
        <label className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1.5">
          <Icon className="h-3.5 w-3.5" />
          {label} <span className="text-destructive">*</span>
        </label>
        <div className="relative">
          <Input
            type={type}
            value={f.value}
            onChange={(e) => update(name, e.target.value)}
            onBlur={() => blur(name)}
            placeholder={placeholder}
            className={`bg-background transition-colors ${
              hasError
                ? "border-destructive focus-visible:ring-destructive/30"
                : f.touched && !f.error
                ? "border-green-500 focus-visible:ring-green-500/30"
                : ""
            }`}
          />
          {f.touched && !f.error && (
            <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500 pointer-events-none" />
          )}
          {hasError && (
            <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive pointer-events-none" />
          )}
        </div>
        {hasError && (
          <p className="text-xs text-destructive mt-1 flex items-center gap-1">
            {f.error}
          </p>
        )}
      </div>
    );
  };

  return (
    <section id="get-presentation" className="py-20 bg-card border-t border-border">
      <div
        ref={ref}
        className="container mx-auto px-4 md:px-8"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          transition: "opacity 600ms cubic-bezier(0.16,1,0.3,1), transform 600ms cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - description */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold mb-4">
                <FileDown className="h-3.5 w-3.5" />
                Бесплатно
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight mb-4 text-wrap-balance">
                Скачайте презентацию компании
              </h2>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Получите полную презентацию о нашем подходе, услугах, кейсах и результатах. Отправим ссылку на скачивание сразу после заполнения формы.
              </p>
              <ul className="space-y-3">
                {[
                  "10 слайдов - от проблемы до решения",
                  "Реальные кейсы и цифры роста клиентов",
                  "Все форматы работы и стоимость",
                  "Пошаговый процесс от диагностики до результата",
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Right - form / success */}
            <div className="bg-background rounded-2xl border border-border p-6 md:p-8 shadow-sm">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 mb-4">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Готово!</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Мы отправим презентацию на указанный email в течение нескольких минут.
                    Также наш менеджер свяжется с вами для краткого знакомства.
                  </p>
                  <a
                    href="/Голубев_Консалтинг_Презентация.pptx"
                    download
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors"
                  >
                    <FileDown className="h-4 w-4" />
                    Скачать презентацию
                  </a>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-foreground text-lg mb-1">Получить презентацию</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Все поля обязательны для заполнения
                  </p>
                  <form onSubmit={handleSubmit} noValidate className="space-y-4">
                    <Field name="name" label="Ваше имя" icon={User} placeholder="Иван Иванов" />
                    <Field name="phone" label="Телефон" type="tel" icon={Phone} placeholder="+7 (999) 000-00-00" />
                    <Field name="email" label="Email" type="email" icon={Mail} placeholder="ivan@company.ru" />
                    <Field name="company" label="Компания" icon={Building2} placeholder="ООО «Ваша компания»" />

                    <Button
                      type="submit"
                      size="lg"
                      className={`w-full transition-all active:scale-[0.97] ${
                        allValid
                          ? "bg-accent text-accent-foreground hover:bg-accent/90"
                          : "bg-muted text-muted-foreground cursor-not-allowed"
                      }`}
                      disabled={loading}
                    >
                      {loading ? (
                        "Отправка..."
                      ) : (
                        <>
                          Получить презентацию
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      Нажимая кнопку, вы соглашаетесь с{" "}
                      <a href="/privacy" className="text-accent hover:underline">политикой конфиденциальности</a>
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PresentationGate;
