import { createDAVClient } from "tsdav";
import ical from "node-ical";
import type { CalendarEventInput, GoogleEvent as CalendarEvent } from "./google.js";

const SERVER_URL = "https://caldav.icloud.com";

export interface AppleCredentials {
  icloudEmail: string;
  appSpecificPassword: string;
  calendarUrl: string;
}

async function client(creds: Pick<AppleCredentials, "icloudEmail" | "appSpecificPassword">) {
  return createDAVClient({
    serverUrl: SERVER_URL,
    credentials: { username: creds.icloudEmail, password: creds.appSpecificPassword },
    authMethod: "Basic",
    defaultAccountType: "caldav",
  });
}

/** Testa as credenciais e devolve a URL do primeiro calendário editável — usado ao conectar. */
export async function verifyAppleCredentials(icloudEmail: string, appSpecificPassword: string): Promise<string> {
  const c = await client({ icloudEmail, appSpecificPassword });
  const calendars = await c.fetchCalendars();
  const writable = calendars.find((cal) => cal.components?.includes("VEVENT")) ?? calendars[0];
  if (!writable?.url) throw new Error("Nenhum calendário encontrado nessa conta iCloud.");
  return writable.url;
}

function toIcs(uid: string, input: CalendarEventInput): string {
  const stamp = (iso: string) =>
    new Date(iso)
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}Z$/, "Z");
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Codeless//Agenda//PT",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${stamp(new Date().toISOString())}`,
    `DTSTART:${stamp(input.start)}`,
    `DTEND:${stamp(input.end)}`,
    `SUMMARY:${escapeIcs(input.title)}`,
    input.description ? `DESCRIPTION:${escapeIcs(input.description)}` : undefined,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
}

function escapeIcs(text: string): string {
  return text.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
}

export async function listAppleEvents(creds: AppleCredentials, sinceIso: string): Promise<CalendarEvent[]> {
  const c = await client(creds);
  const objects = await c.fetchCalendarObjects({ calendar: { url: creds.calendarUrl } });
  const since = new Date(sinceIso).getTime();
  const events: CalendarEvent[] = [];

  for (const obj of objects) {
    if (!obj.data) continue;
    const parsed = ical.sync.parseICS(obj.data);
    for (const item of Object.values(parsed)) {
      if (item.type !== "VEVENT" || !item.start || !item.end) continue;
      const start = new Date(item.start).toISOString();
      if (new Date(start).getTime() < since) continue;
      events.push({
        id: obj.url,
        title: item.summary ?? "(sem título)",
        description: item.description,
        start,
        end: new Date(item.end).toISOString(),
      });
    }
  }
  return events;
}

export async function createAppleEvent(creds: AppleCredentials, input: CalendarEventInput): Promise<CalendarEvent> {
  const c = await client(creds);
  const uid = `${crypto.randomUUID()}@codeless`;
  const ics = toIcs(uid, input);
  const filename = `${uid}.ics`;
  const result = await c.createCalendarObject({ calendar: { url: creds.calendarUrl }, filename, iCalString: ics });
  if (!result.ok) throw new Error(`Falha ao criar evento no iCloud: ${result.status}`);
  const url = result.headers.get("location") || `${creds.calendarUrl}${filename}`;
  return { id: url, title: input.title, description: input.description, start: input.start, end: input.end };
}

async function fetchObjectByUrl(creds: AppleCredentials, url: string) {
  const c = await client(creds);
  const [obj] = await c.fetchCalendarObjects({ calendar: { url: creds.calendarUrl }, objectUrls: [url] });
  if (!obj) throw new Error("Evento não encontrado no iCloud.");
  return { client: c, obj };
}

export async function updateAppleEvent(creds: AppleCredentials, eventUrl: string, input: CalendarEventInput): Promise<CalendarEvent> {
  const { client: c, obj } = await fetchObjectByUrl(creds, eventUrl);
  const uidMatch = obj.data?.match(/UID:(.+)/)?.[1]?.trim() ?? `${crypto.randomUUID()}@codeless`;
  const ics = toIcs(uidMatch, input);
  const result = await c.updateCalendarObject({ calendarObject: { url: eventUrl, data: ics, etag: obj.etag } });
  if (!result.ok) throw new Error(`Falha ao editar evento no iCloud: ${result.status}`);
  return { id: eventUrl, title: input.title, description: input.description, start: input.start, end: input.end };
}

export async function deleteAppleEvent(creds: AppleCredentials, eventUrl: string): Promise<void> {
  const { client: c, obj } = await fetchObjectByUrl(creds, eventUrl);
  const result = await c.deleteCalendarObject({ calendarObject: { url: eventUrl, etag: obj.etag } });
  if (!result.ok) throw new Error(`Falha ao excluir evento no iCloud: ${result.status}`);
}
