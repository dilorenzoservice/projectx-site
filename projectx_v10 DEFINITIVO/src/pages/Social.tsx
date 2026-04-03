import { Header } from "@/components/Header";
import { SEOHead } from "@/components/SEOHead";
import { Footer } from "@/components/Footer";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { trackEvent } from "@/lib/analytics";
import { Instagram } from "lucide-react";

const socials = [
  {
    name: "Instagram",
    handle: "@projectxitalia_",
    url: "https://instagram.com/projectxitalia_",
    icon: <Instagram className="w-8 h-8" />,
    desc: "Behind the scenes, nuove opere e processo creativo",
  },
  {
    name: "TikTok",
    handle: "@projectxitalia",
    url: "https://tiktok.com/@projectxitalia",
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.21 8.21 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z"/></svg>,
    desc: "Video del processo di creazione e unboxing",
  },
  {
    name: "Facebook",
    handle: "@projectxita",
    url: "https://facebook.com/projectxita",
    icon: <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
    desc: "Novità, eventi e aggiornamenti dalla community",
  },
];

const Social = () => {
  return (
    <>
      <SEOHead title="Social" description="Segui ProjectX Italia su Instagram, TikTok e Facebook per nuove opere e anteprime." canonical="https://www.projectxitalia.com/social" />
      <ScrollProgress />
      <Header />
      <main className="pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <AnimateOnScroll>
            <p className="text-gold font-body text-xs tracking-[0.3em] uppercase mb-3 text-center">Seguici</p>
            <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground text-center mb-16">Social</h1>
          </AnimateOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {socials.map((s, i) => (
              <AnimateOnScroll key={s.name} delay={i * 150}>
                <a
                  href={s.url}
                  target="_blank"
                 rel="noopener noreferrer"
                  rel="noopener noreferrer"
                  className="block glass-panel rounded-2xl p-8 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_hsl(43_72%_52%_/_0.2)] group"
                >
                  <div className="text-muted-foreground group-hover:text-gold transition-colors mx-auto w-fit mb-4">
                    {s.icon}
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">{s.name}</h3>
                  <p className="text-gold font-body text-sm mb-3">{s.handle}</p>
                  <p className="text-xs text-muted-foreground font-body">{s.desc}</p>
                </a>
              </AnimateOnScroll>
            ))}
          </div>

          {/* Instagram Preview */}
          <AnimateOnScroll delay={300}>
            <div className="glass-panel rounded-2xl p-8 text-center">
              <h2 className="font-display text-xl font-semibold text-foreground mb-4">Ultimi post su Instagram</h2>
              <p className="text-sm text-muted-foreground font-body mb-6">
                Segui <a href="https://instagram.com/projectxitalia_"
          onClick={() => trackEvent("social_click", { platform: "instagram" })} target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">@projectxitalia_</a> per non perdere le ultime creazioni.
              </p>
              <a
                href="https://instagram.com/projectxitalia_"
          onClick={() => trackEvent("social_click", { platform: "instagram" })}
                target="_blank"
               rel="noopener noreferrer"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover font-body"
                style={{ color: "#000" }}
              >
                <Instagram className="w-4 h-4" /> Apri Instagram
              </a>
            </div>
          </AnimateOnScroll>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Social;
