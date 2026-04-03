import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  { q: "Come funziona il processo di creazione?", a: "Invii 3 foto ad alta qualità (frontale e profili), creo un modello 3D fedele, ti mostro un'anteprima per approvazione, poi passo alla stampa 8K in resina e alla rifinitura a mano." },
  { q: "Quanto tempo ci vuole per ricevere il busto?", a: "I tempi variano in base alla complessità: circa 2-4 settimane per un busto standard, 4-6 settimane per opere premium con dettagli particolari." },
  { q: "Che materiale viene utilizzato?", a: "Utilizzo resina fotopolimerica stampata a risoluzione 8K, con finitura effetto marmo. Il risultato è un oggetto solido, dettagliatissimo e resistente nel tempo." },
  { q: "Posso richiedere modifiche dopo aver visto l'anteprima?", a: "Assolutamente sì. L'anteprima 3D serve proprio a questo: puoi richiedere revisioni prima della stampa finale." },
  { q: "Offrite imballaggi regalo?", a: "Sì, ogni busto viene consegnato in un packaging premium protettivo. Su richiesta, offriamo confezioni regalo personalizzate." },
  { q: "Posso ordinare un busto ispirato a un personaggio famoso?", a: "Sì, realizzo rivisitazioni contemporanee di icone storiche e culturali. Ogni pezzo è un'opera unica in edizione limitata." },
  { q: "Spedite all'estero?", a: "Al momento le spedizioni sono attive principalmente in Italia. Per richieste internazionali contattami direttamente." },
];

const FAQ = () => {
  return (
    <>
      <SEOHead title="Domande Frequenti" description="Tutto quello che devi sapere su tempi, materiali, processo e spedizioni dei busti personalizzati ProjectX Italia." canonical="https://www.projectxitalia.com/faq" />
      <ScrollProgress />
      <Header />
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3 text-center">Domande frequenti</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">FAQ</h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="glass-panel rounded-2xl p-6 md:p-8">
              <Accordion type="single" collapsible className="space-y-2">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`item-${i}`} className="border-b" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
                    <AccordionTrigger className="font-display text-base text-foreground hover:text-gold py-5 text-left [&[data-state=open]]:text-gold">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-body pb-5 leading-relaxed">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FAQ;
