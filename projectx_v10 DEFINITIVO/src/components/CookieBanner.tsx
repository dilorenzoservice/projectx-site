import { useState, useEffect } from "react";
import { initAnalytics } from "@/lib/analytics";

export const CookieBanner = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const pref = localStorage.getItem("cookie-consent");
    if (!pref) setVisible(true);
    else if (pref === "accepted") initAnalytics();
  }, []);

  const handleChoice = (accepted: boolean) => {
    localStorage.setItem("cookie-consent", accepted ? "accepted" : "rejected");
    setVisible(false);
    if (accepted) initAnalytics();
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[9998] backdrop-blur-xl border-t"
      style={{
        background: "rgba(0,0,0,0.92)",
        borderTopColor: "hsl(43 72% 52% / 0.3)",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground font-body text-center sm:text-left">
          Utilizziamo cookie tecnici necessari e, con il tuo consenso, cookie analitici per migliorare il sito.{" "}
          <a href="/cookie-policy" className="text-gold underline">Leggi la Cookie Policy</a>
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => handleChoice(false)}
            className="px-6 py-2 rounded-full text-sm font-medium border transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "rgba(0,0,0,0.55)",
              borderColor: "rgba(255,255,255,0.22)",
              color: "hsl(0 0% 96%)",
              backdropFilter: "blur(10px)",
            }}
          >
            Rifiuta
          </button>
          <button
            onClick={() => handleChoice(true)}
            className="px-6 py-2 rounded-full text-sm font-semibold gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover"
            style={{ color: "#000" }}
          >
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
};
