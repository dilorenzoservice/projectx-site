import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "@/assets/logo.webp";
import { scrollToSection } from "@/lib/scrollToSection";

const navLinks = [
  { label: "Home", id: "hero" },
  { label: "Galleria", id: "galleria" },
  { label: "Processo", id: "processo" },
  { label: "Prezzi", id: "prezzi" },
  { label: "Contatti", id: "contatti" },
];

const infoLinks = [
  { label: "Chi Siamo", to: "/chi-siamo" },
  { label: "FAQ", to: "/faq" },
  { label: "Privacy", to: "/privacy" },
  { label: "Termini", to: "/termini" },
  { label: "Social", to: "/social" },
];

export const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Ref per tenere traccia dell'interval e pulirlo se il componente si smonta
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setInfoOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setInfoOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Cleanup interval se il componente si smonta durante la navigazione
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleNavClick = (id: string) => {
    setMobileOpen(false);
    setInfoOpen(false);

    if (location.pathname === "/") {
      scrollToSection(id);
    } else {
      navigate("/");
      // Pulisce eventuale interval precedente
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        const el = document.getElementById(id);
        if (el) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          scrollToSection(id);
        }
      }, 50);
    }
  };

  return (
    <>
      <header
        className="fixed top-3 left-4 right-4 z-[100] transition-all duration-300 rounded-[26px] backdrop-blur-xl border"
        style={{
          background: "rgba(0,0,0,0.82)",
          borderColor: "rgba(255,255,255,0.07)",
          boxShadow: scrolled
            ? "0 20px 50px rgba(0,0,0,.9)"
            : "0 10px 30px rgba(0,0,0,.6)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-4 group shrink-0">
            <div
              className="relative overflow-hidden rounded-full transition-all duration-300 group-hover:scale-[1.05]"
              style={{
                width: "52px",
                height: "52px",
                boxShadow: "0 10px 24px rgba(0,0,0,0.55)",
                border: "1px solid rgba(212,175,55,0.25)",
              }}
            >
              <img
                src={logo}
                alt="ProjectX"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex flex-col leading-none">
              <span
                className="font-display"
                style={{
                  fontSize: "1.9rem",
                  fontWeight: 500,
                  color: "#F5F1E8",
                  letterSpacing: "0.08em",
                  textShadow: "0 2px 12px rgba(0,0,0,0.55)",
                }}
              >
                PROJECT <span style={{ color: "#D4AF37" }}>X</span>
              </span>

              <span
                className="hidden xl:block font-body"
                style={{
                  fontSize: "0.65rem",
                  letterSpacing: "0.30em",
                  textTransform: "uppercase",
                  color: "rgba(212,175,55,0.7)",
                  marginTop: "0.2rem",
                }}
              >
                Arte · Resina · Edizione Limitata
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.id)}
                className="relative text-[0.82rem] font-body font-semibold transition-all duration-200 group"
                style={{
                  color: "#D4AF37",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                {link.label}

                <span
                  className="absolute left-0 -bottom-1 w-0 h-px group-hover:w-full transition-all duration-200"
                  style={{
                    background: "linear-gradient(90deg,#F9E79F,#D4AF37)",
                  }}
                />
              </button>
            ))}

            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setInfoOpen((v) => !v)}
                className="flex items-center gap-1.5 text-[0.82rem] font-body font-semibold"
                style={{
                  color: "#D4AF37",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Info
                <ChevronDown
                  className={`w-3.5 h-3.5 transition ${infoOpen ? "rotate-180" : ""}`}
                />
              </button>

              {infoOpen && (
                <div
                  className="absolute right-0 top-[calc(100%+8px)] py-2 rounded-2xl min-w-[190px]"
                  style={{
                    background: "rgba(0,0,0,0.95)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    boxShadow: "0 25px 60px rgba(0,0,0,0.9)",
                  }}
                >
                  {infoLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.to}
                      onClick={() => setInfoOpen(false)}
                      className="block px-5 py-3 text-sm font-body font-semibold hover:bg-white/5 transition"
                      style={{
                        color: "#D4AF37",
                        letterSpacing: "0.08em",
                      }}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <button
            className="lg:hidden text-gold p-1"
            onClick={() => setMobileOpen(true)}
            aria-label="Apri menu"
          >
            <Menu className="w-7 h-7" />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="fixed inset-0 z-[200] backdrop-blur-xl bg-black/95 overflow-y-auto">
          <button
            className="absolute top-6 right-6 text-white"
            onClick={() => setMobileOpen(false)}
            aria-label="Chiudi menu"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
            <nav className="flex flex-col items-center gap-7">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.id)}
                  className="font-display text-3xl font-semibold tracking-[0.03em] text-white hover:text-gold transition"
                >
                  {link.label}
                </button>
              ))}
            </nav>

            <div className="w-16 h-px bg-white/10 my-10" />

            <div className="flex flex-col items-center gap-4">
              {infoLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-body uppercase tracking-[0.22em] text-gold/90 hover:text-gold transition"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
