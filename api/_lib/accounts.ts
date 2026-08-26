import { db } from "./db.js";
import type { GoogleCredentials } from "./google.js";
import type { AppleCredentials } from "./apple.js";

export type Provider = "google" | "apple";

export async function getAccount<T>(userId: string, provider: Provider): Promise<T | null> {
  const pool = await db();
  const { rows } = await pool.query("select credentials from calendar_accounts where user_id = $1 and provider = $2", [userId, provider]);
  return rows[0]?.credentials ?? null;
}

export async function saveAccount(userId: string, provider: Provider, credentials: unknown, displayEmail: string): Promise<void> {
  const pool = await db();
  await pool.query(
    `insert into calendar_accounts (user_id, provider, credentials, display_email, updated_at)
     values ($1, $2, $3, $4, now())
     on conflict (user_id, provider) do update set credentials = $3, display_email = $4, updated_at = now()`,
    [userId, provider, JSON.stringify(credentials), displayEmail],
  );
}

export async function deleteAccount(userId: string, provider: Provider): Promise<void> {
  const pool = await db();
  await pool.query("delete from calendar_accounts where user_id = $1 and provider = $2", [userId, provider]);
}

export async function listAccounts(userId: string): Promise<{ provider: Provider; email: string }[]> {
  const pool = await db();
  const { rows } = await pool.query("select provider, display_email from calendar_accounts where user_id = $1", [userId]);
  return rows.map((r) => ({ provider: r.provider, email: r.display_email }));
}

export async function updateGoogleTokens(userId: string, creds: GoogleCredentials): Promise<void> {
  await saveAccount(userId, "google", creds, creds.email);
}

export type { GoogleCredentials, AppleCredentials };
