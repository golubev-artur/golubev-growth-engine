import { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AiChatWidget from "@/components/AiChatWidget";

const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen bg-background font-sans antialiased flex flex-col">
    <Navbar />
    <main className="flex-1 pt-16">{children}</main>
    <Footer />
    <AiChatWidget />
  </div>
);

export default Layout;
