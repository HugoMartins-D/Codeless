export type TransactionType = "receita" | "despesa";

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string; // yyyy-mm-dd
  invoiceIssued?: boolean; // só relevante para receitas
  /** Referência ao cliente (id de Client), opcional. */
  clientId?: string;
}

export type ContractStatus = "rascunho" | "enviado" | "assinado";

export interface ContractSignatory {
  name: string;
  cpf: string;
  /** Função que a pessoa exerce (ex: Desenvolvedor, Designer) — opcional. */
  role?: string;
}

export type ContractPaymentType = "dinheiro" | "permuta";

export interface Contract {
  id: string;
  clientCompanyName: string;
  clientCnpj: string;
  clientAddress: string;
  clientRepresentative: string;
  projectObject: string;
  paymentType: ContractPaymentType;
  implementationValue: number;
  implementationDueDate?: string; // yyyy-mm-dd, opcional
  monthlyValue: number;
  monthlyDueDay: number; // dia do mês, ex: 25
  /** O que é permutado (produto/serviço) — só relevante quando paymentType === "permuta". */
  permutaDescription?: string;
  /** Nome+CPF travados no momento da criação — não muda se o time (roster) mudar depois. */
  signatories: ContractSignatory[];
  city: string;
  status: ContractStatus;
  createdAt: string; // yyyy-mm-dd
  /** Referência ao cliente (id de Client), opcional. */
  clientId?: string;
}

export type ClientStatus = "ativo" | "pausado" | "prospect" | "ex-cliente";

export interface Client {
  id: string;
  name: string;
  contact: string;
  status: ClientStatus;
  /** Valor de pagamento único (ex: projeto fechado), independente do mensal. */
  oneTimeValue?: number;
  /** Valor recorrente mensal, independente do único — um cliente pode ter os dois. */
  monthlyValue?: number;
}

/**
 * Registro append-only: cada mudança de status para "pausado"/"ex-cliente"
 * gera uma entrada nova aqui, nunca sobrescreve uma anterior.
 */
export interface ClientStatusHistoryEntry {
  id: string;
  clientId: string;
  status: ClientStatus;
  reasonPreset?: string;
  reasonNote?: string;
  changedAt: string; // ISO timestamp
}

export type TaskStatus = "todo" | "doing" | "done";

export interface Task {
  id: string;
  title: string;
  client: string;
  /** Referência ao cliente (id de Client), opcional — usada para restringir por clientAccess/RLS. */
  clientId?: string;
  /** O que a pessoa responsável precisa fazer. */
  description?: string;
  /** Uma demanda pode ter mais de um responsável. */
  assignees: string[];
  dueDate?: string; // yyyy-mm-dd
  status: TaskStatus;
  /** Link do entregável (Drive, Dropbox, PDF, etc.) informado na entrega. */
  deliverableUrl?: string;
  /** Contrato/escopo do módulo Contratos ao qual essa demanda pertence, opcional. */
  contractId?: string;
}

/** Perfil pessoal (nome de exibição + foto), editável pelo próprio usuário. */
export interface Profile {
  id: string; // auth.users.id
  email: string;
  name: string;
  avatarUrl?: string;
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
