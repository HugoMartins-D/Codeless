import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { tryAdminLogin } from "./auth";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (tryAdminLogin(password)) {
      onSuccess();
    } else {
      setError(true);
      setPassword("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-2xl p-8"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 8px 48px rgba(0,0,0,0.4)",
        }}
      >
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center mb-6"
          style={{ background: "rgba(199,211,0,0.10)", border: "1px solid rgba(199,211,0,0.25)" }}
        >
          <Lock size={18} className="text-[#c7d300]" />
        </div>
        <h1
          className="text-white text-xl mb-1"
          style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
        >
          Painel interno
        </h1>
        <p className="text-white/40 text-sm mb-6">Acesso restrito. Digite a senha para continuar.</p>

        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(false);
          }}
          placeholder="Senha"
          className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-2 placeholder:text-white/30"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
          }}
        />
        {error && <p className="text-[#e93e8f] text-xs mb-4">Senha incorreta.</p>}

        <button
          type="submit"
          className="w-full mt-4 rounded-lg py-3 text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            background: "rgba(199,211,0,0.10)",
            border: "1px solid rgba(199,211,0,0.30)",
            color: "#c7d300",
          }}
        >
          ENTRAR
        </button>
      </form>
    </div>
  );
}
