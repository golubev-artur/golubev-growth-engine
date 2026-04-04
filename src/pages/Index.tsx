import Layout from "@/components/Layout";
import Seo from "@/components/Seo";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";

const Index = () => (
  <Layout>
    <Seo path="/" />
    <HeroSection />
    <ServicesSection />
    <AboutSection />
    <ContactSection />
  </Layout>
);

export default Index;
