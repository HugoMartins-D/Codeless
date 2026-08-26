import { Pool } from "pg";
import { resolveDatabaseUrl } from "./env";

// Reaproveita o Pool entre invocações da mesma Lambda (cold start) — cada
// invocação nova de módulo criaria um pool novo e vazaria conexões.
let pool: Pool | undefined;
let migrated: Promise<void> | undefined;

function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: resolveDatabaseUrl(), ssl: { rejectUnauthorized: false }, max: 3 });
  }
  return pool;
}

async function migrate(): Promise<void> {
  const db = getPool();
  await db.query(`
    create extension if not exists pgcrypto;

    create table if not exists calendar_accounts (
      user_id text not null,
      provider text not null check (provider in ('google', 'apple')),
      credentials jsonb not null,
      display_email text,
      created_at timestamptz not null default now(),
      updated_at timestamptz not null default now(),
      primary key (user_id, provider)
    );

    create table if not exists calendar_links (
      id uuid primary key default gen_random_uuid(),
      user_id text not null,
      provider text not null,
      external_event_id text not null,
      contract_id text,
      task_id text,
      created_at timestamptz not null default now(),
      unique (user_id, provider, external_event_id)
    );
  `);
}

/** Garante as tabelas antes de qualquer query — idempotente e barato (CREATE TABLE IF NOT EXISTS). */
export async function db(): Promise<Pool> {
  if (!migrated) migrated = migrate();
  await migrated;
  return getPool();
}
