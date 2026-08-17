export type TransactionType = "receita" | "despesa";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // yyyy-mm-dd
  invoiceIssued?: boolean; // só relevante para receitas
}

export type ContractStatus = "rascunho" | "enviado" | "assinado";
export type PaymentMethod = "pix" | "parcelado";

export interface Contract {
  id: string;
  clientName: string;
  cpf: string;
  address: string;
  totalValue: number;
  paymentMethod: PaymentMethod;
  installments?: number;
  validity: string;
  scope: string;
  status: ContractStatus;
  createdAt: string; // yyyy-mm-dd
}

export type ClientStatus = "ativo" | "pausado" | "prospect" | "ex-cliente";

export interface Client {
  id: string;
  name: string;
  contact: string;
  status: ClientStatus;
  recurringValue?: number;
}

export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  client: string;
  assignee?: string;
  dueDate?: string; // yyyy-mm-dd
  status: TaskStatus;
}

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  moduleAccess: string[]; // slugs de admin/modules.ts
  clientAccess: "all" | string[]; // ids de Client, ou "all"
}
