import type { ServerResponse } from "http";
import { SignJWT } from "jose";
import { requireUser } from "../../_lib/auth.js";
import { buildGoogleAuthUrl } from "../../_lib/google.js";
import { bearerToken, send, withErrorHandling, type ApiRequest } from "../../_lib/http.js";
import { requireEnv } from "../../_lib/env.js";

function stateSecret(): Uint8Array {
  return new TextEncoder().encode(requireEnv("GOOGLE_CLIENT_SECRET"));
}

export default withErrorHandling(async (req: ApiRequest, res: ServerResponse) => {
  const user = await requireUser(bearerToken(req));

  // "state" assinado (não guardado em tabela nenhuma) pra confirmar, no callback,
  // que a resposta do Google é pro mesmo usuário que iniciou o fluxo.
  const state = await new SignJWT({ sub: user.sub })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(stateSecret());

  send(res, 200, { url: buildGoogleAuthUrl(state) });
});
