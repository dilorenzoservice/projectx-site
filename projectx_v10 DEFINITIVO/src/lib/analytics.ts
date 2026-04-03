declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

// GA_ID da variabile env — cambia in .env senza toccare il codice
const GA_ID = import.meta.env.VITE_GA_ID || "G-QW5MDF7XTV";

let analyticsLoaded = false;
let scrollTrackingInitialized = false;

export const initAnalytics = () => {
  const consent = localStorage.getItem("cookie-consent");

  if (consent !== "accepted") return;
  if (analyticsLoaded) return;
  if (!GA_ID) return;

  analyticsLoaded = true;

  if (!document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_ID}"]`)) {
    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    script.async = true;
    document.head.appendChild(script);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function (...args: unknown[]) {
      window.dataLayer!.push(args);
    };

  window.gtag("js", new Date());

  window.gtag("config", GA_ID, {
    send_page_view: false,
    anonymize_ip: true,
    cookie_flags: "SameSite=None;Secure",
  });

  initScrollDepthTracking();

  import("./webVitals")
    .then(({ initWebVitals }) => initWebVitals())
    .catch(() => {});
};

const initScrollDepthTracking = () => {
  // Flag garantisce che il listener venga aggiunto una sola volta per sessione
  // Il listener è intenzionalmente persistente (lifetime = sessione browser)
  if (scrollTrackingInitialized) return;
  scrollTrackingInitialized = true;

  const milestones = [25, 50, 75, 90];
  const reached = new Set<number>();

  const handleScroll = () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (total <= 0) return;

    const pct = Math.round((scrolled / total) * 100);

    milestones.forEach((m) => {
      if (pct >= m && !reached.has(m)) {
        reached.add(m);
        trackEvent("scroll_depth", { percent: String(m) });
      }
    });
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
};

export const trackEvent = (
  eventName: string,
  params?: Record<string, string>
) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }
};

export const trackPageView = (pagePath: string, pageTitle?: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", "page_view", {
      page_title: pageTitle || document.title,
      page_path: pagePath,
      page_location: window.location.href,
    });
  }
};

export const trackCTA = (name: string) =>
  trackEvent("cta_click", { cta_name: name });

export const trackSection = (section: string) =>
  trackEvent("section_view", { section });

export const trackSocial = (platform: string) =>
  trackEvent("social_click", { platform });

export const trackGallery = (categoria: string) =>
  trackEvent("gallery_view", { opera_categoria: categoria });

export const trackForm = () =>
  trackEvent("form_submit", { form_type: "contatti" });
