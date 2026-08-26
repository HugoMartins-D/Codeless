import { requireEnv } from "./env.js";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_BASE = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const SCOPE = "https://www.googleapis.com/auth/calendar";

async function json(res: Response): Promise<any> {
  return res.json();
}

export interface GoogleCredentials {
  refreshToken: string;
  accessToken: string;
  expiresAt: number; // epoch ms
  email: string;
}

export function buildGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: requireEnv("GOOGLE_CLIENT_ID"),
    redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
    response_type: "code",
    scope: `${SCOPE} openid email`,
    access_type: "offline",
    prompt: "consent",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function exchangeGoogleCode(code: string): Promise<GoogleCredentials> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      redirect_uri: requireEnv("GOOGLE_REDIRECT_URI"),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) throw new Error(`Falha ao trocar código do Google: ${res.status} ${await res.text()}`);
  const data = await json(res);
  const email = await fetchGoogleEmail(data.access_token);
  return {
    refreshToken: data.refresh_token,
    accessToken: data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
    email,
  };
}

async function fetchGoogleEmail(accessToken: string): Promise<string> {
  const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!res.ok) return "";
  const data = await json(res);
  return data.email ?? "";
}

async function refreshGoogleToken(refreshToken: string): Promise<{ accessToken: string; expiresAt: number }> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: requireEnv("GOOGLE_CLIENT_ID"),
      client_secret: requireEnv("GOOGLE_CLIENT_SECRET"),
      grant_type: "refresh_token",
    }),
  });
  if (!res.ok) throw new Error(`Falha ao renovar token do Google: ${res.status} ${await res.text()}`);
  const data = await json(res);
  return { accessToken: data.access_token, expiresAt: Date.now() + data.expires_in * 1000 };
}

/** Devolve um access_token válido, renovando via refresh_token se estiver perto de expirar. */
export async function ensureFreshAccessToken(creds: GoogleCredentials): Promise<GoogleCredentials> {
  if (creds.expiresAt - Date.now() > 60_000) return creds;
  const { accessToken, expiresAt } = await refreshGoogleToken(creds.refreshToken);
  return { ...creds, accessToken, expiresAt };
}

export interface CalendarEventInput {
  title: string;
  description?: string;
  start: string; // ISO 8601
  end: string; // ISO 8601
}

export interface GoogleEvent {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
}

function toGoogleBody(input: CalendarEventInput) {
  return {
    summary: input.title,
    description: input.description,
    start: { dateTime: input.start },
    end: { dateTime: input.end },
  };
}

function fromGoogleEvent(raw: any): GoogleEvent {
  return {
    id: raw.id,
    title: raw.summary ?? "(sem título)",
    description: raw.description,
    start: raw.start?.dateTime ?? raw.start?.date,
    end: raw.end?.dateTime ?? raw.end?.date,
  };
}

async function googleFetch(accessToken: string, path: string, init?: RequestInit) {
  const res = await fetch(`${CALENDAR_BASE}${path}`, {
    ...init,
    headers: { ...init?.headers, Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Google Calendar API: ${res.status} ${await res.text()}`);
  return res;
}

export async function listGoogleEvents(accessToken: string, timeMinIso: string): Promise<GoogleEvent[]> {
  const params = new URLSearchParams({ timeMin: timeMinIso, singleEvents: "true", orderBy: "startTime", maxResults: "250" });
  const res = await googleFetch(accessToken, `?${params.toString()}`);
  const data = await json(res);
  return (data.items ?? []).map(fromGoogleEvent);
}

export async function createGoogleEvent(accessToken: string, input: CalendarEventInput): Promise<GoogleEvent> {
  const res = await googleFetch(accessToken, "", { method: "POST", body: JSON.stringify(toGoogleBody(input)) });
  return fromGoogleEvent(await json(res));
}

export async function updateGoogleEvent(accessToken: string, eventId: string, input: CalendarEventInput): Promise<GoogleEvent> {
  const res = await googleFetch(accessToken, `/${eventId}`, { method: "PATCH", body: JSON.stringify(toGoogleBody(input)) });
  return fromGoogleEvent(await json(res));
}

export async function deleteGoogleEvent(accessToken: string, eventId: string): Promise<void> {
  await googleFetch(accessToken, `/${eventId}`, { method: "DELETE" });
}
