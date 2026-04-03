import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { trackEvent } from "@/lib/analytics";
import { scrollToSection } from "@/lib/scrollToSection";
import collectionPortraits from "@/assets/collection-portraits.webp";
import collectionIcons from "@/assets/collection-icons.webp";

const collections = [
  {
    title: "Ritratti Personalizzati",
    desc: "Il tuo volto nell'eternità. Commissioni su misura, dall'idea alla scultura finita.",
    image: collectionPortraits,
    cta: "Commissiona ora",
    anchor: "contatti",
  },
  {
    title: "Icone Contemporanee",
    desc: "Personaggi storici reinterpretati con estetica moderna. Tiratura limitata, numerata e firmata.",
    image: collectionIcons,
    cta: "Esplora la collezione",
    anchor: "galleria",
  },
];

export const CollectionsSection = () => {
  const scrollTo = (anchor: string) => {
    trackEvent("section_view", { section: anchor });
    scrollToSection(anchor);
  };

  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-16">
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
              Edizioni limitate. Opere uniche.
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              COLLEZIONI
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {collections.map((col, i) => (
            <AnimateOnScroll key={col.title} delay={i * 200}>
              <div
                className="group relative rounded-2xl overflow-hidden cursor-pointer border border-transparent hover:border-gold/40 transition-all duration-500"
                style={{ height: "500px", boxShadow: "0 28px 60px rgba(0,0,0,0.7)" }}
                onClick={() => scrollTo(col.anchor)}
              >
                <img
                  src={col.image}
                  alt={col.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />

                <div
                  className="absolute inset-0 flex flex-col justify-end p-8 transition-all duration-300"
                  style={{
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.90) 0%, rgba(0,0,0,0.3) 50%, transparent 100%)",
                  }}
                >
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-3">
                    {col.title}
                  </h3>

                  <p className="text-muted-foreground font-body mb-6 max-w-sm text-sm leading-relaxed">
                    {col.desc}
                  </p>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollTo(col.anchor);
                    }}
                    className="self-start px-6 py-3 rounded-full text-sm font-semibold font-body gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover"
                    style={{ color: "#000" }}
                  >
                    {col.cta}
                  </button>
                </div>

                <div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ boxShadow: "inset 0 0 0 1px rgba(212,175,55,0.4)" }}
                />
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};