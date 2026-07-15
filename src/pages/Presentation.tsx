import { useEffect } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import PresentationGate from "@/components/PresentationGate";
import { CheckCircle2 } from "lucide-react";

const Presentation = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      <Seo
        path="/presentation"
        title="Скачать презентацию - Голубев Консалтинг"
        description="Получите полную презентацию Голубев Консалтинг: подход, услуги, кейсы и результаты. Бесплатно после заполнения формы."
      />

      {/* Hero */}
      <section className="bg-primary py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Бесплатно</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4 text-wrap-balance">
            Презентация компании
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-xl mb-8">
            10 слайдов о нашем подходе, услугах, кейсах и результатах клиентов. Заполните форму - отправим ссылку на скачивание.
          </p>
          <div className="grid sm:grid-cols-2 gap-3 max-w-xl">
            {[
              "Подход и методология работы",
              "Все 9 направлений консалтинга",
              "Реальные кейсы и цифры роста",
              "Форматы работы и стоимость",
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 text-sm text-primary-foreground/70">
                <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form */}
      <PresentationGate />
    </Layout>
  );
};

export default Presentation;
