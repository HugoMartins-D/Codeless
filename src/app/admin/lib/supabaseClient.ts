import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  console.error(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY (local: .env.local, veja .env.example; produção: variáveis de ambiente do projeto na Vercel). O painel /admin não vai conseguir ler ou gravar dados até isso ser configurado.",
  );
}

// createClient throws synchronously on an invalid/missing URL, which would crash
// the whole app at module-eval time (this file is imported by every admin module,
// pulled into the same bundle as the public site). Fall back to a harmless
// placeholder so a missing config degrades to failed network calls instead.
export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: {
    // sessionStorage é isolado por aba (ao contrário do localStorage, que é
    // compartilhado por todas as abas do mesmo site) — permite logar em
    // contas diferentes em abas diferentes. Em troca, fechar a aba desloga.
    storage: window.sessionStorage,
  },
});
