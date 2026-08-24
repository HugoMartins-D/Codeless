import { userPool } from "./cognitoClient";

const API_BASE = (import.meta.env.VITE_API_BASE_URL as string | undefined) || "https://j8dk3uu1p5.execute-api.sa-east-1.amazonaws.com";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.error("API não configurada explicitamente: defina VITE_API_BASE_URL (usando o endpoint padrão do projeto por enquanto).");
}

/** Pega o idToken da sessão Cognito atual (renovando se expirado), ou null se não há sessão. */
function getIdToken(): Promise<string | null> {
  const user = userPool.getCurrentUser();
  if (!user) return Promise.resolve(null);
  return new Promise((resolve) => {
    user.getSession((err: Error | null, session: any) => {
      if (err || !session?.isValid()) return resolve(null);
      resolve(session.getIdToken().getJwtToken());
    });
  });
}

export async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getIdToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${API_BASE}${path}`, { ...init, headers });
}

export async function apiGet<T>(path: string): Promise<T | null> {
  const res = await apiFetch(path);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET ${path} -> ${res.status}`);
  return res.json();
}

export async function apiSend(path: string, method: "POST" | "PUT" | "DELETE", body?: unknown): Promise<void> {
  const res = await apiFetch(path, { method, body: body !== undefined ? JSON.stringify(body) : undefined });
  if (!res.ok) throw new Error(`${method} ${path} -> ${res.status}`);
}
