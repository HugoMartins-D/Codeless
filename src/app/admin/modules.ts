import {
  Wallet,
  FileText,
  KanbanSquare,
  Users,
  LayoutDashboard,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { ComponentType } from "react";
import { FinanceiroPage } from "./modules/FinanceiroPage";
import { ContratosPage } from "./modules/ContratosPage";
import { DemandasPage } from "./modules/DemandasPage";
import { ClientesPage } from "./modules/ClientesPage";
import { DashboardPage } from "./modules/DashboardPage";
import { AcessosPage } from "./modules/AcessosPage";

export interface AdminModule {
  slug: string;
  title: string;
  icon: LucideIcon;
  component: ComponentType;
}

export const adminModules: AdminModule[] = [
  { slug: "financeiro", title: "Financeiro", icon: Wallet, component: FinanceiroPage },
  { slug: "contratos", title: "Contratos", icon: FileText, component: ContratosPage },
  { slug: "demandas", title: "Demandas", icon: KanbanSquare, component: DemandasPage },
  { slug: "clientes", title: "Clientes", icon: Users, component: ClientesPage },
  { slug: "dashboard", title: "Dashboard geral", icon: LayoutDashboard, component: DashboardPage },
  { slug: "acessos", title: "Acessos", icon: ShieldCheck, component: AcessosPage },
];
