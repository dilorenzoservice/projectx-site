import { memo } from "react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const steps = [
  {
    num: "I",
    title: "Invio delle Foto",
    desc: "Tre foto ad alta qualità (frontale + profili)",
  },
  {
    num: "II",
    title: "Modellazione Digitale",
    desc: "Scultura 3D fedele al soggetto",
  },
  {
    num: "III",
    title: "Anteprima 3D",
    desc: "Render per approvazione e revisioni",
  },
  {
    num: "IV",
    title: "Stampa 8K",
    desc: "Resina ad altissima definizione",
  },
  {
    num: "V",
    title: "Rifinitura a Mano",
    desc: "Carteggiatura, polimerizzazione UV, finiture",
  },
  {
    num: "VI",
    title: "Consegna",
    desc: "Imballaggio premium, spedizione tracciata",
  },
];

const ProcessSectionInner = () => {
  return (
    <section
      id="processo"
      className="relative overflow-hidden py-24 px-6"
      style={{ scrollMarginTop: "110px" }}
    >
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,rgba(212,175,55,0.12),transparent_60%)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-20">
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
              Dal volto all&apos;eternità
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
              IL PROCESSO
            </h2>

            <div
              className="mx-auto mt-5 h-px w-28"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,0.9), rgba(212,175,55,0))",
              }}
            />
          </div>
        </AnimateOnScroll>

        <div
          className="hidden lg:grid grid-cols-6 gap-4 rounded-[28px] border p-8"
          style={{
            background: "rgba(0,0,0,0.38)",
            borderColor: "rgba(255,255,255,0.07)",
            boxShadow: "0 24px 70px rgba(0,0,0,0.45)",
          }}
        >
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.num} delay={i * 150}>
              <div className="text-center relative">
                <div
                  className="w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center mb-4"
                  style={{
                    borderColor: "rgba(212,175,55,0.9)",
                    background: "rgba(0,0,0,0.45)",
                    boxShadow: "0 0 20px rgba(212,175,55,0.12)",
                  }}
                >
                  <span className="font-display text-lg font-bold text-gold">
                    {step.num}
                  </span>
                </div>

                {i < steps.length - 1 && (
                  <div className="absolute top-7 left-[calc(50%+28px)] w-[calc(100%-56px)] gold-line" />
                )}

                <h3 className="font-display text-sm font-semibold text-foreground mb-2">
                  {step.title}
                </h3>

                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <div
          className="lg:hidden space-y-8 rounded-[24px] border p-6"
          style={{
            background: "rgba(0,0,0,0.38)",
            borderColor: "rgba(255,255,255,0.07)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.42)",
          }}
        >
          {steps.map((step, i) => (
            <AnimateOnScroll key={step.num} delay={i * 100}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div
                    className="w-12 h-12 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                    style={{
                      borderColor: "rgba(212,175,55,0.9)",
                      background: "rgba(0,0,0,0.45)",
                    }}
                  >
                    <span className="font-display text-base font-bold text-gold">
                      {step.num}
                    </span>
                  </div>

                  {i < steps.length - 1 && (
                    <div
                      className="w-px flex-1 mt-2"
                      style={{
                        background:
                          "linear-gradient(to bottom, hsl(43 72% 52%), transparent)",
                      }}
                    />
                  )}
                </div>

                <div className="pb-6">
                  <h3 className="font-display text-base font-semibold text-foreground mb-1">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-body leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
};

export const ProcessSection = memo(ProcessSectionInner);