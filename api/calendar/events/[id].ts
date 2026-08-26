import type { ServerResponse } from "http";
import { requireUser } from "../../_lib/auth";
import { getAccount, updateGoogleTokens, type GoogleCredentials, type AppleCredentials } from "../../_lib/accounts";
import { ensureFreshAccessToken, updateGoogleEvent, deleteGoogleEvent, type CalendarEventInput } from "../../_lib/google";
import { updateAppleEvent, deleteAppleEvent } from "../../_lib/apple";
import { setLink, deleteLink } from "../../_lib/links";
import { decodeEventId } from "../../_lib/eventId";
import { bearerToken, readJsonBody, send, withErrorHandling, type ApiRequest } from "../../_lib/http";

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const user = await requireUser(bearerToken(req));

  const url = new URL(req.url ?? "", "http://localhost");
  const rawId = url.pathname.split("/").pop() ?? "";
  const { provider, externalId } = decodeEventId(decodeURIComponent(rawId));

  if (req.method === "PUT") {
    const body = await readJsonBody<CalendarEventInput & { contractId?: string; taskId?: string }>(req);
    if (!body.title || !body.start || !body.end) return send(res, 400, { error: "title, start e end são obrigatórios." });
    const input: CalendarEventInput = { title: body.title, description: body.description, start: body.start, end: body.end };

    if (provider === "google") {
      const creds = await getAccount<GoogleCredentials>(user.sub, "google");
      if (!creds) return send(res, 400, { error: "Google Calendar não conectado." });
      const fresh = await ensureFreshAccessToken(creds);
      if (fresh.accessToken !== creds.accessToken) await updateGoogleTokens(user.sub, fresh);
      await updateGoogleEvent(fresh.accessToken, externalId, input);
    } else {
      const creds = await getAccount<AppleCredentials>(user.sub, "apple");
      if (!creds) return send(res, 400, { error: "iCloud Calendar não conectado." });
      await updateAppleEvent(creds, externalId, input);
    }

    await setLink(user.sub, provider, externalId, { contractId: body.contractId, taskId: body.taskId });
    return send(res, 200, { ok: true });
  }

  if (req.method === "DELETE") {
    if (provider === "google") {
      const creds = await getAccount<GoogleCredentials>(user.sub, "google");
      if (!creds) return send(res, 400, { error: "Google Calendar não conectado." });
      const fresh = await ensureFreshAccessToken(creds);
      if (fresh.accessToken !== creds.accessToken) await updateGoogleTokens(user.sub, fresh);
      await deleteGoogleEvent(fresh.accessToken, externalId);
    } else {
      const creds = await getAccount<AppleCredentials>(user.sub, "apple");
      if (!creds) return send(res, 400, { error: "iCloud Calendar não conectado." });
      await deleteAppleEvent(creds, externalId);
    }
    await deleteLink(user.sub, provider, externalId);
    return send(res, 204);
  }

  send(res, 405);
});
