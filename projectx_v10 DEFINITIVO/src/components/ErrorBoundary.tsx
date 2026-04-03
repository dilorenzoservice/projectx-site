import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; fallback?: ReactNode; }
interface State { hasError: boolean; error?: Error; }

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="max-w-md text-center">
            <div className="font-display text-6xl font-bold mb-6"
              style={{ background: "linear-gradient(135deg,#F9E79F,#D4AF37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Ops
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-4">
              Qualcosa non ha funzionato
            </h2>
            <p className="text-muted-foreground font-body text-sm mb-8 leading-relaxed">
              Si è verificato un errore inaspettato. Prova a ricaricare la pagina — se il problema persiste contatta info@projectxitalia.com
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-8 py-3 rounded-full font-semibold text-sm gold-gradient gold-glow font-body"
              style={{ color: "#000" }}
            >
              Ricarica la pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
