import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Send, X } from "lucide-react";
import { sendToTelegram } from "@/lib/telegram";

const directions = [
  "Продажи и CRM",
  "Бизнес-процессы",
  "Маркетинг",
  "Управление и стратегия",
  "Персонал и команда",
  "Технологии и автоматизация",
  "Клиентский сервис",
  "Стратегическая сессия",
];

interface ContactFormModalProps {
  open: boolean;
  onClose: () => void;
  defaultDirection?: string;
}

const ContactFormModal = ({ open, onClose, defaultDirection }: ContactFormModalProps) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const form = e.target as HTMLFormElement;
    const data = Object.fromEntries(new FormData(form));
    await sendToTelegram({
      name: data.name as string,
      phone: data.phone as string,
      email: data.email as string,
      direction: data.direction as string,
      message: data.message as string,
      source: `Модальная форма — ${window.location.pathname}`,
    });
    setLoading(false);
    toast({
      title: "Заявка отправлена",
      description: "Мы свяжемся с вами в ближайшее время.",
    });
    form.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-background rounded-2xl shadow-2xl w-full max-w-lg p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center mb-6">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-2">Контакты</p>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight mb-2">
            Обсудим ваш проект
          </h2>
          <p className="text-muted-foreground text-sm">
            Заполните форму — мы свяжемся с вами в течение рабочего дня.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid sm:grid-cols-2 gap-3">
            <Input name="name" placeholder="Имя" required className="bg-card" />
            <Input name="phone" placeholder="Телефон" type="tel" required className="bg-card" />
          </div>
          <Input name="email" placeholder="Email" type="email" className="bg-card" />
          <Select name="direction" defaultValue={defaultDirection}>
            <SelectTrigger className="bg-card">
              <SelectValue placeholder="Интересующее направление" />
            </SelectTrigger>
            <SelectContent>
              {directions.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea name="message" placeholder="Расскажите о задаче" rows={3} className="bg-card resize-none" />
          <Button
            type="submit"
            size="lg"
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 active:scale-[0.97] transition-all"
            disabled={loading}
          >
            {loading ? "Отправка..." : (
              <>
                Отправить заявку
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactFormModal;
