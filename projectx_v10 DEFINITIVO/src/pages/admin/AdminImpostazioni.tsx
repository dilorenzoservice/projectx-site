import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AdminImpostazioni = () => {
  const [email, setEmail] = useState("");
  const [currentEmail, setCurrentEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingLogout, setLoadingLogout] = useState(false);
  const navigate = useNavigate();

  const inputStyle = {
    background: "rgba(0,0,0,0.4)",
    borderColor: "rgba(255,255,255,0.1)",
  };

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user?.email) {
        setCurrentEmail(data.user.email);
        setEmail(data.user.email);
      }
    });
  }, []);

  const handleUpdateEmail = async () => {
    if (!email.trim() || email === currentEmail) return;
    setLoadingEmail(true);

    const { error } = await supabase.auth.updateUser({ email: email.trim() });
    setLoadingEmail(false);

    if (error) {
      toast.error("Errore aggiornamento email: " + error.message);
    } else {
      toast.success("Email aggiornata. Controlla la tua casella per confermare.");
      setCurrentEmail(email.trim());
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || !confirmPassword) {
      toast.error("Compila entrambi i campi password");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("La password deve essere di almeno 6 caratteri");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Le password non coincidono");
      return;
    }

    setLoadingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setLoadingPassword(false);

    if (error) {
      toast.error("Errore aggiornamento password: " + error.message);
    } else {
      toast.success("Password aggiornata con successo");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const handleLogout = async () => {
    setLoadingLogout(true);
    await supabase.auth.signOut();
    setLoadingLogout(false);
    navigate("/admin/login");
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground mb-1">
          Impostazioni
        </h1>
        <p className="text-sm text-muted-foreground font-body">
          Gestisci le credenziali di accesso al pannello admin
        </p>
      </div>

      <div className="max-w-lg space-y-6">

        {/* EMAIL */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Email di accesso
          </h2>

          <p className="text-xs text-muted-foreground font-body mb-3">
            Email attuale: <span className="text-gold">{currentEmail}</span>
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nuova email"
            className="w-full px-4 py-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none mb-3"
            style={inputStyle}
            autoComplete="email"
          />

          <button
            onClick={handleUpdateEmail}
            disabled={loadingEmail || email === currentEmail || !email.trim()}
            className="w-full py-3 rounded-full gold-gradient text-black text-sm font-semibold disabled:opacity-40"
          >
            {loadingEmail ? "Aggiornamento..." : "Aggiorna email"}
          </button>
        </div>

        {/* PASSWORD */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-4">
            Cambia password
          </h2>

          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nuova password"
            className="w-full px-4 py-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none mb-3"
            style={inputStyle}
            autoComplete="new-password"
          />

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Conferma password"
            className="w-full px-4 py-3 rounded-xl border text-foreground font-body text-sm focus:ring-1 focus:ring-gold outline-none mb-3"
            style={inputStyle}
            autoComplete="new-password"
          />

          <button
            onClick={handleUpdatePassword}
            disabled={loadingPassword || !newPassword || !confirmPassword}
            className="w-full py-3 rounded-full gold-gradient text-black text-sm font-semibold disabled:opacity-40"
          >
            {loadingPassword ? "Aggiornamento..." : "Cambia password"}
          </button>
        </div>

        {/* LOGOUT */}
        <div
          className="p-6 rounded-2xl border"
          style={{
            background: "rgba(255,255,255,0.04)",
            borderColor: "rgba(255,255,255,0.08)",
          }}
        >
          <h2 className="font-display text-lg font-semibold text-foreground mb-2">
            Sessione
          </h2>
          <p className="text-xs text-muted-foreground font-body mb-4">
            Disconnettiti dal pannello admin su questo dispositivo.
          </p>

          <button
            onClick={handleLogout}
            disabled={loadingLogout}
            className="w-full py-3 rounded-full border text-sm font-semibold text-destructive disabled:opacity-40"
            style={{ borderColor: "rgba(255,255,255,0.12)" }}
          >
            {loadingLogout ? "Disconnessione..." : "Disconnetti"}
          </button>
        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminImpostazioni;
