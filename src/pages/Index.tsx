import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => (
  <Layout>
    <Seo
        path="/"
        title="ГОЛУБЕВ КОНСАЛТИНГ — Системный консалтинг для бизнеса"
        description="Системный консалтинг для малого и среднего бизнеса: продажи, CRM, маркетинг, бизнес-процессы, управление, HR и автоматизация. 12+ лет опыта, 100+ проектов."
      />
    <HeroSection />
    <ServicesSection />
    <AboutSection />
    <ContactSection />
  </Layout>
);

export default Index;
