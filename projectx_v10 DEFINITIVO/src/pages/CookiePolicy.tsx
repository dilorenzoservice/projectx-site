import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

const CookiePolicy = () => {
  return (
    <>
      <SEOHead title="Cookie Policy" description="Informazioni sull'utilizzo dei cookie nel sito ProjectX Italia." canonical="https://www.projectxitalia.com/cookie-policy" />
      <ScrollProgress />
      <Header />
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          <AnimateOnScroll>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">Cookie Policy</h1>
          </AnimateOnScroll>

          <AnimateOnScroll delay={200}>
            <div className="glass-panel rounded-2xl p-8 md:p-12 font-body text-sm text-muted-foreground space-y-6 leading-relaxed">
              <h2 className="font-display text-lg font-semibold text-foreground">Cosa sono i cookie?</h2>
              <p>I cookie sono piccoli file di testo che vengono salvati sul tuo dispositivo quando visiti un sito web.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">Cookie utilizzati</h2>
              <p>ProjectX Italia utilizza esclusivamente <strong className="text-foreground">cookie tecnici</strong> necessari al corretto funzionamento del sito. Non utilizziamo cookie di profilazione né cookie di terze parti a scopo pubblicitario.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">Cookie tecnici</h2>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong className="text-foreground">cookie-consent</strong>: memorizza la tua preferenza sui cookie (localStorage)</li>
              </ul>

              <h2 className="font-display text-lg font-semibold text-foreground">Come disattivare i cookie</h2>
              <p>Puoi modificare le impostazioni del tuo browser per bloccare o eliminare i cookie. Tieni presente che la disattivazione potrebbe influire sull'esperienza di navigazione.</p>

              <h2 className="font-display text-lg font-semibold text-foreground">Contatti</h2>
              <p>Per informazioni: info@projectxitalia.com</p>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default CookiePolicy;
