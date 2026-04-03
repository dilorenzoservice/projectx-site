import { Link, useNavigate } from "react-router-dom";
import logo from "@/assets/logo.webp";
import { scrollToSection } from "@/lib/scrollToSection";

const quickLinks = [
  { label: "Home", id: "hero" },
  { label: "Galleria", id: "galleria" },
  { label: "Processo", id: "processo" },
  { label: "Prezzi", id: "prezzi" },
  { label: "Contatti", id: "contatti" },
];

// SVG loghi ufficiali dei social
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.98a8.21 8.21 0 004.76 1.52V7.05a4.84 4.84 0 01-1-.36z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const socialLinks = [
  {
    name: "Instagram",
    url: "https://instagram.com/projectxitalia_",
    icon: <InstagramIcon />,
    label: "Seguici su Instagram",
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@projectxitalia",
    icon: <TikTokIcon />,
    label: "Seguici su TikTok",
  },
  {
    name: "Facebook",
    url: "https://facebook.com/projectxita",
    icon: <FacebookIcon />,
    label: "Seguici su Facebook",
  },
];

export const Footer = () => {
  const navigate = useNavigate();

  const handleNavClick = (id: string) => {
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => scrollToSection(id), 100);
    } else {
      scrollToSection(id);
    }
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative mt-20">
      <div className="gold-line w-full" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* LOGO + TAGLINE */}
          <div>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-3 mb-4 text-left"
            >
              <img src={logo} alt="ProjectX" className="w-10 h-10 rounded-full" />
              <span className="font-display text-lg font-semibold text-foreground">
                Project<span className="text-gold">X</span>
              </span>
            </button>
            <p className="text-sm text-muted-foreground font-body italic">
              "Dove la storia incontra il futuro."
            </p>
          </div>

          {/* NAVIGAZIONE */}
          <div>
            <h4 className="footer-title">Navigazione</h4>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <button
                    onClick={() => handleNavClick(link.id)}
                    className="footer-link"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* INFO */}
          <div>
            <h4 className="footer-title">Info</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Chi Siamo", to: "/chi-siamo" },
                { label: "FAQ", to: "/faq" },
                { label: "Social", to: "/social" },
              ].map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="footer-link">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* SOCIAL con icone SVG reali */}
          <div>
            <h4 className="footer-title">Seguici</h4>
            <div className="flex gap-4 mt-2">
              {socialLinks.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="footer-icon hover:text-gold hover:scale-110 transition-all duration-200"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Email di contatto nel footer */}
            <div className="mt-6">
              <h4 className="footer-title">Contatti</h4>
              <a
                href="mailto:info@projectxitalia.com"
                className="footer-link hover:text-gold transition-colors text-xs block"
              >
                info@projectxitalia.com
              </a>
            </div>
          </div>
        </div>

        <div className="gold-line w-full mt-12 mb-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground font-body">
          <p>
            © {new Date().getFullYear()} ProjectX — Made in Italy · Ignis · P.IVA IT04496940711
          </p>
          <div className="flex gap-4">
            <Link to="/cookie-policy" className="footer-link">Cookie</Link>
            <Link to="/privacy" className="footer-link">Privacy</Link>
            <Link to="/termini" className="footer-link">Termini</Link>
            <button
              onClick={() => {
                localStorage.removeItem("cookie-consent");
                window.location.reload();
              }}
              className="footer-link"
            >
              Cookie settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
