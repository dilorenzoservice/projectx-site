import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { MessageSquare, Image, DollarSign, Mail } from "lucide-react";

interface Stats {
  messaggiOggi: number;
  messaggiNonLetti: number;
  opereGalleria: number;
  ultimoAggiornamentoPrezzi: string;
  messaggiPerSettimana: { week: string; count: number }[];
}

const emptyStats: Stats = {
  messaggiOggi: 0,
  messaggiNonLetti: 0,
  opereGalleria: 0,
  ultimoAggiornamentoPrezzi: "N/D",
  messaggiPerSettimana: [],
};

const AdminDashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const [messagesRes, unreadRes, galleryRes, prezziRes] = await Promise.all([
          supabase
            .from("contact_messages")
            .select("id", { count: "exact" })
            .gte("created_at", today),

          supabase
            .from("contact_messages")
            .select("id", { count: "exact" })
            .eq("letto", false),

          supabase
            .from("galleria")
            .select("id", { count: "exact" }),

          supabase
            .from("prezzi")
            .select("updated_at")
            .order("updated_at", { ascending: false })
            .limit(1),
        ]);

        const thirtyDaysAgo = new Date(
          Date.now() - 30 * 24 * 60 * 60 * 1000
        ).toISOString();

        const { data: recentMessages, error: recentError } = await supabase
          .from("contact_messages")
          .select("created_at")
          .gte("created_at", thirtyDaysAgo);

        if (
          messagesRes.error ||
          unreadRes.error ||
          galleryRes.error ||
          prezziRes.error ||
          recentError
        ) {
          throw new Error("Errore caricamento dashboard");
        }

        const weekMap: Record<string, number> = {};

        (recentMessages || []).forEach((m) => {
          const date = new Date(m.created_at);
          const weekStart = new Date(date);

          weekStart.setDate(date.getDate() - date.getDay());

          const key = weekStart.toISOString().split("T")[0];
          weekMap[key] = (weekMap[key] || 0) + 1;
        });

        const messaggiPerSettimana = Object.entries(weekMap)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([week, count]) => ({ week, count }));

        setStats({
          messaggiOggi: messagesRes.count || 0,
          messaggiNonLetti: unreadRes.count || 0,
          opereGalleria: galleryRes.count || 0,
          ultimoAggiornamentoPrezzi: prezziRes.data?.[0]?.updated_at
            ? new Date(prezziRes.data[0].updated_at!).toLocaleDateString("it-IT")
            : "Mai",
          messaggiPerSettimana,
        });
      } catch {
        setStats(emptyStats);
      }
    };

    fetchStats();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Messaggi oggi",
          value: stats.messaggiOggi,
          icon: Mail,
          badge: null,
        },
        {
          label: "Non letti",
          value: stats.messaggiNonLetti,
          icon: MessageSquare,
          badge: stats.messaggiNonLetti > 0 ? stats.messaggiNonLetti : null,
        },
        {
          label: "Opere in galleria",
          value: stats.opereGalleria,
          icon: Image,
          badge: null,
        },
        {
          label: "Ultimo agg. prezzi",
          value: stats.ultimoAggiornamentoPrezzi,
          icon: DollarSign,
          badge: null,
        },
      ]
    : [];

  return (
      <AdminLayout>
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Panoramica
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Benvenuto nel pannello di gestione ProjectX
          </p>
        </div>

        {!stats ? (
          <p className="text-muted-foreground font-body">Caricamento...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
              {statCards.map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl p-6 border relative"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    borderColor: "rgba(212,175,55,0.2)",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <card.icon className="w-5 h-5 text-gold" />
                    {card.badge !== null && (
                      <span className="w-5 h-5 rounded-full bg-destructive flex items-center justify-center text-[10px] font-bold text-foreground">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  <p className="font-display text-2xl font-bold text-gold mb-1">
                    {card.value}
                  </p>
                  <p className="text-xs text-muted-foreground font-body">
                    {card.label}
                  </p>
                </div>
              ))}
            </div>

            <div
              className="rounded-2xl p-6 border"
              style={{
                background: "rgba(255,255,255,0.04)",
                borderColor: "rgba(212,175,55,0.2)",
              }}
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-6">
                Messaggi ultimi 30 giorni
              </h3>

              {stats.messaggiPerSettimana.length === 0 ? (
                <p className="text-sm text-muted-foreground font-body">
                  Nessun messaggio negli ultimi 30 giorni
                </p>
              ) : (
                <div className="flex items-end gap-3 h-40">
                  {stats.messaggiPerSettimana.map((w) => {
                    const max = Math.max(
                      ...stats.messaggiPerSettimana.map((x) => x.count),
                      1
                    );
                    const height = (w.count / max) * 100;

                    return (
                      <div key={w.week} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-gold font-body">{w.count}</span>

                        <div
                          className="w-full rounded-t-lg gold-gradient"
                          style={{ height: `${Math.max(height, 5)}%` }}
                        />

                        <span className="text-[10px] text-muted-foreground font-body">
                          {new Date(w.week).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "2-digit",
                          })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </AdminLayout>
  );
};

export default AdminDashboard;