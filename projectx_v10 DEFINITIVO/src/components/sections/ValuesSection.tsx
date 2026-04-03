import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { useSiteContentBatch } from "@/hooks/useSiteContent";

const defaultValues = [
  {
    emoji: "🏛️",
    titleKey: "valori_titolo_1",
    descKey: "valori_desc_1",
    titleFb: "Estetica Classica",
    descFb: "Ispirazione greco-romana reinterpretata in chiave contemporanea",
  },
  {
    emoji: "🖨️",
    titleKey: "valori_titolo_2",
    descKey: "valori_desc_2",
    titleFb: "Stampa 3D 8K",
    descFb: "Alta definizione e precisione nei dettagli",
  },
  {
    emoji: "✋",
    titleKey: "valori_titolo_3",
    descKey: "valori_desc_3",
    titleFb: "Finitura Artigianale",
    descFb: "Ogni opera viene rifinita con cura a mano",
  },
  {
    emoji: "🇮🇹",
    titleKey: "valori_titolo_4",
    descKey: "valori_desc_4",
    titleFb: "Made in Italy",
    descFb: "Produzione artistica e manifattura italiana",
  },
];

export const ValuesSection = () => {
  const contentKeys = defaultValues.flatMap((v) => [
    { key: v.titleKey, fallback: v.titleFb },
    { key: v.descKey, fallback: v.descFb },
  ]);

  const c = useSiteContentBatch(contentKeys);

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">

        {/* GRID VALORI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {defaultValues.map((v, i) => (
            <AnimateOnScroll key={v.titleKey} delay={i * 100}>
              <div className="glass-panel rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4)]">
                
                <span className="text-3xl mb-4 block">{v.emoji}</span>

                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {c[v.titleKey]}
                </h3>

                <p className="text-sm text-muted-foreground font-body">
                  {c[v.descKey]}
                </p>

              </div>
            </AnimateOnScroll>
          ))}
        </div>

      </div>
    </section>
  );
};