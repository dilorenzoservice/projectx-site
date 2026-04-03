import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type GalleriaItem = {
  id: string;
  titolo: string;
  slug: string | null;
  categoria: string | null;
  badge: string | null;
  descrizione: string | null;
  immagine_url: string;
  pubblica: boolean;
  ordine: number | null;
  materiale?: string | null;
  dettagli_distintivi?: string | null;
  stile?: string | null;
  produzione?: string | null;
  disponibilita?: string | null;
  concept?: string | null;
};

const SITE_NAME = "ProjectX Italia";
const SITE_URL = "https://www.projectxitalia.com";
const DEFAULT_OG = `${SITE_URL}/og-image.jpg`;

const upsertMeta = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!el) {
    el = document.createElement("meta");
    Object.entries(attrs).forEach(([key, value]) => {
      el!.setAttribute(key, value);
    });
    document.head.appendChild(el);
    return el;
  }

  Object.entries(attrs).forEach(([key, value]) => {
    el!.setAttribute(key, value);
  });

  return el;
};

const upsertCanonical = (href: string) => {
  let link = document.head.querySelector(
    "link[rel='canonical']"
  ) as HTMLLinkElement | null;

  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }

  link.setAttribute("href", href);
};

const ArtworkDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState<GalleriaItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchArtwork = async () => {
      if (!slug) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("galleria")
        .select("*")
        .eq("slug", slug)
        .eq("pubblica", true)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
        setItem(null);
        setLoading(false);
        return;
      }

      setItem(data as GalleriaItem);
      setNotFound(false);
      setLoading(false);
      window.scrollTo({ top: 0, behavior: "auto" });
    };

    fetchArtwork();
  }, [slug]);

  useEffect(() => {
    if (loading) return;

    if (notFound || !item || !item.slug) {
      const title = `Opera non trovata — ${SITE_NAME}`;
      const description =
        "L'opera richiesta non è disponibile oppure il collegamento non è corretto.";
      const url = `${SITE_URL}/opera/${slug ?? ""}`;

      document.title = title;
      upsertCanonical(url);
      upsertMeta('meta[name="description"]', {
        name: "description",
        content: description,
      });
      upsertMeta('meta[property="og:title"]', {
        property: "og:title",
        content: title,
      });
      upsertMeta('meta[property="og:description"]', {
        property: "og:description",
        content: description,
      });
      upsertMeta('meta[property="og:url"]', {
        property: "og:url",
        content: url,
      });
      upsertMeta('meta[property="og:image"]', {
        property: "og:image",
        content: DEFAULT_OG,
      });
      upsertMeta('meta[name="twitter:title"]', {
        name: "twitter:title",
        content: title,
      });
      upsertMeta('meta[name="twitter:description"]', {
        name: "twitter:description",
        content: description,
      });
      upsertMeta('meta[name="twitter:image"]', {
        name: "twitter:image",
        content: DEFAULT_OG,
      });
      return;
    }

    const title = `${item.titolo} — ${SITE_NAME}`;
    const description =
      item.descrizione?.trim() ||
      `Scopri ${item.titolo}, opera artistica in edizione limitata firmata ${SITE_NAME}.`;
    const url = `${SITE_URL}/opera/${item.slug}`;
    const image = item.immagine_url || DEFAULT_OG;

    document.title = title;
    upsertCanonical(url);
    upsertMeta('meta[name="description"]', {
      name: "description",
      content: description,
    });
    upsertMeta('meta[property="og:title"]', {
      property: "og:title",
      content: title,
    });
    upsertMeta('meta[property="og:description"]', {
      property: "og:description",
      content: description,
    });
    upsertMeta('meta[property="og:url"]', {
      property: "og:url",
      content: url,
    });
    upsertMeta('meta[property="og:image"]', {
      property: "og:image",
      content: image,
    });
    upsertMeta('meta[name="twitter:title"]', {
      name: "twitter:title",
      content: title,
    });
    upsertMeta('meta[name="twitter:description"]', {
      name: "twitter:description",
      content: description,
    });
    upsertMeta('meta[name="twitter:image"]', {
      name: "twitter:image",
      content: image,
    });
  }, [item, loading, notFound, slug]);

  const details = useMemo(() => {
    if (!item) return [];

    return [
      { label: "Materiale", value: item.materiale },
      { label: "Dettagli distintivi", value: item.dettagli_distintivi },
      { label: "Stile", value: item.stile },
      { label: "Produzione", value: item.produzione },
      { label: "Disponibilità", value: item.disponibilita },
    ].filter((entry) => entry.value && String(entry.value).trim() !== "");
  }, [item]);

  const goToContatti = () => {
    navigate("/#contatti");
  };

  const goToGalleria = () => {
    navigate("/#galleria");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-36 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-muted-foreground">Caricamento opera...</p>
        </div>
      </main>
    );
  }

  if (notFound || !item) {
    return (
      <main className="min-h-screen bg-background text-foreground pt-36 pb-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <span
            className="inline-block mb-4"
            style={{
              color: "#D4AF37",
              letterSpacing: "0.18em",
              fontSize: "0.78rem",
              textTransform: "uppercase",
            }}
          >
            Opera non trovata
          </span>

          <h1 className="font-display text-4xl md:text-5xl mb-6">
            Questa opera non è disponibile
          </h1>

          <p className="text-muted-foreground leading-8 mb-10">
            L'opera richiesta potrebbe essere stata rimossa, non pubblicata o il
            collegamento potrebbe non essere corretto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/")}
              className="rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #F9E79F, #D4AF37)",
                color: "#000",
                letterSpacing: "0.06em",
              }}
            >
              TORNA ALLA HOME
            </button>

            <button
              onClick={goToContatti}
              className="rounded-full px-8 py-4 font-semibold border transition-all duration-300 hover:scale-[1.04]"
              style={{
                borderColor: "rgba(212,175,55,0.4)",
                color: "#F5F1E8",
                letterSpacing: "0.06em",
              }}
            >
              CONTATTAMI
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background text-foreground pt-36 pb-24 px-6">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div className="relative group">
          <img
            src={item.immagine_url}
            alt={item.titolo}
            className="w-full rounded-2xl shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]"
            style={{
              border: "1px solid rgba(212,175,55,0.22)",
            }}
          />

          <div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition duration-500 pointer-events-none"
            style={{
              boxShadow: "0 0 80px rgba(212,175,55,0.15)",
            }}
          />
        </div>

        <div>
          {(item.badge || item.categoria) && (
            <span
              className="inline-block mb-4"
              style={{
                color: "#D4AF37",
                letterSpacing: "0.18em",
                fontSize: "0.78rem",
                textTransform: "uppercase",
              }}
            >
              {item.badge || item.categoria}
            </span>
          )}

          <h1
            className="font-display text-5xl md:text-6xl mb-6"
            style={{ color: "#F5F1E8" }}
          >
            {item.titolo}
          </h1>

          {item.descrizione && (
            <p className="text-lg text-muted-foreground leading-8 mb-8">
              {item.descrizione}
            </p>
          )}

          {details.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-sm">
              {details.map((detail) => (
                <div key={detail.label} className="opacity-80">
                  <strong>{detail.label}:</strong>
                  <br />
                  {detail.value}
                </div>
              ))}
            </div>
          )}

          {item.concept && (
            <div
              className="rounded-2xl p-6 mb-10"
              style={{
                background: "rgba(255,255,255,0.03)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <h2 className="font-display text-2xl mb-3 text-gold">Concept</h2>
              <p className="text-muted-foreground leading-8">{item.concept}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={goToContatti}
              className="rounded-full px-8 py-4 font-semibold transition-all duration-300 hover:scale-[1.04]"
              style={{
                background: "linear-gradient(135deg, #F9E79F, #D4AF37)",
                color: "#000",
                letterSpacing: "0.06em",
              }}
            >
              RICHIEDI INFORMAZIONI
            </button>

            <button
              onClick={goToGalleria}
              className="rounded-full px-8 py-4 font-semibold border transition-all duration-300 hover:scale-[1.04]"
              style={{
                borderColor: "rgba(212,175,55,0.4)",
                color: "#F5F1E8",
                letterSpacing: "0.06em",
              }}
            >
              TORNA ALLA GALLERIA
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ArtworkDetailPage;