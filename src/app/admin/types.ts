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

export interface ContractSignatory {
  name: string;
  cpf: string;
  /** Função que a pessoa exerce (ex: Desenvolvedor, Designer) — opcional. */
  role?: string;
}

export interface Contract {
  id: string;
  clientCompanyName: string;
  clientCnpj: string;
  clientAddress: string;
  clientRepresentative: string;
  projectObject: string;
  implementationValue: number;
  implementationDueDate?: string; // yyyy-mm-dd, opcional
  monthlyValue: number;
  monthlyDueDay: number; // dia do mês, ex: 25
  /** Nome+CPF travados no momento da criação — não muda se o time (roster) mudar depois. */
  signatories: ContractSignatory[];
  city: string;
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
  /** O que a pessoa responsável precisa fazer. */
  description?: string;
  assignee?: string;
  dueDate?: string; // yyyy-mm-dd
  status: TaskStatus;
  /** Link do entregável (Drive, Dropbox, PDF, etc.) informado na entrega. */
  deliverableUrl?: string;
}

export type CollaboratorStatus = "pending" | "approved" | "denied";

export interface Collaborator {
  id: string;
  name: string;
  email: string;
  status: CollaboratorStatus;
  moduleAccess: string[]; // slugs de admin/modules.ts
  clientAccess: "all" | string[]; // ids de Client, ou "all"
  /** Além de ter acesso ao módulo Demandas, pode criar novas demandas (não só ver/atualizar as suas). */
  canCreateDemandas: boolean;
}
