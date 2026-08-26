import type { ServerResponse } from "http";
import { requireUser } from "../../_lib/auth.js";
import { verifyAppleCredentials } from "../../_lib/apple.js";
import { saveAccount, deleteAccount } from "../../_lib/accounts.js";
import { bearerToken, readJsonBody, send, withErrorHandling, type ApiRequest } from "../../_lib/http.js";

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const user = await requireUser(bearerToken(req));

  if (req.method === "DELETE") {
    await deleteAccount(user.sub, "apple");
    return send(res, 204);
  }

  if (req.method !== "POST") return send(res, 405);

  const { icloudEmail, appSpecificPassword } = await readJsonBody<{ icloudEmail?: string; appSpecificPassword?: string }>(req);
  if (!icloudEmail || !appSpecificPassword) return send(res, 400, { error: "icloudEmail e appSpecificPassword são obrigatórios." });

  const calendarUrl = await verifyAppleCredentials(icloudEmail, appSpecificPassword);
  await saveAccount(user.sub, "apple", { icloudEmail, appSpecificPassword, calendarUrl }, icloudEmail);
  send(res, 200, { connected: true });
});
