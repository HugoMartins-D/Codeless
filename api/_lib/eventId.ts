/**
 * IDs de evento do Google são strings simples, mas os do iCloud são URLs inteiras
 * (ex: https://.../evento.ics) — não dá pra usar direto num path /events/:id. Por
 * isso todo evento exposto pro frontend carrega um id composto "provider.base64url".
 */
export function encodeEventId(provider: "google" | "apple", externalId: string): string {
  const encoded = Buffer.from(externalId, "utf-8").toString("base64url");
  return `${provider}.${encoded}`;
}

export function decodeEventId(id: string): { provider: "google" | "apple"; externalId: string } {
  const [provider, encoded] = id.split(".", 2);
  if ((provider !== "google" && provider !== "apple") || !encoded) throw new Error("Id de evento inválido.");
  return { provider, externalId: Buffer.from(encoded, "base64url").toString("utf-8") };
}
