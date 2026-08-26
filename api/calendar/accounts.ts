import type { ServerResponse } from "http";
import { requireUser } from "../_lib/auth.js";
import { listAccounts, deleteAccount, type Provider } from "../_lib/accounts.js";
import { bearerToken, send, withErrorHandling, type ApiRequest } from "../_lib/http.js";

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const user = await requireUser(bearerToken(req));

  if (req.method === "GET") {
    const accounts = await listAccounts(user.sub);
    return send(res, 200, { accounts });
  }

  if (req.method === "DELETE") {
    const url = new URL(req.url ?? "", "http://localhost");
    const provider = url.searchParams.get("provider") as Provider | null;
    if (provider !== "google" && provider !== "apple") return send(res, 400, { error: "provider inválido" });
    await deleteAccount(user.sub, provider);
    return send(res, 204);
  }

  send(res, 405);
});
