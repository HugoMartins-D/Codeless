import type { Client, Collaborator, Contract, Task, Transaction } from "../types";

export const fromTransactionRow = (r: any): Transaction => ({
  id: r.id,
  type: r.type,
  category: r.category,
  description: r.description ?? "",
  amount: Number(r.amount),
  date: r.date,
  invoiceIssued: r.invoice_issued ?? undefined,
});

export const toTransactionRow = (t: Transaction) => ({
  id: t.id,
  type: t.type,
  category: t.category,
  description: t.description,
  amount: t.amount,
  date: t.date,
  invoice_issued: t.type === "receita" ? !!t.invoiceIssued : null,
});

export const fromContractRow = (r: any): Contract => ({
  id: r.id,
  clientName: r.client_name,
  cpf: r.cpf ?? "",
  address: r.address ?? "",
  totalValue: Number(r.total_value),
  paymentMethod: r.payment_method,
  installments: r.installments ?? undefined,
  validity: r.validity ?? "",
  scope: r.scope ?? "",
  status: r.status,
  createdAt: r.created_at,
});

export const toContractRow = (c: Contract) => ({
  id: c.id,
  client_name: c.clientName,
  cpf: c.cpf,
  address: c.address,
  total_value: c.totalValue,
  payment_method: c.paymentMethod,
  installments: c.paymentMethod === "parcelado" ? c.installments ?? 1 : null,
  validity: c.validity,
  scope: c.scope,
  status: c.status,
  created_at: c.createdAt,
});

export const fromClientRow = (r: any): Client => ({
  id: r.id,
  name: r.name,
  contact: r.contact ?? "",
  status: r.status,
  recurringValue: r.recurring_value != null ? Number(r.recurring_value) : undefined,
});

export const toClientRow = (c: Client) => ({
  id: c.id,
  name: c.name,
  contact: c.contact,
  status: c.status,
  recurring_value: c.recurringValue ?? null,
});

export const fromTaskRow = (r: any): Task => ({
  id: r.id,
  title: r.title,
  client: r.client ?? "",
  assignee: r.assignee ?? undefined,
  dueDate: r.due_date ?? undefined,
  status: r.status,
});

export const toTaskRow = (t: Task) => ({
  id: t.id,
  title: t.title,
  client: t.client,
  assignee: t.assignee || null,
  due_date: t.dueDate || null,
  status: t.status,
});

export const fromCollaboratorRow = (r: any): Collaborator => ({
  id: r.id,
  name: r.name,
  email: r.email ?? "",
  moduleAccess: r.module_access ?? [],
  clientAccess: r.client_access ?? "all",
});

export const toCollaboratorRow = (c: Collaborator) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  module_access: c.moduleAccess,
  client_access: c.clientAccess,
});
