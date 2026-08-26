import { userPool } from "./cognitoClient";

/**
 * Diferente de apiClient.ts (que fala com a API AWS antiga), a Agenda usa funções
 * serverless do próprio projeto Vercel (pasta /api), então os caminhos são
 * relativos — mesma origem do painel, sem CORS.
 */
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

async function calendarFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = await getIdToken();
  const headers = new Headers(init?.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`/api${path}`, { ...init, headers });
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    return data.error || `Erro ${res.status}`;
  } catch {
    return `Erro ${res.status}`;
  }
}

export interface CalendarAccount {
  provider: "google" | "apple";
  email: string;
}

export interface CalendarEvent {
  id: string;
  provider: "google" | "apple";
  title: string;
  description?: string;
  start: string;
  end: string;
  contractId?: string;
  taskId?: string;
}

export interface CalendarEventInput {
  provider: "google" | "apple";
  title: string;
  description?: string;
  start: string;
  end: string;
  contractId?: string;
  taskId?: string;
}

export async function listAccounts(): Promise<CalendarAccount[]> {
  const res = await calendarFetch("/calendar/accounts");
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = await res.json();
  return data.accounts;
}

export async function disconnectAccount(provider: "google" | "apple"): Promise<void> {
  const path = provider === "google" ? `/calendar/accounts?provider=google` : `/calendar/apple/connect`;
  const res = await calendarFetch(path, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function getGoogleAuthUrl(): Promise<string> {
  const res = await calendarFetch("/calendar/google/auth-url");
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = await res.json();
  return data.url;
}

export async function connectApple(icloudEmail: string, appSpecificPassword: string): Promise<void> {
  const res = await calendarFetch("/calendar/apple/connect", { method: "POST", body: JSON.stringify({ icloudEmail, appSpecificPassword }) });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function listEvents(): Promise<CalendarEvent[]> {
  const res = await calendarFetch("/calendar/events");
  if (!res.ok) throw new Error(await parseErrorMessage(res));
  const data = await res.json();
  return data.events;
}

export async function createEvent(input: CalendarEventInput): Promise<void> {
  const res = await calendarFetch("/calendar/events", { method: "POST", body: JSON.stringify(input) });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function updateEvent(id: string, input: Omit<CalendarEventInput, "provider">): Promise<void> {
  const res = await calendarFetch(`/calendar/events/${encodeURIComponent(id)}`, { method: "PUT", body: JSON.stringify(input) });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}

export async function deleteEvent(id: string): Promise<void> {
  const res = await calendarFetch(`/calendar/events/${encodeURIComponent(id)}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await parseErrorMessage(res));
}
