import { ChevronDown } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { trackCTA } from "@/lib/analytics";
import { useSiteContentBatch } from "@/hooks/useSiteContent";
import { scrollToSection } from "@/lib/scrollToSection";
import heroBust from "@/assets/hero-bust.webp";

export const HeroSection = () => {
  const content = useSiteContentBatch([
    { key: "hero_eyebrow", fallback: "Arte · Storia · Tecnologia" },
    {
      key: "hero_titolo",
      fallback: "Il Passato Non Scompare. Si Trasforma.",
    },
    {
      key: "hero_sottotitolo",
      fallback:
        "Busti artistici in resina effetto marmo — creati con stampa 3D 8K e rifiniti a mano. Pezzi unici. Made in Italy.",
    },
  ]);

  const scrollToGallery = () => {
    scrollToSection("galleria");
  };

  const scrollToContact = () => {
    trackCTA("commissiona_busto");
    scrollToSection("contatti");
  };

  const titleParts = content.hero_titolo.split(". ");
  const titleFirst =
    titleParts.length > 1 ? `${titleParts.slice(0, -1).join(". ")}. ` : "";
  const titleLast = titleParts[titleParts.length - 1];

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0">
        <img
          src={heroBust}
          alt="Busto artistico ProjectX"
          className="w-full h-full object-cover"
          fetchPriority="high"
          loading="eager"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.85))",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-[1240px] mx-auto px-6 text-center">
        <AnimateOnScroll>
          <p className="text-sm md:text-base font-body font-medium tracking-[0.35em] uppercase text-gold mb-8">
            {content.hero_eyebrow}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-semibold leading-[1.1] tracking-[-0.01em] mb-8 text-foreground max-w-4xl mx-auto">
            {titleFirst}
            <span className="gold-text">{titleLast}</span>
          </h1>
        </AnimateOnScroll>

        <AnimateOnScroll delay={400}>
          <p className="text-base md:text-lg text-muted-foreground font-body font-normal tracking-[0.01em] max-w-2xl mx-auto mb-12 leading-relaxed">
            {content.hero_sottotitolo}
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={600}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover font-body"
              style={{ color: "#000" }}
            >
              Commissiona il tuo Busto
            </button>

            <button
              onClick={scrollToGallery}
              className="px-8 py-4 rounded-full font-medium text-sm border backdrop-blur-[10px] transition-all duration-200 hover:-translate-y-0.5 hover:border-white/40 font-body text-foreground"
              style={{
                background: "rgba(0,0,0,0.55)",
                borderColor: "rgba(255,255,255,0.22)",
              }}
            >
              Esplora la Collezione
            </button>
          </div>
        </AnimateOnScroll>
      </div>

      <div
        onClick={scrollToGallery}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float-arrow cursor-pointer"
        aria-label="Scorri verso la galleria"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            scrollToGallery();
          }
        }}
      >
        <ChevronDown className="w-8 h-8 text-gold opacity-60" />
      </div>
    </section>
  );
};