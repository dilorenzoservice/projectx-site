import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Link } from "react-router-dom";

const faqs = [
  {
    q: "Di che materiale sono fatti i busti?",
    a: "Utilizzo resina fotopolimerica ad altissima definizione (8K) con finitura effetto marmo. Dopo la stampa ogni pezzo viene lavato, polimerizzato UV, carteggiato e rifinito a mano. Il risultato è solido, dettagliatissimo e duraturo nel tempo.",
  },
  {
    q: "Quanto tempo ci vuole per ricevere il busto?",
    a: "Generalmente 7-14 giorni lavorativi dalla conferma del progetto. Include modellazione 3D, approvazione anteprima, stampa, rifinitura e spedizione. Per richieste urgenti contattami — in alcuni casi è possibile accelerare i tempi.",
  },
  {
    q: "Posso vedere un'anteprima prima della stampa?",
    a: "Sì, sempre. Prima di procedere con la stampa definitiva ti invio un render 3D del busto per approvazione. Puoi richiedere modifiche in questa fase senza costi aggiuntivi.",
  },
  {
    q: "Posso ordinare un busto di un personaggio famoso?",
    a: "Sì. Realizzo rivisitazioni contemporanee di icone storiche e culturali con la mia interpretazione artistica. Ogni pezzo è un'opera unica in edizione limitata, numerata e firmata.",
  },
];

export const HomeFAQSection = () => {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3">
              Hai domande?
            </p>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
              DOMANDE FREQUENTI
            </h2>
          </div>
        </AnimateOnScroll>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <AnimateOnScroll key={i} delay={i * 80}>
              <div
                className="rounded-2xl border overflow-hidden transition-all duration-300"
                style={{
                  background: open === i ? "rgba(212,175,55,0.06)" : "rgba(0,0,0,0.5)",
                  borderColor: open === i ? "rgba(212,175,55,0.25)" : "rgba(255,255,255,0.07)",
                }}
              >
                <button
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="font-display text-base font-semibold text-foreground pr-4">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-gold">
                    {open === i
                      ? <Minus className="w-4 h-4" />
                      : <Plus className="w-4 h-4" />}
                  </span>
                </button>
                {open === i && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-muted-foreground font-body leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                )}
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        <AnimateOnScroll delay={300}>
          <div className="text-center mt-10">
            <Link
              to="/faq"
              className="text-sm text-gold font-body hover:underline inline-flex items-center gap-1"
            >
              Vedi tutte le domande frequenti →
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
};
