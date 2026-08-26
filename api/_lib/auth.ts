import { createRemoteJWKSet, jwtVerify } from "jose";

// Mesmo User Pool usado pelo frontend (src/app/admin/lib/cognitoClient.ts) — precisa
// bater com VITE_COGNITO_USER_POOL_ID, senão os tokens não validam.
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || "sa-east-1_00PXPGtFm";
const REGION = USER_POOL_ID.split("_")[0];
const ISSUER = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`;

const jwks = createRemoteJWKSet(new URL(`${ISSUER}/.well-known/jwks.json`));

export interface AuthUser {
  sub: string;
  email: string;
}

/** Valida o ID token do Cognito enviado como "Authorization: Bearer <token>". Lança se inválido/ausente. */
export async function requireUser(authorizationHeader: string | undefined | null): Promise<AuthUser> {
  const token = authorizationHeader?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new Error("Sem token de autenticação.");

  const { payload } = await jwtVerify(token, jwks, { issuer: ISSUER });
  if (payload.token_use !== "id") throw new Error("Token do tipo errado.");
  if (!payload.sub || typeof payload.email !== "string") throw new Error("Token sem sub/email.");

  return { sub: payload.sub, email: payload.email };
}
