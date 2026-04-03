import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";

type Testimonial = {
  id: string;
  nome: string;
  messaggio: string;
  created_at: string;
};

export const TestimonialsSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      // Carica le recensioni approvate (stato = "completato")
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, nome, messaggio, created_at")
        .eq("tipo_richiesta", "recensione")
        .eq("stato", "completato")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTestimonials(data);
      }

      setLoading(false);
    };

    fetchTestimonials();
  }, []);

  const hasTestimonials = testimonials.length > 0;

  return (
    <section
      id="testimonianze"
      className="py-20 md:py-24 px-6"
      aria-labelledby="testimonials-title"
    >
      <div className="max-w-6xl mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-12 md:mb-14">
            <p
              className="font-body text-[11px] md:text-xs uppercase mb-3"
              style={{
                color: "#D4AF37",
                letterSpacing: "0.32em",
              }}
            >
              Esperienze reali
            </p>

            <h2
              id="testimonials-title"
              className="font-display text-3xl md:text-5xl font-bold text-foreground"
            >
              Testimonianze
            </h2>

            <div
              className="mx-auto mt-5 h-px w-24"
              style={{
                background:
                  "linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,0.9), rgba(212,175,55,0))",
              }}
            />
          </div>
        </AnimateOnScroll>

        {loading ? (
          <AnimateOnScroll>
            <p className="text-center text-muted-foreground font-body">
              Caricamento testimonianze...
            </p>
          </AnimateOnScroll>
        ) : !hasTestimonials ? (
          <AnimateOnScroll>
            <div
              className="rounded-[28px] px-6 py-10 md:px-10 md:py-14 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.018))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
                backdropFilter: "blur(8px)",
              }}
            >
              <div className="max-w-2xl mx-auto">
                <p className="font-body text-base md:text-lg text-muted-foreground leading-8 mb-8">
                  Le testimonianze verranno pubblicate solo dopo acquisti
                  verificati. Se hai già ricevuto la tua opera, puoi condividere
                  la tua esperienza tramite la sezione contatti.
                </p>

                <a
                  href="#contatti"
                  className="inline-flex items-center justify-center rounded-full px-7 py-3.5 font-semibold transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(212,175,55,0.22)]"
                  style={{
                    background: "linear-gradient(135deg, #F9E79F, #D4AF37)",
                    color: "#000",
                    letterSpacing: "0.06em",
                  }}
                  aria-label="Vai alla sezione contatti per lasciare una recensione"
                >
                  Lascia una recensione
                </a>
              </div>
            </div>
          </AnimateOnScroll>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {testimonials.map((testimonial) => (
              <AnimateOnScroll key={testimonial.id}>
                <article
                  className="h-full rounded-[24px] p-6 md:p-8"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.015))",
                    border: "1px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
                  }}
                >
                  <p className="font-body text-muted-foreground leading-8 mb-6">
                    "{testimonial.messaggio}"
                  </p>

                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-display text-lg text-foreground">
                        {testimonial.nome}
                      </p>
                      <p className="font-body text-xs text-muted-foreground mt-1">
                        {new Date(testimonial.created_at).toLocaleDateString("it-IT", {
                          year: "numeric",
                          month: "long",
                        })}
                      </p>
                    </div>

                    <span
                      className="font-body text-[11px] uppercase whitespace-nowrap"
                      style={{
                        color: "#D4AF37",
                        letterSpacing: "0.18em",
                      }}
                    >
                      Verificata
                    </span>
                  </div>
                </article>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
