import { db } from "./db.js";
import type { Provider } from "./accounts.js";

export interface EventLink {
  contractId?: string;
  taskId?: string;
}

export async function getLinks(userId: string): Promise<Map<string, EventLink>> {
  const pool = await db();
  const { rows } = await pool.query(
    "select provider, external_event_id, contract_id, task_id from calendar_links where user_id = $1",
    [userId],
  );
  const map = new Map<string, EventLink>();
  for (const row of rows) {
    map.set(`${row.provider}:${row.external_event_id}`, { contractId: row.contract_id ?? undefined, taskId: row.task_id ?? undefined });
  }
  return map;
}

export async function setLink(userId: string, provider: Provider, externalEventId: string, link: EventLink): Promise<void> {
  const pool = await db();
  if (!link.contractId && !link.taskId) {
    await pool.query("delete from calendar_links where user_id = $1 and provider = $2 and external_event_id = $3", [
      userId,
      provider,
      externalEventId,
    ]);
    return;
  }
  await pool.query(
    `insert into calendar_links (user_id, provider, external_event_id, contract_id, task_id)
     values ($1, $2, $3, $4, $5)
     on conflict (user_id, provider, external_event_id)
     do update set contract_id = $4, task_id = $5`,
    [userId, provider, externalEventId, link.contractId ?? null, link.taskId ?? null],
  );
}

export async function deleteLink(userId: string, provider: Provider, externalEventId: string): Promise<void> {
  const pool = await db();
  await pool.query("delete from calendar_links where user_id = $1 and provider = $2 and external_event_id = $3", [
    userId,
    provider,
    externalEventId,
  ]);
}
