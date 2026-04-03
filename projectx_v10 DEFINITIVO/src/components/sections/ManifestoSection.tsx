import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useSiteContent } from "@/hooks/useSiteContent";

export const ManifestoSection = () => {
  const testo = useSiteContent(
    "manifesto_testo",
    "Da duemila anni, il marmo custodisce i volti di chi ha cambiato il mondo. Oggi, la tecnologia ci permette di fare lo stesso. Ogni busto che creo è un atto di memoria. Un oggetto che sfida il tempo."
  );

  return (
    <section className="py-32 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <AnimateOnScroll>
          <div className="gold-line w-24 mx-auto mb-12" />
        </AnimateOnScroll>

        <AnimateOnScroll delay={200}>
          <blockquote className="font-display text-xl md:text-2xl lg:text-3xl italic text-foreground leading-relaxed mb-8 font-medium">
            "{testo}"
          </blockquote>
        </AnimateOnScroll>

        <AnimateOnScroll delay={400}>
          <p className="text-gold font-body text-sm tracking-widest uppercase">
            — Ignis, Founder
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll delay={500}>
          <div className="gold-line w-24 mx-auto mt-12" />
        </AnimateOnScroll>
      </div>
    </section>
  );
};
