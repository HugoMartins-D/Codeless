import {
  Wallet,
  FileText,
  KanbanSquare,
  Users,
  LayoutDashboard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export interface AdminModule {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

export const adminModules: AdminModule[] = [
  {
    slug: "financeiro",
    title: "Financeiro",
    description:
      "Lucro, entradas e saídas do mês, saldo em caixa, fluxo de caixa dos últimos 6 meses, meta editável e notas fiscais pendentes.",
    icon: Wallet,
  },
  {
    slug: "contratos",
    title: "Contratos",
    description:
      "Geração automática de contrato a partir de um template, com status de rascunho, enviado e assinado.",
    icon: FileText,
  },
  {
    slug: "demandas",
    title: "Demandas",
    description: "Lista e kanban de demandas organizados por cliente.",
    icon: KanbanSquare,
  },
  {
    slug: "clientes",
    title: "Clientes",
    description: "CRM com base de clientes segmentada por status: ativo, pausado, prospect, ex-cliente.",
    icon: Users,
  },
  {
    slug: "dashboard",
    title: "Dashboard geral",
    description: "Visão consolidada de próximas entregas, carga por colaborador e resumo financeiro do mês.",
    icon: LayoutDashboard,
  },
  {
    slug: "acessos",
    title: "Acessos",
    description: "Permissões por colaborador: quais abas e quais clientes cada pessoa do time pode ver.",
    icon: ShieldCheck,
  },
];
