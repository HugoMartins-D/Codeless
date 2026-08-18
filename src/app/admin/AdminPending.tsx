import { Clock, Ban, CheckCircle2 } from "lucide-react";
import { signOut } from "./auth";
import type { CollaboratorStatus } from "./types";

const copy: Record<CollaboratorStatus, { icon: typeof Clock; color: string; title: string; lines: string[] }> = {
  pending: {
    icon: Clock,
    color: "#f5c400",
    title: "Aguardando liberação",
    lines: ["ainda não foi aprovada pelo administrador.", "Fale com o administrador do painel para liberar seu acesso."],
  },
  denied: {
    icon: Ban,
    color: "#e93e8f",
    title: "Acesso negado",
    lines: ["não tem permissão para entrar neste painel.", "Se você acha que isso é um engano, fale com o administrador."],
  },
  approved: {
    icon: CheckCircle2,
    color: "#c7d300",
    title: "Conta aprovada",
    lines: ["já foi aprovada, mas ainda não tem nenhuma aba liberada.", "Fale com o administrador para receber acesso às abas."],
  },
};

export function AdminPending({ email, status }: { email: string; status: CollaboratorStatus }) {
  const { icon: Icon, color, title, lines } = copy[status];

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
          style={{ background: `${color}1a`, border: `1px solid ${color}40` }}
        >
          <Icon size={18} style={{ color }} />
        </div>
        <h1 className="text-white text-xl mb-2" style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}>
          {title}
        </h1>
        <p className="text-white/40 text-sm mb-1">
          Sua conta ({email}) {lines[0]}
        </p>
        <p className="text-white/40 text-sm mb-6">{lines[1]}</p>
        <button onClick={() => signOut()} className="text-xs text-white/30 hover:text-white/60 transition-colors">
          Sair
        </button>
      </div>
    </div>
  );
}
