import { useState, type FormEvent } from "react";
import { Lock } from "lucide-react";
import { signIn, signUp, confirmSignUp, resendConfirmationCode, forgotPassword, confirmForgotPassword } from "./auth";

export function AdminLogin() {
  const [mode, setMode] = useState<"entrar" | "criar" | "confirmar" | "redefinir">("entrar");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setInfo(null);

    if (mode === "entrar") {
      const message = await signIn(email, password);
      setLoading(false);
      if (message) {
        setError("E-mail ou senha incorretos.");
        setPassword("");
      }
      // login bem-sucedido: onAuthChange no AdminApp cuida da transição de tela
      return;
    }

    if (mode === "confirmar") {
      const message = await confirmSignUp(email, code);
      setLoading(false);
      if (message) {
        setError(message);
        return;
      }
      setInfo("E-mail confirmado. Já pode entrar.");
      setMode("entrar");
      setCode("");
      setPassword("");
      return;
    }

    if (mode === "redefinir") {
      const message = await confirmForgotPassword(email, code, newPassword);
      setLoading(false);
      if (message) {
        setError(message);
        return;
      }
      setInfo("Senha redefinida. Já pode entrar.");
      setMode("entrar");
      setCode("");
      setNewPassword("");
      setPassword("");
      return;
    }

    const result = await signUp(email, password);
    setLoading(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setInfo("Enviamos um código de confirmação para o seu e-mail.");
    setMode("confirmar");
  }

  async function handleResendCode() {
    setError(null);
    const message = await resendConfirmationCode(email);
    setInfo(message ? null : "Código reenviado.");
    if (message) setError(message);
  }

  async function handleForgotPassword() {
    if (!email.trim()) {
      setError("Digite seu e-mail primeiro.");
      return;
    }
    setError(null);
    setLoading(true);
    const message = await forgotPassword(email);
    setLoading(false);
    if (message) {
      setError(message);
      return;
    }
    setInfo("Enviamos um código para redefinir sua senha.");
    setMode("redefinir");
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
        <p className="text-white/40 text-sm mb-6">
          {mode === "entrar" && "Acesso restrito. Entre com sua conta para continuar."}
          {mode === "criar" && "Crie sua conta. O acesso às abas é liberado pelo administrador."}
          {mode === "confirmar" && `Digite o código enviado para ${email}.`}
          {mode === "redefinir" && `Digite o código enviado para ${email} e escolha uma senha nova.`}
        </p>

        {(mode === "entrar" || mode === "criar") && (
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
        )}
        {(mode === "entrar" || mode === "criar") && (
          <input
            type="password"
            autoComplete={mode === "entrar" ? "current-password" : "new-password"}
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
        )}
        {mode === "confirmar" && (
          <input
            type="text"
            autoFocus
            inputMode="numeric"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError(null);
            }}
            placeholder="Código de confirmação"
            className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-2 placeholder:text-white/30"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
            }}
          />
        )}
        {mode === "redefinir" && (
          <>
            <input
              type="text"
              autoFocus
              inputMode="numeric"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                setError(null);
              }}
              placeholder="Código de confirmação"
              className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-3 placeholder:text-white/30"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
              }}
            />
            <input
              type="password"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                setError(null);
              }}
              placeholder="Senha nova"
              className="w-full rounded-lg px-4 py-3 text-white text-sm outline-none mb-2 placeholder:text-white/30"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: `1px solid ${error ? "rgba(233,62,143,0.5)" : "rgba(255,255,255,0.1)"}`,
              }}
            />
          </>
        )}
        {error && <p className="text-[#e93e8f] text-xs mb-4">{error}</p>}
        {info && <p className="text-[#c7d300] text-xs mb-4">{info}</p>}

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
          {loading
            ? "..."
            : mode === "entrar"
              ? "ENTRAR"
              : mode === "criar"
                ? "CRIAR CONTA"
                : mode === "redefinir"
                  ? "REDEFINIR SENHA"
                  : "CONFIRMAR"}
        </button>

        {mode === "entrar" && (
          <button
            type="button"
            onClick={handleForgotPassword}
            className="w-full mt-3 text-center text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Esqueci minha senha
          </button>
        )}

        {mode === "confirmar" ? (
          <button
            type="button"
            onClick={handleResendCode}
            className="w-full mt-3 text-center text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Reenviar código
          </button>
        ) : mode === "redefinir" ? (
          <button
            type="button"
            onClick={() => {
              setMode("entrar");
              setCode("");
              setNewPassword("");
              setError(null);
              setInfo(null);
            }}
            className="w-full mt-3 text-center text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            Voltar para o login
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              setMode(mode === "entrar" ? "criar" : "entrar");
              setError(null);
              setInfo(null);
            }}
            className="w-full mt-3 text-center text-xs text-white/30 hover:text-white/60 transition-colors"
          >
            {mode === "entrar" ? "Não tem conta? Criar conta" : "Já tem conta? Entrar"}
          </button>
        )}
      </form>
    </div>
  );
}
