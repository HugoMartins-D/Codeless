import { Clock } from "lucide-react";
import { signOut } from "./auth";

export function AdminPending({ email }: { email: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
      <div
        className="w-full max-w-sm rounded-2xl p-8 text-center"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-6 mx-auto"
          style={{ background: "rgba(245,196,0,0.10)", border: "1px solid rgba(245,196,0,0.25)" }}
        >
          <Clock size={18} className="text-[#f5c400]" />
        </div>
        <h1 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
          Aguardando liberação
        </h1>
        <p className="text-white/40 text-sm mb-1">
          Sua conta ({email}) foi criada, mas ainda não tem acesso a nenhuma aba.
        </p>
        <p className="text-white/40 text-sm mb-6">Fale com o administrador do painel para liberar seu acesso.</p>
        <button
          onClick={() => signOut()}
          className="text-xs text-white/30 hover:text-white/60 transition-colors"
        >
          Sair
        </button>
      </div>
    </div>
  );
}
