import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";

const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Press = lazy(() => import("./pages/Press"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const Presentation = lazy(() => import("./pages/Presentation"));
const Booking = lazy(() => import("./pages/Booking"));
const ClientMfPuzzle = lazy(() => import("./pages/ClientMfPuzzle"));
const ClientPortal = lazy(() => import("./pages/ClientPortal"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/press" element={<Press />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/presentation" element={<Presentation />} />
            <Route path="/forma" element={<Booking />} />
            <Route path="/client/mf-puzzle" element={<ClientMfPuzzle />} />
            <Route path="/client/:slug" element={<ClientPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
