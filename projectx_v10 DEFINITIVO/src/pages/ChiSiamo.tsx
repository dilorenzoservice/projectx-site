import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import collectionPortraits from "@/assets/collection-portraits.webp";

const timeline = [
  {
    year: "2025",
    title: "Nascita di ProjectX Italia",
    desc: "ProjectX Italia prende vita dall’idea di unire il fascino della storia con le possibilità della tecnologia moderna.",
  },
  {
    year: "2025",
    title: "Prime opere",
    desc: "Nascono le prime creazioni: busti e opere che reinterpretano l’estetica classica in chiave contemporanea.",
  },
  {
    year: "2025",
    title: "Ricerca e perfezionamento",
    desc: "Ogni fase viene migliorata con attenzione: modellazione, stampa 3D, materiali, finiture e presenza visiva.",
  },
  {
    year: "Oggi",
    title: "Evoluzione continua",
    desc: "Il progetto continua a crescere con la stessa visione: creare opere che lascino un segno e resistano al tempo.",
  },
];

const pillars = [
  "Nato nel 2025",
  "Creato da Ignis",
  "Progetto indipendente",
  "Storia e tecnologia",
  "Finiture a mano",
  "Made in Italy",
];

const values = [
  {
    title: "Visione personale",
    desc: "Dietro ogni opera ci sono una sola mano, una sola idea e una direzione precisa: creare qualcosa che abbia identità.",
  },
  {
    title: "Passione per la storia",
    desc: "L’ispirazione arriva dal mondo classico, dai simboli che hanno attraversato i secoli e dalla forza delle immagini che restano.",
  },
  {
    title: "Tecnologia al servizio dell’arte",
    desc: "La stampa 3D ad alta definizione non è il fine, ma lo strumento per dare forma a un’estetica curata, precisa e contemporanea.",
  },
];

