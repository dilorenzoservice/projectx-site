import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Email non valida"),
  password: z.string().min(6, "Password troppo corta"),
});

const inputStyle = {
  background: "rgba(0,0,0,0.4)",
  borderColor: "rgba(255,255,255,0.1)",
};

const MAX_ATTEMPTS = 5;
const LOCKOUT_SECONDS = 30;

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [honeypot, setHoneypot] = useState(""); // campo trappola per bot
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate("/admin/dashboard");
    });
  }, [navigate]);

  useEffect(() => {
    if (lockedUntil) {
      timerRef.current = setInterval(() => {
        const remaining = Math.ceil((lockedUntil - Date.now()) / 1000);
        if (remaining <= 0) {
          setLockedUntil(null);
          setCountdown(0);
          setAttempts(0);
          if (timerRef.current) clearInterval(timerRef.current);
        } else {
          setCountdown(remaining);
        }
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [lockedUntil]);

  const isLocked = lockedUntil !== null && Date.now() < lockedUntil;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot: se il campo nascosto è compilato è un bot — rifiuta silenziosamente
    if (honeypot) {
      toast.success("Accesso effettuato"); // risposta falsa per il bot
      return;
    }

    if (loading || isLocked) return;

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });

      if (error) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);

        if (newAttempts >= MAX_ATTEMPTS) {
          const until = Date.now() + LOCKOUT_SECONDS * 1000;
          setLockedUntil(until);
          toast.error(`Troppi tentativi. Attendi ${LOCKOUT_SECONDS} secondi.`);
        } else {
          toast.error(`Credenziali errate. Tentativi rimasti: ${MAX_ATTEMPTS - newAttempts}`);
        }
        return;
      }

      setAttempts(0);
      navigate("/admin/dashboard");
    } catch {
      toast.error("Errore di connessione. Riprova.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass-panel rounded-2xl p-10 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            Admin
          </h1>
          <p className="text-sm text-muted-foreground font-body">
            Accedi al pannello di gestione
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Honeypot nascosto — i bot lo compilano, gli umani no */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
          />

          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none disabled:opacity-50"
              style={inputStyle}
              autoComplete="email"
            />
          </div>

          <div>
            <label className="block text-sm font-body text-muted-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLocked}
              className="w-full px-4 py-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none disabled:opacity-50"
              style={inputStyle}
              autoComplete="current-password"
            />
          </div>

          {isLocked && (
            <div
              className="text-center py-3 rounded-xl text-sm font-body"
              style={{
                background: "rgba(220,50,50,0.1)",
                border: "1px solid rgba(220,50,50,0.3)",
                color: "#f87171",
              }}
            >
              Troppi tentativi. Riprova tra {countdown}s
            </div>
          )}

          <button
            type="submit"
            disabled={loading || isLocked}
            className="w-full py-4 rounded-full font-semibold text-sm gold-gradient gold-glow transition-all duration-200 hover:-translate-y-0.5 gold-glow-hover font-body disabled:opacity-50 disabled:hover:translate-y-0"
            style={{ color: "#000" }}
          >
            {loading ? "Accesso..." : isLocked ? `Bloccato (${countdown}s)` : "Accedi"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
