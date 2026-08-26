import type { ServerResponse } from "http";
import { jwtVerify } from "jose";
import { exchangeGoogleCode } from "../../_lib/google.js";
import { updateGoogleTokens } from "../../_lib/accounts.js";
import { withErrorHandling, type ApiRequest } from "../../_lib/http.js";
import { requireEnv } from "../../_lib/env.js";

function stateSecret(): Uint8Array {
  return new TextEncoder().encode(requireEnv("GOOGLE_CLIENT_SECRET"));
}

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const url = new URL(req.url ?? "", "http://localhost");
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const appUrl = process.env.APP_URL || "https://www.codeleess.com.br";

  if (!code || !state) {
    res.writeHead(302, { Location: `${appUrl}/admin/agenda?google=error` });
    res.end();
    return;
  }

  try {
    const { payload } = await jwtVerify(state, stateSecret());
    const sub = payload.sub as string;
    const creds = await exchangeGoogleCode(code);
    await updateGoogleTokens(sub, creds);
    res.writeHead(302, { Location: `${appUrl}/admin/agenda?google=connected` });
    res.end();
    return;
  } catch (err) {
    console.error("[api/calendar/google/callback]", err);
    res.writeHead(302, { Location: `${appUrl}/admin/agenda?google=error` });
    res.end();
    return;
  }
});
