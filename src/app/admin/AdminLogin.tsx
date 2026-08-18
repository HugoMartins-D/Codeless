import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { signIn } from "./auth";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const message = await signIn(email, password);
    setLoading(false);
    if (message) {
      setError("E-mail ou senha incorretos.");
      setPassword("");
    }
    // login bem-sucedido: onAuthChange no AdminApp cuida da transição de tela
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
        <p className="text-white/40 text-sm mb-6">Acesso restrito. Entre com sua conta para continuar.</p>

        <input
          type="email"
          autoFocus
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="E-mail"
          className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-3 placeholder:text-white/30"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
          }}
        />
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError(null);
          }}
          placeholder="Senha"
          className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-2 placeholder:text-white/30"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
          }}
        />
        {error && <p className="text-[#e93e8f] text-xs mb-4">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 rounded-lg py-3 text-sm tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 700,
            background: "rgba(199,211,0,0.10)",
            border: "1px solid rgba(199,211,0,0.30)",
            color: "#c7d300",
          }}
        >
          {loading ? "ENTRANDO..." : "ENTRAR"}
        </button>
      </form>
    </div>
  );
}
