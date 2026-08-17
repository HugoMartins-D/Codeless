import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !anonKey) {
  console.error(
    "Supabase não configurado: defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY em .env.local (veja .env.example).",
  );
}

export const supabase = createClient(url, anonKey);