const ChiSiamo = () => {
  return (
    <>
      <SEOHead
        title="Chi Siamo"
        description="ProjectX Italia nasce nel 2025 da Ignis: un progetto indipendente che unisce storia, arte classica e tecnologia per creare opere che lasciano un segno."
        canonical="https://www.projectxitalia.com/chi-siamo"
      />

      <ScrollProgress />
      <Header />

      <main className="pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll>
            <div className="text-center max-w-4xl mx-auto mb-14 md:mb-20">
              <p className="text-gold font-body text-xs tracking-[0.32em] uppercase mb-4">
                Identità · Visione · Origine
              </p>

              <h1 className="font-display text-4xl md:text-6xl font-semibold tracking-[0.02em] text-foreground leading-tight mb-6">
                Chi Siamo
              </h1>

              <p className="text-base md:text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                ProjectX Italia nasce nel 2025 da un’idea semplice ma ambiziosa:
                unire la grandezza della storia con le possibilità della
                tecnologia moderna, per creare opere che non siano solo oggetti,
                ma presenze destinate a durare.
              </p>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={120}>
            <div className="glass-panel rounded-[28px] overflow-hidden mb-10 md:mb-14">
              <img
                src={collectionPortraits}
                alt="ProjectX Italia - ispirazione tra estetica classica e tecnologia"
                className="w-full h-[260px] md:h-[420px] object-cover"
                fetchPriority="high"
              />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={180}>
            <div className="max-w-4xl mx-auto text-center mb-12 md:mb-16">
              <div className="gold-line w-20 mx-auto mb-8" />
              <blockquote className="font-display text-2xl md:text-4xl italic text-foreground leading-relaxed mb-6">
                “Non voglio solo creare oggetti belli. Voglio lasciare un segno,
                unendo il fascino del passato agli strumenti del futuro.”
              </blockquote>
              <p className="text-gold font-body text-xs md:text-sm tracking-[0.24em] uppercase">
                — Ignis, Founder / Artist
              </p>
              <div className="gold-line w-20 mx-auto mt-8" />
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={240}>
            <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-6 md:gap-8 items-stretch mb-14 md:mb-20">
              <div
                className="glass-panel rounded-[28px] p-7 md:p-10"
                style={{ background: "rgba(255,255,255,0.03)" }}
              >
                <p className="text-gold font-body text-xs tracking-[0.26em] uppercase mb-5">
                  La mia storia
                </p>

                <div className="space-y-5 text-muted-foreground font-body text-[15px] md:text-[17px] leading-8">
                  <p>
                    Mi chiamo <span className="text-foreground font-medium">Ignis</span> e
                    lavoro da solo. Dietro ogni creazione ci sono il mio tempo,
                    la mia visione e una continua ricerca del dettaglio.
                  </p>

                  <p>
                    Ho sempre avuto una forte passione per la storia, per
                    l’estetica classica e per tutto ciò che riesce ad attraversare
                    il tempo senza perdere significato.
                  </p>

                  <p>
                    Allo stesso tempo, sono profondamente attratto dalla
                    tecnologia e dalle sue possibilità: precisione, sperimentazione,
                    evoluzione, controllo.
                  </p>

                  <p>
                    ProjectX Italia nasce proprio dall’incontro di questi due
                    mondi: il fascino del passato e la forza del presente.
                  </p>
                </div>
              </div>

              <div
                className="rounded-[28px] p-7 md:p-10 border"
                style={{
                  borderColor: "rgba(212,175,55,0.18)",
                  background:
                    "linear-gradient(180deg, rgba(212,175,55,0.08), rgba(255,255,255,0.02))",
                }}
              >
                <p className="text-gold font-body text-xs tracking-[0.26em] uppercase mb-5">
                  Cosa rende diverso il progetto
                </p>

                <div className="space-y-4">
                  {pillars.map((pill) => (
                    <div
                      key={pill}
                      className="rounded-2xl px-4 py-3 border text-sm md:text-[15px] font-body text-foreground"
                      style={{
                        borderColor: "rgba(255,255,255,0.08)",
                        background: "rgba(0,0,0,0.28)",
                      }}
                    >
                      {pill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll delay={300}>
            <div className="max-w-4xl mx-auto mb-14 md:mb-20 text-center">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-4">
                Visione
              </p>

              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[0.02em] text-foreground mb-6">
                Non semplici busti. Presenze.
              </h2>

              <div className="space-y-5 text-muted-foreground font-body text-[15px] md:text-[17px] leading-8 max-w-3xl mx-auto">
                <p>
                  L’obiettivo non è creare semplici decorazioni. Ogni opera è
                  pensata per raccontare qualcosa, per evocare un’identità, per
                  trasformare la memoria estetica in una presenza concreta.
                </p>

                <p>
                  Ogni dettaglio viene curato con attenzione: dalla scelta del
                  soggetto, alla modellazione, fino alla rifinitura finale.
                  Nulla è lasciato al caso.
                </p>

                <p>
                  Quello che cerco è un equilibrio preciso: eleganza classica,
                  carattere contemporaneo e una qualità visiva capace di restare.
                </p>
              </div>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-5 md:gap-6 mb-16 md:mb-24">
            {values.map((item, index) => (
              <AnimateOnScroll key={item.title} delay={index * 120}>
                <div
                  className="h-full rounded-[24px] p-6 md:p-7 border"
                  style={{
                    borderColor: "rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.025)",
                  }}
                >
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center mb-5 text-sm font-semibold"
                    style={{
                      background: "rgba(212,175,55,0.12)",
                      color: "#D4AF37",
                      border: "1px solid rgba(212,175,55,0.22)",
                    }}
                  >
                    0{index + 1}
                  </div>

                  <h3 className="font-display text-xl font-semibold tracking-[0.02em] text-foreground mb-3">
                    {item.title}
                  </h3>

                  <p className="text-sm md:text-[15px] text-muted-foreground font-body leading-7">
                    {item.desc}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll>
            <div className="text-center mb-10 md:mb-14">
              <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-4">
                Il percorso
              </p>
              <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-[0.02em] text-foreground">
                Da dove nasce ProjectX Italia
              </h2>
            </div>
          </AnimateOnScroll>

          <div className="space-y-8 max-w-3xl mx-auto">
            {timeline.map((item, i) => (
              <AnimateOnScroll key={item.title} delay={i * 120}>
                <div className="grid grid-cols-[72px_1fr] gap-5 md:gap-7">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-14 h-14 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                      style={{
                        borderColor: "hsl(43 72% 52%)",
                        background: "rgba(212,175,55,0.08)",
                      }}
                    >
                      <span className="text-gold font-body text-[11px] font-bold">
                        {item.year}
                      </span>
                    </div>

                    {i < timeline.length - 1 && (
                      <div
                        className="w-px flex-1 mt-3"
                        style={{
                          minHeight: "72px",
                          background:
                            "linear-gradient(to bottom, hsl(43 72% 52%), transparent)",
                        }}
                      />
                    )}
                  </div>

                  <div
                    className="rounded-[22px] p-5 md:p-6 border"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.025)",
                    }}
                  >
                    <h3 className="font-display text-lg md:text-xl font-semibold tracking-[0.02em] text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm md:text-[15px] text-muted-foreground font-body leading-7">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ChiSiamo;