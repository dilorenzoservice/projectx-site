import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  borderColor: "rgba(255,255,255,0.10)",
};

type ContactFormState = {
  nome: string;
  email: string;
  tipo_richiesta: string;
  messaggio: string;
  privacy: boolean;
};

const initialFormState: ContactFormState = {
  nome: "",
  email: "",
  tipo_richiesta: "preventivo",
  messaggio: "",
  privacy: false,
};

// SVG icons inline — no dipendenze esterne
const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const InstagramIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.21 8.21 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const contactInfo = [
  {
    icon: <MailIcon />,
    label: "info@projectxitalia.com",
    href: "mailto:info@projectxitalia.com",
    external: false,
    track: () => trackEvent("social_click", { platform: "email" }),
  },
  {
    icon: <InstagramIcon />,
    label: "@projectxitalia_",
    href: "https://instagram.com/projectxitalia_",
    external: true,
    track: () => trackEvent("social_click", { platform: "instagram" }),
  },
  {
    icon: <TikTokIcon />,
    label: "@projectxitalia",
    href: "https://tiktok.com/@projectxitalia",
    external: true,
    track: () => trackEvent("social_click", { platform: "tiktok" }),
  },
  {
    icon: <FacebookIcon />,
    label: "projectxita",
    href: "https://facebook.com/projectxita",
    external: true,
    track: () => trackEvent("social_click", { platform: "facebook" }),
  },
];

