import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { LayoutDashboard, MessageSquare, DollarSign, Image, FileText, Settings, LogOut, Menu, X } from "lucide-react";
import logo from "@/assets/logo.webp";

const navItems = [
  { label: "Panoramica", icon: LayoutDashboard, to: "/admin/dashboard" },
  { label: "Messaggi", icon: MessageSquare, to: "/admin/messaggi" },
  { label: "Prezzi", icon: DollarSign, to: "/admin/prezzi" },
  { label: "Galleria", icon: Image, to: "/admin/galleria" },
  { label: "Contenuti", icon: FileText, to: "/admin/contenuti" },
  { label: "Impostazioni", icon: Settings, to: "/admin/impostazioni" },
  { label: "Recensioni", icon: MessageSquare, to: "/admin/recensioni" },
];

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const Sidebar = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 flex items-center gap-3">
        <img src={logo} alt="ProjectX" className="w-9 h-9 rounded-full" />
        <span className="font-display text-lg font-semibold text-foreground">
          Admin
        </span>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm transition-all duration-200 ${
                active
                  ? "gold-gradient font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-[rgba(255,255,255,0.05)]"
              }`}
              style={active ? { color: "#000" } : {}}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-muted-foreground hover:text-foreground transition-colors mb-1">
          ← Torna al sito
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm text-destructive hover:bg-[rgba(255,0,0,0.05)] transition-colors w-full"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex">
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:block w-64 fixed top-0 left-0 h-full border-r"
        style={{ background: "rgba(0,0,0,0.6)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
      >
        <Sidebar />
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-4 border-b"
        style={{ background: "rgba(0,0,0,0.9)", borderColor: "rgba(255,255,255,0.07)", backdropFilter: "blur(20px)" }}
      >
        <div className="flex items-center gap-2">
          <img src={logo} alt="" className="w-7 h-7 rounded-full" />
          <span className="font-display text-base font-semibold text-foreground">Admin</span>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-foreground">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="absolute inset-0 bg-background/80" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-14 bottom-0 w-64 border-r"
            style={{ background: "rgba(0,0,0,0.95)", borderColor: "rgba(255,255,255,0.07)" }}
          >
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 lg:ml-64 pt-14 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
