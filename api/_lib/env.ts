/**
 * O banco Postgres foi conectado ao projeto pela aba Storage da Vercel (integração
 * Neon), que injeta as variáveis de ambiente sozinha com um prefixo (ex: STORAGE_*)
 * cujo nome exato não é garantido. Em vez de fixar um nome, procuramos qualquer
 * variável cujo valor pareça uma connection string Postgres.
 */
export function resolveDatabaseUrl(): string {
  const direct = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (direct) return direct;

  const candidates = Object.entries(process.env)
    .filter(([key, value]) => /URL/i.test(key) && typeof value === "string" && /^postgres(ql)?:\/\//i.test(value))
    .sort(([a], [b]) => {
      // Prioriza a URL "pooled" (boa pra serverless) sobre a "non_pooling"/"unpooled".
      const score = (k: string) => (/non_?pooling|unpooled|direct/i.test(k) ? 1 : 0);
      return score(a) - score(b);
    });

  if (candidates.length === 0) {
    throw new Error(
      "Nenhuma connection string Postgres encontrada nas variáveis de ambiente. Confirme que o banco foi conectado ao projeto na aba Storage da Vercel.",
    );
  }
  return candidates[0][1] as string;
}

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Variável de ambiente ${name} não configurada.`);
  return value;
}
