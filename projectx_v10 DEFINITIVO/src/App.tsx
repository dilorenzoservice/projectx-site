import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthGuard } from "@/components/admin/AuthGuard";
import { scrollToSection } from "@/lib/scrollToSection";

import Index from "./pages/Index";
import ChiSiamo from "./pages/ChiSiamo";
import FAQ from "./pages/FAQ";
import Social from "./pages/Social";
import Privacy from "./pages/Privacy";
import Termini from "./pages/Termini";
import CookiePolicy from "./pages/CookiePolicy";
import ArtworkDetailPage from "./pages/ArtworkDetailPage";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";

// Tutte le pagine admin in lazy — non caricate dagli utenti pubblici
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminMessaggi = lazy(() => import("./pages/admin/AdminMessaggi"));
const AdminPrezzi = lazy(() => import("./pages/admin/AdminPrezzi"));
const AdminGalleria = lazy(() => import("./pages/admin/AdminGalleria"));
const AdminContenuti = lazy(() => import("./pages/admin/AdminContenuti"));
const AdminImpostazioni = lazy(() => import("./pages/admin/AdminImpostazioni"));
const AdminRecensioni = lazy(() => import("./pages/admin/AdminRecensioni"));

const queryClient = new QueryClient();

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const id = hash.replace("#", "");
      const timer = window.setTimeout(() => {
        scrollToSection(id);
      }, 120);
      return () => window.clearTimeout(timer);
    }
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_title: document.title,
        page_path: location.pathname + location.search + location.hash,
        page_location: window.location.href,
      });
    }
  }, [location]);

  return null;
};

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center text-gold font-body">
    Caricamento...
  </div>
);

// Wrapper che applica AuthGuard + Suspense alle pagine admin protette
const AdminRoute = ({ element }: { element: ReactNode }) => (
  <AuthGuard>
    <Suspense fallback={<LoadingScreen />}>{element}</Suspense>
  </AuthGuard>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ErrorBoundary>
      <TooltipProvider>
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <AnalyticsTracker />

          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Index />} />

              {/* PAGINA OPERA DINAMICA */}
              <Route path="/opera/:slug" element={<ArtworkDetailPage />} />

              {/* PAGINE INFO */}
              <Route path="/chi-siamo" element={<ChiSiamo />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/social" element={<Social />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/termini" element={<Termini />} />
              <Route path="/cookie-policy" element={<CookiePolicy />} />

              {/* ADMIN — login pubblico, tutto il resto protetto da AuthGuard */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
              <Route path="/admin/messaggi" element={<AdminRoute element={<AdminMessaggi />} />} />
              <Route path="/admin/prezzi" element={<AdminRoute element={<AdminPrezzi />} />} />
              <Route path="/admin/galleria" element={<AdminRoute element={<AdminGalleria />} />} />
              <Route path="/admin/contenuti" element={<AdminRoute element={<AdminContenuti />} />} />
              <Route path="/admin/impostazioni" element={<AdminRoute element={<AdminImpostazioni />} />} />
              <Route path="/admin/recensioni" element={<AdminRoute element={<AdminRecensioni />} />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </ErrorBoundary>
  </QueryClientProvider>
);

export default App;
