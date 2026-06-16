import { ReactNode, useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiChatWidget from "@/components/AiChatWidget";
import CookieBanner from "@/components/CookieBanner";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Наверх"
      className={`fixed bottom-6 left-6 z-50 flex items-center justify-center w-11 h-11 rounded-full bg-accent text-white shadow-lg transition-all duration-300 hover:bg-accent/90 active:scale-90 ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
};

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
    <AiChatWidget />
    <CookieBanner />
    <ScrollToTop />
  </div>
);

export default Layout;
