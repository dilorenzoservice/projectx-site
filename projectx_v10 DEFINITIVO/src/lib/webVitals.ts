// Web Vitals — monitora CLS, LCP, FID, INP, TTFB
// Invia i dati a GA4 per tracking performance reale
// Documentazione: https://web.dev/vitals/

type MetricName = "CLS" | "LCP" | "FID" | "INP" | "TTFB";

interface Metric {
  name: MetricName;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
}

// Invia metrica a GA4
const sendToAnalytics = (metric: Metric) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;

  window.gtag("event", "web_vitals", {
    metric_name: metric.name,
    metric_value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
    metric_rating: metric.rating,
    non_interaction: true,
  });
};

// Carica e inizializza web-vitals (libreria leggera ~1KB)
export const initWebVitals = async () => {
  try {
    // Importazione dinamica — non blocca il caricamento della pagina
    const { onCLS, onFID, onLCP, onINP, onTTFB } = await import("web-vitals");
    onCLS(sendToAnalytics);
    onFID(sendToAnalytics);
    onLCP(sendToAnalytics);
    onINP(sendToAnalytics);
    onTTFB(sendToAnalytics);
  } catch {
    // web-vitals non disponibile — nessun crash
    if (import.meta.env.DEV) console.warn("web-vitals non disponibile");
  }
};
