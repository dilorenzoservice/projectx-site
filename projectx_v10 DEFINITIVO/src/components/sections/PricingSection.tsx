import { useEffect, useState } from "react";
import { Clock, Check } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scrollToSection";
import bustoMini from "@/assets/busto-mini.webp";
import bustoStandard from "@/assets/busto-standard.webp";
import bustoPremium from "@/assets/busto-premium.webp";

const imageMap: Record<string, string> = {
  mini: bustoMini,
  standard: bustoStandard,
  premium: bustoPremium,
};

const pianoLabels: Record<string, string> = {
  mini: "MINI",
  standard: "STANDARD",
  premium: "PREMIUM",
};

const pianoDetails: Record<string, { tempi: string; include: string[] }> = {
  mini: {
    tempi: "7-10 giorni lavorativi",
    include: [
      "Modellazione 3D",
      "Anteprima render",
      "Stampa 8K",
      "Rifinitura a mano",
      "Spedizione tracciata",
    ],
  },
  standard: {
    tempi: "10-14 giorni lavorativi",
    include: [
      "Modellazione 3D avanzata",
      "Anteprima render + revisioni",
      "Stampa 8K premium",
      "Rifinitura e carteggiatura",
      "Packaging protettivo",
      "Spedizione tracciata",
    ],
  },
  premium: {
    tempi: "14-21 giorni lavorativi",
    include: [
      "Modellazione 3D alta fedeltà",
      "Anteprima render + revisioni illimitate",
      "Stampa 8K massima risoluzione",
      "Rifinitura artigianale completa",
      "Piedistallo incluso",
      "Packaging premium con certificato",
      "Spedizione assicurata",
    ],
  },
};

const defaultPlans = [
  {
    piano: "mini",
    prezzo_base: 0,
    dimensione: "~15cm",
    descrizione: "Ideale per scrivania o regalo",
    badge_consigliato: false,
    visibile: true,
  },
  {
    piano: "standard",
    prezzo_base: 0,
    dimensione: "~25cm",
    descrizione: "La misura classica da esposizione",
    badge_consigliato: true,
    visibile: true,
  },
  {
    piano: "premium",
    prezzo_base: 0,
    dimensione: "~35cm+",
    descrizione: "Opera da collezione, su piedistallo",
    badge_consigliato: false,
    visibile: true,
  },
];

interface PriceData {
  piano: string;
  prezzo_base: number;
  dimensione: string;
  descrizione: string;
  badge_consigliato: boolean;
  visibile: boolean;
}

const PricingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[...Array(3)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl p-8 animate-pulse"
        style={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.06)",
          minHeight: "520px",
        }}
      >
        <div
          className="w-28 h-28 rounded-xl mx-auto mb-6"
          style={{ background: "rgba(212,175,55,0.08)" }}
        />
        <div
          className="h-5 rounded mx-auto mb-3 w-24"
          style={{ background: "rgba(255,255,255,0.07)" }}
        />
        <div
          className="h-3 rounded mx-auto mb-8 w-32"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
        <div className="space-y-2 mb-6">
          {[...Array(4)].map((_, j) => (
            <div
              key={j}
              className="h-3 rounded w-full"
              style={{ background: "rgba(255,255,255,0.04)" }}
            />
          ))}
        </div>
        <div
          className="h-10 rounded-full w-full"
          style={{ background: "rgba(255,255,255,0.05)" }}
        />
      </div>
    ))}
  </div>
);

export const PricingSection = () => {
  const [plans, setPlans] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("prezzi")
      .select(
        "piano, prezzo_base, dimensione, descrizione, badge_consigliato, visibile"
      )
      .eq("visibile", true)
      .order("id")
      .then(({ data }) => {
        setPlans(data && data.length > 0 ? data : defaultPlans);
        setLoading(false);
      });
  }, []);

  const scrollToContact = () => {
    trackEvent("cta_click", { cta_name: "richiedi_preventivo" });
    scrollToSection("contatti");
  };

  return (
    <section id="prezzi" className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
              Ogni opera è unica. Ogni prezzo è onesto.
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[0.02em] text-foreground">
              PREZZI
            </h2>
          </div>
        </AnimateOnScroll>

        {loading ? (
          <PricingSkeleton />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => {
              const details = pianoDetails[plan.piano] ?? {
                tempi: "Tempi da definire",
                include: ["Dettagli disponibili su richiesta"],
              };
              const imageSrc = imageMap[plan.piano] ?? bustoStandard;
              const label = pianoLabels[plan.piano] ?? plan.piano.toUpperCase();

              return (
                <AnimateOnScroll key={plan.piano} delay={i * 150}>
                  <div
                    className={`relative rounded-2xl p-8 glass-panel flex flex-col transition-all duration-300 hover:-translate-y-1 ${
                      plan.badge_consigliato ? "ring-1 ring-gold/40" : ""
                    }`}
                    style={
                      plan.badge_consigliato
                        ? { borderColor: "hsl(43 72% 52%)" }
                        : {}
                    }
                  >
                    {plan.badge_consigliato && (
                      <div
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-body font-bold gold-gradient"
                        style={{ color: "#000" }}
                      >
                        PIÙ RICHIESTO
                      </div>
                    )}

                    <div className="text-center mb-6">
                      <img
                        src={imageSrc}
                        alt={label}
                        className="w-28 h-28 mx-auto object-contain mb-4"
                        loading="lazy"
                      />
                      <h3 className="font-display text-xl font-semibold tracking-[0.02em] text-foreground mb-1">
                        {label}
                      </h3>
                      <p className="text-sm text-muted-foreground font-body">
                        {plan.dimensione}
                      </p>
                      <p className="text-sm text-muted-foreground font-body">
                        {plan.descrizione}
                      </p>
                    </div>

                    <div
                      className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl"
                      style={{
                        background: "rgba(212,175,55,0.07)",
                        border: "1px solid rgba(212,175,55,0.15)",
                      }}
                    >
                      <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                      <span className="text-xs font-body text-gold">
                        {details.tempi}
                      </span>
                    </div>

                    <ul className="space-y-2 mb-6 flex-1">
                      {details.include.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-2 text-xs font-body text-muted-foreground"
                        >
                          <Check className="w-3.5 h-3.5 text-gold flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>

                    <p className="font-display text-2xl font-semibold tracking-[0.02em] text-gold text-center mb-6">
                      {plan.prezzo_base > 0
                        ? `a partire da €${plan.prezzo_base}`
                        : "Preventivo su richiesta"}
                    </p>

                    <button
                      onClick={scrollToContact}
                      className={`w-full py-3 rounded-full text-sm font-semibold font-body transition-all duration-200 hover:-translate-y-0.5 ${
                        plan.badge_consigliato
                          ? "gold-gradient gold-glow gold-glow-hover"
                          : "border hover:border-gold/50"
                      }`}
                      style={
                        plan.badge_consigliato
                          ? { color: "#000" }
                          : {
                              borderColor: "rgba(255,255,255,0.22)",
                              color: "hsl(0 0% 96%)",
                              background: "rgba(0,0,0,0.55)",
                            }
                      }
                    >
                      Richiedi Preventivo
                    </button>
                  </div>
                </AnimateOnScroll>
              );
            })}
          </div>
        )}

        <AnimateOnScroll delay={200}>
          <p className="text-center text-xs text-muted-foreground font-body mt-8 max-w-2xl mx-auto">
            * I prezzi variano in base alla complessità del soggetto e alle
            finiture richieste. Ogni preventivo è personalizzato e include
            anteprima 3D gratuita.
          </p>
        </AnimateOnScroll>
      </div>
    </section>
  );
};