export const ContactSection = () => {
  const [form, setForm] = useState<ContactFormState>(initialFormState);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = "Inserisci il tuo nome";
    if (!form.email.trim()) {
      e.email = "Inserisci una email valida";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email.trim())) e.email = "Inserisci una email valida";
    }
    if (!form.tipo_richiesta.trim()) e.tipo_richiesta = "Seleziona un tipo di richiesta";
    if (!form.messaggio.trim()) e.messaggio = "Inserisci un messaggio";
    if (!form.privacy) e.privacy = "Devi accettare la privacy";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setSent(false);
      return;
    }

    setErrors({});
    setLoading(true);
    setSent(false);

    const { error } = await supabase.from("contact_messages").insert({
      nome: form.nome.trim(),
      email: form.email.trim(),
      tipo_richiesta: form.tipo_richiesta,
      messaggio: form.messaggio.trim(),
    });

    setLoading(false);

    if (error) {
      toast.error("Errore durante l'invio. Riprova.");
      return;
    }

    trackEvent("form_submit", { form: "contatti", tipo_richiesta: form.tipo_richiesta });
    toast.success("Messaggio inviato con successo!");
    setSent(true);
    setForm(initialFormState);
  };

  const setField = <K extends keyof ContactFormState>(field: K, value: ContactFormState[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <section
      id="contatti"
      className="py-20 md:py-24 px-6"
      style={{ scrollMarginTop: "110px" }}
    >
      <div className="max-w-[1100px] mx-auto">
        <AnimateOnScroll>
          <div className="text-center mb-14">
            <p className="text-gold uppercase tracking-[0.3em] text-xs mb-3">
              Contatti
            </p>
            <h2 className="text-4xl md:text-5xl font-display text-white">
              Richiedi informazioni
            </h2>
            <div
              className="mx-auto mt-5 h-px w-24"
              style={{
                background: "linear-gradient(90deg, rgba(212,175,55,0), rgba(212,175,55,0.9), rgba(212,175,55,0))",
              }}
            />
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-12">

          {/* COLONNA SINISTRA — info + social */}
          <div className="space-y-8">
            <AnimateOnScroll>
              <p className="text-sm text-muted-foreground">
                Per richieste personalizzate, collaborazioni o informazioni sulle
                opere, puoi contattarmi direttamente oppure compilare il modulo.
              </p>
            </AnimateOnScroll>

            {/* LINK SOCIAL + EMAIL */}
            <AnimateOnScroll delay={100}>
              <div className="space-y-3">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={item.track}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-gold transition-colors duration-200 group"
                  >
                    <span
                      className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-110"
                      style={{
                        background: "rgba(212,175,55,0.08)",
                        border: "1px solid rgba(212,175,55,0.15)",
                        color: "#D4AF37",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="group-hover:text-gold transition-colors">
                      {item.label}
                    </span>
                  </a>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll delay={200}>
              <p className="text-xs text-muted-foreground opacity-60">
                Le testimonianze vengono pubblicate solo dopo acquisti verificati.
              </p>
            </AnimateOnScroll>
          </div>

          {/* COLONNA DESTRA — form */}
          <AnimateOnScroll delay={150}>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="contact-nome" className="sr-only">Nome</label>
                <input
                  id="contact-nome"
                  type="text"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={(e) => { setField("nome", e.target.value); setErrors((p) => ({ ...p, nome: "" })); }}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-gold"
                  style={inputStyle}
                  autoComplete="name"
                  maxLength={100}
                  aria-required="true"
                  aria-describedby={errors.nome ? "error-nome" : undefined}
                />
                {errors.nome && <p id="error-nome" className="text-red-400 text-xs mt-1" role="alert">{errors.nome}</p>}
              </div>

              <div>
                <label htmlFor="contact-email" className="sr-only">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => { setField("email", e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-gold"
                  style={inputStyle}
                  autoComplete="email"
                  maxLength={254}
                  aria-required="true"
                  aria-describedby={errors.email ? "error-email" : undefined}
                />
                {errors.email && <p id="error-email" className="text-red-400 text-xs mt-1" role="alert">{errors.email}</p>}
              </div>

              <div>
                <select
                  value={form.tipo_richiesta}
                  onChange={(e) => { setField("tipo_richiesta", e.target.value); setErrors((p) => ({ ...p, tipo_richiesta: "" })); }}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-gold bg-transparent text-white"
                  style={inputStyle}
                >
                  <option value="preventivo" className="text-black">Preventivo</option>
                  <option value="recensione" className="text-black">Recensione</option>
                  <option value="problema" className="text-black">Problema</option>
                  <option value="collezione_limitata" className="text-black">Collezione limitata</option>
                  <option value="altro" className="text-black">Altro</option>
                </select>
                {errors.tipo_richiesta && <p className="text-red-400 text-xs mt-1">{errors.tipo_richiesta}</p>}
              </div>

              <div>
                <label htmlFor="contact-messaggio" className="sr-only">Messaggio</label>
                <textarea
                  id="contact-messaggio"
                  placeholder="Messaggio"
                  rows={4}
                  value={form.messaggio}
                  onChange={(e) => { setField("messaggio", e.target.value); setErrors((p) => ({ ...p, messaggio: "" })); }}
                  className="w-full p-3 rounded-lg border focus:outline-none focus:ring-1 focus:ring-gold"
                  style={inputStyle}
                  maxLength={2000}
                  aria-required="true"
                  aria-describedby={errors.messaggio ? "error-messaggio" : undefined}
                />
                {errors.messaggio && <p id="error-messaggio" className="text-red-400 text-xs mt-1" role="alert">{errors.messaggio}</p>}
              </div>

              <div className="flex items-start gap-2 text-xs text-muted-foreground">
                <input
                  type="checkbox"
                  checked={form.privacy}
                  onChange={(e) => { setField("privacy", e.target.checked); setErrors((p) => ({ ...p, privacy: "" })); }}
                  className="mt-0.5"
                />
                <span>
                  Accetto la{" "}
                  <a href="/privacy" className="text-gold hover:underline">privacy policy</a>
                </span>
              </div>
              {errors.privacy && <p className="text-red-400 text-xs">{errors.privacy}</p>}

              <div className="pt-1">
                <div className="gold-line w-full mb-4 opacity-40" />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full font-semibold text-sm tracking-[0.12em] uppercase gold-gradient gold-glow gold-glow-hover transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:scale-100 font-body"
                  style={{ color: "#000" }}
                >
                  {loading ? "Invio in corso..." : "Invia richiesta"}
                </button>
              </div>

              {sent && (
                <p className="text-green-400 text-sm mt-2 text-center">
                  ✓ Messaggio inviato! Ti risponderemo presto.
                </p>
              )}
            </form>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
};
