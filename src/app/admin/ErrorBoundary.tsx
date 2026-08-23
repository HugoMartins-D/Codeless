import { Component, type ReactNode } from "react";

export class AdminErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error("[admin] erro não tratado:", error);
  }

  render() {
    if (this.state.error) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6 text-center">
          <div>
            <p className="text-white/80 text-sm mb-2">O painel interno encontrou um erro e não pôde carregar.</p>
            <p className="text-white/30 text-xs">Algo deu errado. Tente recarregar a página.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
