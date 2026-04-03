import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Prezzo = Database["public"]["Tables"]["prezzi"]["Row"];

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  borderColor: "rgba(255,255,255,0.1)",
};

const pianoLabels: Record<string, string> = {
  mini: "MINI",
  standard: "STANDARD",
  premium: "PREMIUM",
};

const AdminPrezzi = () => {
  const [prezzi, setPrezzi] = useState<Prezzo[]>([]);
  const [logs, setLogs] = useState<
    { created_at: string; piano: string; campo_modificato: string; valore_nuovo: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    setLoading(true);

    const [{ data: p, error: prezziError }, { data: l, error: logError }] =
      await Promise.all([
        supabase.from("prezzi").select("*").order("id"),
        supabase
          .from("prezzi_log")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

    if (prezziError || logError) {
      toast.error("Errore caricamento prezzi");
      setPrezzi([]);
      setLogs([]);
      setLoading(false);
      return;
    }

    setPrezzi(p || []);
    setLogs(l || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateField = (
    piano: string,
    field: keyof Prezzo,
    value: string | number | boolean
  ) => {
    setPrezzi((prev) =>
      prev.map((p) => (p.piano === piano ? { ...p, [field]: value } : p))
    );
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      for (const p of prezzi) {
        const { error: updateError } = await supabase
          .from("prezzi")
          .update({
            prezzo_base: p.prezzo_base,
            dimensione: p.dimensione,
            descrizione: p.descrizione,
            badge_consigliato: p.badge_consigliato,
            visibile: p.visibile,
          })
          .eq("piano", p.piano);

        if (updateError) throw updateError;

        const { error: logError } = await supabase.from("prezzi_log").insert({
          piano: p.piano,
          campo_modificato: "tutti",
          valore_nuovo: `€${p.prezzo_base} - ${p.dimensione}`,
        });

        if (logError) throw logError;
      }

      toast.success("Prezzi aggiornati con successo!");
      await fetchData();
    } catch {
      toast.error("Errore durante il salvataggio dei prezzi");
    } finally {
      setSaving(false);
    }
  };

  return (
      <AdminLayout>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Gestione Prezzi
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              Aggiorna i prezzi mostrati sul sito
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="px-6 py-3 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 font-body disabled:opacity-50"
            style={{ color: "#000" }}
          >
            {saving ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </div>

        {loading ? (
          <p className="text-muted-foreground font-body">Caricamento...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
              {prezzi.map((p) => (
                <div
                  key={p.piano}
                  className={`rounded-2xl p-6 border ${p.badge_consigliato ? "border-gold-2" : ""}`}
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: p.badge_consigliato
                      ? "hsl(43 72% 52%)"
                      : "rgba(255,255,255,0.07)",
                  }}
                >
                  <h3 className="font-display text-xl font-bold text-foreground mb-6">
                    {pianoLabels[p.piano] ?? p.piano}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs text-muted-foreground font-body mb-1">
                        Prezzo base (€)
                      </label>
                      <input
                        type="number"
                        value={p.prezzo_base}
                        onChange={(e) =>
                          updateField(p.piano, "prezzo_base", Number(e.target.value))
                        }
                        className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none focus:ring-1 focus:ring-gold-2"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground font-body mb-1">
                        Dimensione
                      </label>
                      <input
                        type="text"
                        value={p.dimensione}
                        onChange={(e) =>
                          updateField(p.piano, "dimensione", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none focus:ring-1 focus:ring-gold-2"
                        style={inputStyle}
                      />
                    </div>

                    <div>
                      <label className="block text-xs text-muted-foreground font-body mb-1">
                        Descrizione
                      </label>
                      <textarea
                        value={p.descrizione}
                        onChange={(e) =>
                          updateField(p.piano, "descrizione", e.target.value)
                        }
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg border text-foreground font-body text-sm outline-none resize-none focus:ring-1 focus:ring-gold-2"
                        style={inputStyle}
                      />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <span className="text-xs text-muted-foreground font-body">
                        Badge "Più Richiesto"
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateField(p.piano, "badge_consigliato", !p.badge_consigliato)
                        }
                        className={`w-10 h-5 rounded-full transition-colors ${
                          p.badge_consigliato ? "bg-gold" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-foreground transition-transform ${
                            p.badge_consigliato ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground font-body">
                        Visibile sul sito
                      </span>
                      <button
                        type="button"
                        onClick={() => updateField(p.piano, "visibile", !p.visibile)}
                        className={`w-10 h-5 rounded-full transition-colors ${
                          p.visibile ? "bg-gold" : "bg-muted"
                        }`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-foreground transition-transform ${
                            p.visibile ? "translate-x-5" : "translate-x-0.5"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground font-body mb-6">
              * I prezzi vengono visualizzati come "a partire da €X" sul sito
            </p>

            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.07)",
              }}
            >
              <h3 className="font-display text-base font-semibold text-foreground mb-4">
                Ultime modifiche
              </h3>

              {logs.length === 0 ? (
                <p className="text-xs text-muted-foreground font-body">
                  Nessuna modifica registrata
                </p>
              ) : (
                <div className="space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-xs font-body">
                      <span className="text-muted-foreground">
                        {new Date(log.created_at).toLocaleString("it-IT")}
                      </span>
                      <span className="text-gold uppercase">{log.piano}</span>
                      <span className="text-muted-foreground">{log.valore_nuovo}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </AdminLayout>
  );
};

export default AdminPrezzi;