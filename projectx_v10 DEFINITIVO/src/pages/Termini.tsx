import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const Termini = () => {
  return (
    <>
      <SEOHead title="Termini e Condizioni" description="Condizioni generali di utilizzo del sito e delle commissioni ProjectX Italia." canonical="https://www.projectxitalia.com/termini" />
      <ScrollProgress />
      <Header />
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">Termini e Condizioni</h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="glass-panel rounded-2xl p-8 md:p-12 font-body text-sm text-muted-foreground space-y-6 leading-relaxed">
              <h2 className="font-display text-lg font-semibold text-foreground">1. Oggetto</h2>
              <p>I presenti termini regolano l'acquisto di busti artistici in resina effetto marmo realizzati da ProjectX Italia.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">2. Prodotti</h2>
              <p>Ogni busto è un'opera artigianale unica. Le dimensioni, i dettagli e le finiture possono variare leggermente rispetto alle immagini di anteprima.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">3. Ordini e Preventivi</h2>
              <p>Ogni ordine inizia con una richiesta di preventivo personalizzato. Il prezzo finale viene comunicato dopo la valutazione del progetto.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">4. Pagamenti</h2>
              <p>Il pagamento è richiesto in un’unica soluzione anticipata, pari al 100% dell’importo totale. 
La lavorazione e l’eventuale spedizione saranno avviate solo dopo la conferma del pagamento.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">5. Spedizioni</h2>
              <p>Le spedizioni avvengono con corriere espresso tracciato. Ogni opera è imballata con materiali protettivi premium.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">6. Resi</h2>
              <p>Data la natura personalizzata dei prodotti, i resi non sono accettati salvo difetti di fabbricazione.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">7. Contatti</h2>
              <p>Per qualsiasi domanda: info@projectxitalia.com — P.IVA IT04496940711</p>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Termini;
