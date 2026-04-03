import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AnimateOnScroll } from "@/components/AnimateOnScroll";
import { toast } from "sonner";

interface GalleriaItem {
  id: string;
  titolo: string;
  slug?: string;
  categoria: string;
  badge: string | null;
  descrizione: string;
  immagine_url: string;
  pubblica: boolean;
  ordine: number;
}

export const GallerySection = () => {
  const [items, setItems] = useState<GalleriaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGallery = async () => {
      const { data, error } = await supabase
        .from("galleria")
        // Seleziona solo le colonne necessarie per la lista — più leggero di select("*")
        .select("id, titolo, slug, categoria, badge, descrizione, immagine_url, pubblica, ordine")
        .eq("pubblica", true)
        .order("ordine", { ascending: true });

      if (error) {
        if (import.meta.env.DEV) console.error("Errore galleria:", error);
        toast.error("Errore nel caricamento della galleria");
        setItems([]);
      } else {
        setItems(data || []);
      }

      setLoading(false);
    };

    fetchGallery();
  }, []);

  const handleClick = (item: GalleriaItem) => {
    if (item.slug) {
      navigate(`/opera/${item.slug}`);
    }
  };

  return (
    <section
      id="galleria"
      className="relative py-24 px-6"
      style={{
        scrollMarginTop: "110px",
        background:
          "linear-gradient(180deg, rgba(0,0,0,0.9), rgba(0,0,0,0.96))",
      }}
    >
      <div className="max-w-6xl mx-auto text-center">

        <AnimateOnScroll>
          <h2
            className="font-display text-4xl md:text-5xl mb-6"
            style={{
              color: "#F5F1E8",
              letterSpacing: "0.06em",
            }}
          >
            <span style={{ color: "#D4AF37" }}>Galleria</span>
          </h2>

          <p className="max-w-2xl mx-auto mb-14 text-muted-foreground">
            Opere in edizione limitata realizzate con stampa 3D ad altissima
            definizione e rifinite a mano.
          </p>
        </AnimateOnScroll>

        {/* LOADING */}
        {loading && (
          <p className="text-muted-foreground font-body">
            Caricamento galleria...
          </p>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <p className="text-muted-foreground font-body">
            Nessuna opera disponibile
          </p>
        )}

        {/* GRID */}
        {!loading && items.length > 0 && (
          <div
            className={`grid gap-8 ${
              items.length === 1
                ? "grid-cols-1 place-items-center"
                : "grid-cols-1 md:grid-cols-2"
            }`}
          >
            {items.map((item, index) => (
              <AnimateOnScroll key={item.id} delay={index * 120}>
                <div
                  onClick={() => handleClick(item)}
                  className={`group relative transition-all duration-500 hover:scale-[1.03] w-full ${
                    item.slug ? "cursor-pointer" : "cursor-default"
                  }`}
                  style={{
                    maxWidth: items.length === 1 ? "520px" : "100%",
                  }}
                >
                  <img
                    src={item.immagine_url}
                    alt={item.titolo}
                    className="w-full rounded-2xl shadow-2xl object-cover"
                    style={{
                      border: "1px solid rgba(212,175,55,0.25)",
                      minHeight: "420px",
                      maxHeight: "640px",
                    }}
                  />

                  {/* OVERLAY */}
                  <div
                    className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{
                      background: "rgba(0,0,0,0.7)",
                      backdropFilter: "blur(3px)",
                    }}
                  >
                    <h3
                      className="font-display text-3xl mb-2 text-center px-4"
                      style={{
                        color: "#F5F1E8",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.titolo}
                    </h3>

                    {(item.badge || item.categoria) && (
                      <span
                        className="text-center px-4"
                        style={{
                          color: "#D4AF37",
                          letterSpacing: "0.18em",
                          fontSize: "0.8rem",
                        }}
                      >
                        {(item.badge || item.categoria).toUpperCase()}
                      </span>
                    )}

                    {/* CTA */}
                    {item.slug && (
                      <button
                        className="mt-6 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105"
                        style={{
                          background: "#D4AF37",
                          color: "#000",
                          letterSpacing: "0.08em",
                        }}
                      >
                        SCOPRI L'OPERA
                      </button>
                    )}
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
