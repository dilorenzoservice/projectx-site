import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { ScrollProgress } from "@/components/ScrollProgress";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Galleria", to: "/#galleria" },
  { label: "Prezzi", to: "/#prezzi" },
  { label: "FAQ", to: "/faq" },
  { label: "Chi Siamo", to: "/chi-siamo" },
  { label: "Contatti", to: "/#contatti" },
];

const NotFound = () => (
  <>
    <ScrollProgress />
    <Header />
    <main className="min-h-screen flex items-center justify-center px-6 pt-24">
      <div className="max-w-2xl mx-auto text-center">

        <div
          className="inline-block font-display text-8xl md:text-9xl font-bold mb-6"
          style={{
            background: "linear-gradient(135deg,#F9E79F,#D4AF37 45%,#B8860B)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          404
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-5">
          Pagina non trovata
        </h1>

        <p className="font-display italic text-lg text-muted-foreground mb-2 leading-relaxed">
          «Nulla è eterno se non ciò che scegli di rendere tale.»
        </p>
        <p className="text-sm text-muted-foreground font-body mb-10">
          Forse il percorso è cambiato, ma l'opera resta.
        </p>

        {/* CTA principali */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link to="/"
            className="px-8 py-4 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover font-body"
            style={{ color: "#000" }}>
            Torna alla Home
          </Link>
          <Link to="/#galleria"
            className="px-8 py-4 rounded-full font-medium text-sm border backdrop-blur-[10px] transition-all duration-200 hover:-translate-y-0.5 font-body text-foreground hover:border-gold/50"
            style={{ background: "rgba(0,0,0,0.55)", borderColor: "rgba(255,255,255,0.22)" }}>
            Vai alla Galleria
          </Link>
        </div>

        {/* Link rapidi contestuali */}
        <div
          className="rounded-2xl p-6 border"
          style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}
        >
          <p className="text-xs text-muted-foreground font-body uppercase tracking-wider mb-4">
            Forse stavi cercando
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {quickLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="px-4 py-2 rounded-full text-sm font-body transition-all duration-200 hover:text-gold hover:border-gold/40"
                style={{
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "hsl(40 8% 75%)",
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

      </div>
    </main>
  </>
);

export default NotFound;
