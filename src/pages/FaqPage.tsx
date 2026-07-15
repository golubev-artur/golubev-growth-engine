import { useEffect } from "react";
import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import FaqSection from "@/components/FaqSection";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FaqPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <Layout>
      <Seo
        path="/faq"
        title="FAQ - Голубев Консалтинг"
        description="Ответы на частые вопросы о консалтинге, стоимости, процессе работы и результатах. Голубев Консалтинг."
      />
      <section className="bg-primary py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-accent text-sm font-semibold tracking-widest uppercase mb-3">Вопросы и ответы</p>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary-foreground tracking-tight mb-4 text-wrap-balance">
            Часто задаваемые вопросы
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-xl">
            Собрали ответы на вопросы, которые нам задают чаще всего. Не нашли ответ?
          </p>
          <Link
            to="/#contact"
            className="inline-flex items-center gap-1.5 mt-4 text-accent hover:text-accent/80 transition-colors text-sm font-medium"
          >
            Задайте вопрос напрямую <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </section>
      <FaqSection showAll />
    </Layout>
  );
};

export default FaqPage;
