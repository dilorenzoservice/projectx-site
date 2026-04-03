import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const Privacy = () => {
  return (
    <>
      <SEOHead title="Privacy Policy" description="Informativa sul trattamento dei dati personali per gli utenti del sito ProjectX Italia." canonical="https://www.projectxitalia.com/privacy" />
      <ScrollProgress />
      <Header />
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">Privacy Policy</h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="glass-panel rounded-2xl p-8 md:p-12 font-body text-sm text-muted-foreground space-y-6 leading-relaxed">
              <h2 className="font-display text-lg font-semibold text-foreground">1. Titolare del Trattamento</h2>
              <p>Il titolare del trattamento è Ignis — ProjectX Italia, P.IVA IT04496940711.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">2. Dati Raccolti</h2>
              <p>Raccogliamo i dati personali forniti volontariamente tramite il modulo di contatto: nome, email e messaggio. Non raccogliamo dati sensibili.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">3. Finalità del Trattamento</h2>
              <p>I dati vengono utilizzati esclusivamente per rispondere alle richieste inviate e per fornire preventivi personalizzati.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">4. Cookie</h2>
              <p>Il sito utilizza esclusivamente cookie tecnici necessari al funzionamento. Non vengono utilizzati cookie di profilazione o di terze parti a scopo pubblicitario.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">5. Diritti dell'Interessato</h2>
              <p>L'utente può esercitare i propri diritti (accesso, rettifica, cancellazione) contattando info@projectxitalia.com.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">6. Contatti</h2>
              <p>Per qualsiasi informazione relativa alla privacy: info@projectxitalia.com</p>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Privacy;
