import type { TaskStatus } from "../types";

export type TaskUrgency = "overdue" | "soon" | "normal";

/** "soon" cobre hoje até 2 dias antes do vencimento, per pedido do usuário. */
const SOON_WINDOW_DAYS = 2;

export function getTaskUrgency(dueDate: string | undefined, status: TaskStatus): TaskUrgency {
  if (!dueDate || status === "done") return "normal";

  const today = new Date().toISOString().slice(0, 10);
  if (dueDate < today) return "overdue";

  const soonLimit = new Date();
  soonLimit.setDate(soonLimit.getDate() + SOON_WINDOW_DAYS);
  const soonLimitStr = soonLimit.toISOString().slice(0, 10);
  if (dueDate <= soonLimitStr) return "soon";

  return "normal";
}
