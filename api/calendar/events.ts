import type { ServerResponse } from "http";
import { requireUser } from "../_lib/auth.js";
import { getAccount, type GoogleCredentials, type AppleCredentials } from "../_lib/accounts.js";
import { ensureFreshAccessToken, listGoogleEvents, createGoogleEvent, type CalendarEventInput } from "../_lib/google.js";
import { listAppleEvents, createAppleEvent } from "../_lib/apple.js";
import { updateGoogleTokens } from "../_lib/accounts.js";
import { getLinks, setLink } from "../_lib/links.js";
import { encodeEventId } from "../_lib/eventId.js";
import { bearerToken, readJsonBody, send, withErrorHandling, type ApiRequest } from "../_lib/http.js";

async function listAllEvents(userId: string) {
  const sinceIso = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(); // últimos 30 dias pra frente
  const [google, apple, links] = await Promise.all([
    getAccount<GoogleCredentials>(userId, "google"),
    getAccount<AppleCredentials>(userId, "apple"),
    getLinks(userId),
  ]);

  const events: Array<{ id: string; provider: "google" | "apple"; title: string; description?: string; start: string; end: string; contractId?: string; taskId?: string }> = [];

  if (google) {
    const fresh = await ensureFreshAccessToken(google);
    if (fresh.accessToken !== google.accessToken) await updateGoogleTokens(userId, fresh);
    const googleEvents = await listGoogleEvents(fresh.accessToken, sinceIso);
    for (const { id: externalId, ...ev } of googleEvents) {
      const link = links.get(`google:${externalId}`);
      events.push({ id: encodeEventId("google", externalId), provider: "google", ...ev, ...link });
    }
  }

  if (apple) {
    const appleEvents = await listAppleEvents(apple, sinceIso);
    for (const { id: externalId, ...ev } of appleEvents) {
      const link = links.get(`apple:${externalId}`);
      events.push({ id: encodeEventId("apple", externalId), provider: "apple", ...ev, ...link });
    }
  }

  events.sort((a, b) => a.start.localeCompare(b.start));
  return events;
}

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const user = await requireUser(bearerToken(req));

  if (req.method === "GET") {
    return send(res, 200, { events: await listAllEvents(user.sub) });
  }

  if (req.method === "POST") {
    const body = await readJsonBody<
      CalendarEventInput & { provider: "google" | "apple"; contractId?: string; taskId?: string }
    >(req);
    if (body.provider !== "google" && body.provider !== "apple") return send(res, 400, { error: "provider inválido." });
    if (!body.title || !body.start || !body.end) return send(res, 400, { error: "title, start e end são obrigatórios." });

    const input: CalendarEventInput = { title: body.title, description: body.description, start: body.start, end: body.end };
    let externalId: string;

    if (body.provider === "google") {
      const creds = await getAccount<GoogleCredentials>(user.sub, "google");
      if (!creds) return send(res, 400, { error: "Google Calendar não conectado." });
      const fresh = await ensureFreshAccessToken(creds);
      if (fresh.accessToken !== creds.accessToken) await updateGoogleTokens(user.sub, fresh);
      const created = await createGoogleEvent(fresh.accessToken, input);
      externalId = created.id;
    } else {
      const creds = await getAccount<AppleCredentials>(user.sub, "apple");
      if (!creds) return send(res, 400, { error: "iCloud Calendar não conectado." });
      const created = await createAppleEvent(creds, input);
      externalId = created.id;
    }

    if (body.contractId || body.taskId) {
      await setLink(user.sub, body.provider, externalId, { contractId: body.contractId, taskId: body.taskId });
    }

    return send(res, 201, { id: encodeEventId(body.provider, externalId) });
  }

  send(res, 405);
});
