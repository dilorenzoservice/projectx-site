import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["contact_messages"]["Row"];

const AdminRecensioni = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState<string | null>(null);

  const fetchReviews = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .eq("tipo_richiesta", "recensione")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Errore caricamento recensioni");
      setReviews([]);
      setLoading(false);
      return;
    }

    setReviews(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const approveReview = async (id: string) => {
    setWorkingId(id);

    const { error } = await supabase
      .from("contact_messages")
      .update({ stato: "completato", letto: true })
      .eq("id", id);

    setWorkingId(null);

    if (error) {
      toast.error("Errore approvazione recensione");
      return;
    }

    toast.success("Recensione approvata");
    fetchReviews();
  };

  const deleteReview = async (id: string) => {
    if (!confirm("Eliminare recensione?")) return;

    setWorkingId(id);

    const { error } = await supabase
      .from("contact_messages")
      .delete()
      .eq("id", id);

    setWorkingId(null);

    if (error) {
      toast.error("Errore eliminazione recensione");
      return;
    }

    toast.success("Recensione eliminata");
    fetchReviews();
  };

  return (
      <AdminLayout>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-1">
            Recensioni
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Gestisci le recensioni ricevute dal modulo contatti
          </p>
        </div>

        {loading ? (
          <p className="text-muted-foreground font-body">Caricamento...</p>
        ) : reviews.length === 0 ? (
          <p className="text-muted-foreground font-body">Nessuna recensione</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => {
              const approved = r.stato === "completato";

              return (
                <div
                  key={r.id}
                  className="p-5 rounded-2xl border"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(255,255,255,0.08)",
                  }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p className="font-display text-lg font-semibold text-foreground">
                          {r.nome}
                        </p>

                        <span
                          className={`px-3 py-1 rounded-full text-[10px] font-body font-semibold ${
                            approved
                              ? "bg-green-900/50 text-green-400"
                              : "gold-gradient"
                          }`}
                          style={approved ? {} : { color: "#000" }}
                        >
                          {approved ? "APPROVATA" : "IN ATTESA"}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground font-body mt-1">
                        {r.email}
                      </p>

                      <p className="text-xs text-muted-foreground font-body mt-2">
                        {new Date(r.created_at).toLocaleString("it-IT")}
                      </p>
                    </div>

                    <div className="flex gap-3">
                      {!approved && (
                        <button
                          onClick={() => approveReview(r.id)}
                          disabled={workingId === r.id}
                          className="px-4 py-2 rounded-full gold-gradient text-black text-sm font-semibold disabled:opacity-50"
                        >
                          {workingId === r.id ? "Attendi..." : "Approva"}
                        </button>
                      )}

                      <button
                        onClick={() => deleteReview(r.id)}
                        disabled={workingId === r.id}
                        className="px-4 py-2 rounded-full border text-sm text-destructive font-medium disabled:opacity-50"
                        style={{ borderColor: "rgba(255,255,255,0.12)" }}
                      >
                        Elimina
                      </button>
                    </div>
                  </div>

                  <div
                    className="mt-4 p-4 rounded-xl"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    <p className="text-sm text-foreground font-body leading-relaxed whitespace-pre-wrap">
                      {r.messaggio}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </AdminLayout>
  );
};

export default AdminRecensioni;