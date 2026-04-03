import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { Search, X } from "lucide-react";
import type { Database } from "@/integrations/supabase/types";

type Message = Database["public"]["Tables"]["contact_messages"]["Row"];

const statusLabels: Record<string, string> = {
  nuovo: "Nuovo",
  in_lavorazione: "In lavorazione",
  completato: "Completato",
};

const AdminMessaggi = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStato, setFilterStato] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [selected, setSelected] = useState<Message | null>(null);

  const fetchMessages = async () => {
    setLoading(true);

    let query = supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterStato) query = query.eq("stato", filterStato);
    if (filterTipo) query = query.eq("tipo_richiesta", filterTipo);

    const { data, error } = await query;

    if (error) {
      toast.error("Errore caricamento messaggi");
      setMessages([]);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, [filterStato, filterTipo]);

  const filtered = messages.filter(
    (m) =>
      m.nome.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  const updateStato = async (id: string, stato: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ stato, letto: true })
      .eq("id", id);

    if (error) {
      toast.error("Errore aggiornamento stato");
      return;
    }

    toast.success("Stato aggiornato");
    fetchMessages();

    if (selected?.id === id) {
      setSelected({ ...selected, stato, letto: true });
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Eliminare questo messaggio?")) return;

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Errore eliminazione messaggio");
      return;
    }

    toast.success("Messaggio eliminato");
    setSelected(null);
    fetchMessages();
  };

  const markRead = async (id: string) => {
    const { error } = await supabase
      .from("contact_messages")
      .update({ letto: true })
      .eq("id", id);

    if (!error) {
      fetchMessages();
    }
  };

  const exportCSV = () => {
    const headers = ["Data", "Nome", "Email", "Tipo", "Messaggio", "Stato"];
    const rows = filtered.map((m) => [
      new Date(m.created_at).toLocaleString("it-IT"),
      m.nome,
      m.email,
      m.tipo_richiesta,
      `"${m.messaggio.replace(/"/g, '""')}"`,
      m.stato,
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `messaggi-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
      <AdminLayout>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground mb-1">
              Messaggi
            </h1>
            <p className="text-sm text-muted-foreground font-body">
              {filtered.length} messaggi
            </p>
          </div>

          <button
            onClick={exportCSV}
            className="px-4 py-2 rounded-full text-xs font-body font-medium border transition-all hover:-translate-y-0.5 text-foreground"
            style={{
              borderColor: "rgba(255,255,255,0.22)",
              background: "rgba(0,0,0,0.55)",
            }}
          >
            Esporta CSV
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cerca per nome o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold-2 outline-none"
              style={{
                background: "rgba(0,0,0,0.4)",
                borderColor: "rgba(255,255,255,0.1)",
              }}
            />
          </div>

          <select
            value={filterStato}
            onChange={(e) => setFilterStato(e.target.value)}
            className="px-4 py-2.5 rounded-xl border text-foreground font-body text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.4)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <option value="">Tutti gli stati</option>
            <option value="nuovo">Nuovo</option>
            <option value="in_lavorazione">In lavorazione</option>
            <option value="completato">Completato</option>
          </select>

          <select
            value={filterTipo}
            onChange={(e) => setFilterTipo(e.target.value)}
            className="px-4 py-2.5 rounded-xl border text-foreground font-body text-sm outline-none"
            style={{
              background: "rgba(0,0,0,0.4)",
              borderColor: "rgba(255,255,255,0.1)",
            }}
          >
            <option value="">Tutti i tipi</option>
            <option value="ritratto">Ritratto Personalizzato</option>
            <option value="limitata">Edizione Limitata</option>
            <option value="recensione">Recensione Acquisto</option>
            <option value="info">Informazioni Generali</option>
          </select>
        </div>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{ borderColor: "rgba(255,255,255,0.07)" }}
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["Data", "Nome", "Email", "Tipo", "Anteprima", "Stato", "Azioni"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-body font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-muted-foreground font-body text-sm"
                    >
                      Caricamento...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-8 text-center text-muted-foreground font-body text-sm"
                    >
                      Nessun messaggio
                    </td>
                  </tr>
                ) : (
                  filtered.map((m) => (
                    <tr
                      key={m.id}
                      className="border-t cursor-pointer hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                      style={{ borderColor: "rgba(255,255,255,0.05)" }}
                      onClick={() => {
                        setSelected(m);
                        markRead(m.id);
                      }}
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground font-body whitespace-nowrap">
                        {new Date(m.created_at).toLocaleDateString("it-IT")}
                      </td>

                      <td className="px-4 py-3 text-sm text-foreground font-body font-medium">
                        {!m.letto && (
                          <span className="inline-block w-2 h-2 rounded-full bg-gold mr-2" />
                        )}
                        {m.nome}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground font-body">
                        {m.email}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground font-body capitalize">
                        {m.tipo_richiesta}
                      </td>

                      <td className="px-4 py-3 text-xs text-muted-foreground font-body max-w-[200px] truncate">
                        {m.messaggio.slice(0, 60)}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-body font-semibold ${
                            m.stato === "nuovo"
                              ? "gold-gradient"
                              : m.stato === "completato"
                              ? "bg-green-900/50 text-green-400"
                              : "bg-muted text-muted-foreground"
                          }`}
                          style={m.stato === "nuovo" ? { color: "#000" } : {}}
                        >
                          {statusLabels[m.stato] ?? m.stato}
                        </span>
                      </td>

                      <td className="px-4 py-3">
                        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={m.stato}
                            onChange={(e) => updateStato(m.id, e.target.value)}
                            className="text-[10px] px-2 py-1 rounded-lg border font-body outline-none"
                            style={{
                              background: "rgba(0,0,0,0.4)",
                              borderColor: "rgba(255,255,255,0.1)",
                              color: "hsl(0 0% 96%)",
                            }}
                          >
                            <option value="nuovo">Nuovo</option>
                            <option value="in_lavorazione">In lavorazione</option>
                            <option value="completato">Completato</option>
                          </select>

                          <button
                            onClick={() => deleteMessage(m.id)}
                            className="text-destructive text-xs hover:underline font-body"
                          >
                            Elimina
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selected && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />

            <div
              className="relative glass-panel rounded-2xl p-8 max-w-xl w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="font-display text-xl font-bold text-foreground mb-1">
                {selected.nome}
              </h2>
              <p className="text-sm text-gold font-body mb-1">{selected.email}</p>
              <p className="text-xs text-muted-foreground font-body mb-6">
                {new Date(selected.created_at).toLocaleString("it-IT")} ·{" "}
                {selected.tipo_richiesta}
              </p>

              <div
                className="p-4 rounded-xl mb-6"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >
                <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">
                  {selected.messaggio}
                </p>
              </div>

              <div className="flex gap-3">
                <a
                  href={`mailto:${selected.email}?subject=Re: Richiesta ProjectX&body=Ciao ${selected.nome},%0D%0A%0D%0A`}
                  className="flex-1 py-3 rounded-full font-semibold text-sm text-center gold-gradient gold-glow font-body"
                  style={{ color: "#000" }}
                >
                  Rispondi via Email
                </a>

                <button
                  onClick={() => deleteMessage(selected.id)}
                  className="px-6 py-3 rounded-full text-sm font-body border text-destructive hover:bg-destructive/10 transition-colors"
                  style={{ borderColor: "rgba(255,255,255,0.1)" }}
                >
                  Elimina
                </button>
              </div>
            </div>
          </div>
        )}
      </AdminLayout>
  );
};

export default AdminMessaggi;