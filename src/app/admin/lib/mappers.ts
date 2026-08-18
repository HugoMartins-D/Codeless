import type { Client, ClientStatusHistoryEntry, Collaborator, Contract, Profile, Task, Transaction } from "../types";

export const fromTransactionRow = (r: any): Transaction => ({
  id: r.id,
  type: r.type,
  category: r.category,
  description: r.description ?? "",
  amount: Number(r.amount),
  date: r.date,
  invoiceIssued: r.invoice_issued ?? undefined,
  clientId: r.client_id ?? undefined,
});

export const toTransactionRow = (t: Transaction) => ({
  id: t.id,
  type: t.type,
  category: t.category,
  description: t.description,
  amount: t.amount,
  date: t.date,
  invoice_issued: t.type === "receita" ? !!t.invoiceIssued : null,
  client_id: t.clientId || null,
});

export const fromContractRow = (r: any): Contract => ({
  id: r.id,
  clientCompanyName: r.client_company_name,
  clientCnpj: r.client_cnpj ?? "",
  clientAddress: r.client_address ?? "",
  clientRepresentative: r.client_representative ?? "",
  projectObject: r.project_object ?? "",
  implementationValue: Number(r.implementation_value),
  implementationDueDate: r.implementation_due_date ?? undefined,
  monthlyValue: Number(r.monthly_value),
  monthlyDueDay: Number(r.monthly_due_day),
  signatories: r.signatories ?? [],
  city: r.city ?? "Balneário Camboriú",
  status: r.status,
  createdAt: r.created_at,
  clientId: r.client_id ?? undefined,
});

export const toContractRow = (c: Contract) => ({
  id: c.id,
  client_company_name: c.clientCompanyName,
  client_cnpj: c.clientCnpj,
  client_address: c.clientAddress,
  client_representative: c.clientRepresentative,
  project_object: c.projectObject,
  implementation_value: c.implementationValue,
  implementation_due_date: c.implementationDueDate || null,
  monthly_value: c.monthlyValue,
  monthly_due_day: c.monthlyDueDay,
  signatories: c.signatories,
  city: c.city,
  status: c.status,
  created_at: c.createdAt,
  client_id: c.clientId || null,
});

export const fromClientRow = (r: any): Client => ({
  id: r.id,
  name: r.name,
  contact: r.contact ?? "",
  status: r.status,
  oneTimeValue: r.one_time_value != null ? Number(r.one_time_value) : undefined,
  monthlyValue: r.monthly_value != null ? Number(r.monthly_value) : undefined,
});

export const toClientRow = (c: Client) => ({
  id: c.id,
  name: c.name,
  contact: c.contact,
  status: c.status,
  one_time_value: c.oneTimeValue ?? null,
  monthly_value: c.monthlyValue ?? null,
});

export const fromTaskRow = (r: any): Task => ({
  id: r.id,
  title: r.title,
  client: r.client ?? "",
  description: r.description ?? "",
  assignees: r.assignees ?? [],
  dueDate: r.due_date ?? undefined,
  status: r.status,
  deliverableUrl: r.deliverable_url ?? undefined,
  contractId: r.contract_id ?? undefined,
});

export const toTaskRow = (t: Task) => ({
  id: t.id,
  title: t.title,
  client: t.client,
  description: t.description ?? "",
  assignees: t.assignees,
  due_date: t.dueDate || null,
  status: t.status,
  deliverable_url: t.deliverableUrl || null,
  contract_id: t.contractId || null,
});

export const fromCollaboratorRow = (r: any): Collaborator => ({
  id: r.id,
  name: r.name,
  email: r.email ?? "",
  status: r.status ?? "pending",
  moduleAccess: r.module_access ?? [],
  clientAccess: r.client_access ?? "all",
  canCreateDemandas: r.can_create_demandas ?? false,
});

export const toCollaboratorRow = (c: Collaborator) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  status: c.status,
  module_access: c.moduleAccess,
  client_access: c.clientAccess,
  can_create_demandas: c.canCreateDemandas,
});

export const fromClientStatusHistoryRow = (r: any): ClientStatusHistoryEntry => ({
  id: r.id,
  clientId: r.client_id,
  status: r.status,
  reasonPreset: r.reason_preset ?? undefined,
  reasonNote: r.reason_note ?? undefined,
  changedAt: r.changed_at,
});

export const toClientStatusHistoryRow = (h: ClientStatusHistoryEntry) => ({
  id: h.id,
  client_id: h.clientId,
  status: h.status,
  reason_preset: h.reasonPreset || null,
  reason_note: h.reasonNote || null,
  changed_at: h.changedAt,
});

export const fromProfileRow = (r: any): Profile => ({
  id: r.id,
  email: r.email ?? "",
  name: r.name ?? "",
  avatarUrl: r.avatar_url ?? undefined,
});

export const toProfileRow = (p: Profile) => ({
  id: p.id,
  email: p.email,
  name: p.name,
  avatar_url: p.avatarUrl || null,
});
