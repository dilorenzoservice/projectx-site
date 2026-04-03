import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";

interface SiteContent {
  id: string;
  chiave: string;
  valore: string;
  updated_at: string;
}

const AdminContenuti = () => {
  const [contents, setContents] = useState<SiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<string | null>(null);

  const fetchContents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("site_content")
      .select("id, chiave, valore, updated_at")
      .order("chiave", { ascending: true });

    if (error) {
      toast.error("Errore caricamento contenuti");
    } else {
      setContents(data || []);
      const initial: Record<string, string> = {};
      (data || []).forEach((c) => { initial[c.chiave] = c.valore; });
      setEditing(initial);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchContents();
  }, []);

  const handleSave = async (chiave: string) => {
    setSaving(chiave);

    const { error } = await supabase
      .from("site_content")
      .update({ valore: editing[chiave] })
      .eq("chiave", chiave);

    setSaving(null);

    if (error) {
      toast.error("Errore salvataggio");
    } else {
      toast.success("Contenuto aggiornato");
      fetchContents();
    }
  };

  const isLong = (val: string) => val.length > 80;

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Contenuti
        </h1>
        <p className="text-sm text-muted-foreground font-body">
          Modifica i testi del sito visibili al pubblico
        </p>
      </div>

      {loading ? (
        <p className="text-muted-foreground font-body">Caricamento...</p>
      ) : contents.length === 0 ? (
        <p className="text-muted-foreground font-body">Nessun contenuto trovato</p>
      ) : (
        <div className="space-y-4">
          {contents.map((c) => (
            <div
              key={c.chiave}
              className="p-5 rounded-2xl border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              <p className="text-xs text-gold font-mono mb-2 uppercase tracking-widest">
                {c.chiave}
              </p>

              {isLong(editing[c.chiave] ?? c.valore) ? (
                <textarea
                  rows={4}
                  value={editing[c.chiave] ?? c.valore}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, [c.chiave]: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none resize-none"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              ) : (
                <input
                  type="text"
                  value={editing[c.chiave] ?? c.valore}
                  onChange={(e) =>
                    setEditing((prev) => ({ ...prev, [c.chiave]: e.target.value }))
                  }
                  className="w-full p-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none"
                  style={{
                    background: "rgba(0,0,0,0.4)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                />
              )}

              <div className="flex items-center justify-between mt-3">
                <p className="text-[10px] text-muted-foreground font-body">
                  Aggiornato: {new Date(c.updated_at).toLocaleString("it-IT")}
                </p>
                <button
                  onClick={() => handleSave(c.chiave)}
                  disabled={saving === c.chiave || editing[c.chiave] === c.valore}
                  className="px-5 py-2 rounded-full gold-gradient text-black text-xs font-semibold disabled:opacity-40"
                >
                  {saving === c.chiave ? "Salvataggio..." : "Salva"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContenuti;
